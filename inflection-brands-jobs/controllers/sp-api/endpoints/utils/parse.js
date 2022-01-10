import tsvParseSync from 'csv-parse/lib/sync';
import transformData from 'stream-transform';
import xml2js from 'xml2js';
import { parseBooleans, stripPrefix } from 'xml2js/lib/processors';
import { camelCase, transform, unescape } from 'lodash';

import { IGNORE_FIELDS_FROM_CONVVERTING_TO_NUMBER } from '../../../utils/constants';

const parseString = (xml, params) => new Promise((resolve, reject) => {
  xml2js.parseString(xml, params, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

const genericParser = (objValue, objKey) => {
  let value = unescape(objValue);

  const lowerCaseKey = objKey.toLowerCase();
  const ignore = IGNORE_FIELDS_FROM_CONVVERTING_TO_NUMBER.indexOf(lowerCaseKey) > -1;
  if (!ignore) {
    const isInt = str => (/^(\-|\+)?([1-9]+[0-9]*)$/).test(str);
    const isFloat = v => ((v - parseFloat(v)) + 1) >= 0;

    if (isInt(value)) {
      value = parseInt(value, 10);
    } else if (isFloat(value)) {
      value = parseFloat(value);
    } else {
      value = parseBooleans(objValue, objKey);
    }
  }

  return value;
};

const trimComma = str => str.replace(new RegExp('^,*'), '');

export const parseXML = xml => parseString(xml, {
  explicitArray: false,
  explicitRoot: false,
  trim: true,
  mergeAttrs: true,
  charkey: 'value',
  valueProcessors: [trimComma, genericParser],
  tagNameProcessors: [stripPrefix, camelCase],
  attrValueProcessors: [genericParser],
  attrNameProcessors: [stripPrefix, camelCase]
});

export const parseTSV = (tsv) => {
  const json = tsvParseSync(tsv, {
    relax: true,
    delimiter: '\t',
    quote: '',
    skip_empty_lines: true,
    columns: header => header.map(column => camelCase(column))
  });

  const handler = data => transform(data, (result, value, key) => {
    result[key] = genericParser(value, key);
  });

  return new Promise((resolve, reject) => {
    const data = [];
    transformData(json, handler)
      .on('data', (row) => {
        data.push(row);
      })
      .on('error', (e) => {
        reject(e);
      })
      .on('end', () => {
        resolve(data);
      });
  });
};
