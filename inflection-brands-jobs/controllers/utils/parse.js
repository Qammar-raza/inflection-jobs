import { camelCase, unescape } from 'lodash';
import { parseBooleans } from 'xml2js/lib/processors';

import { IGNORE_FIELDS_FROM_CONVVERTING_TO_NUMBER } from './constants';

// Parse JSON with Camel Case
export const ParseJsonWithCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => ParseJsonWithCamelCase(v));
  } if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: ParseJsonWithCamelCase(obj[key])
      }), {}
    );
  }

  return obj;
};

// Generic Parser for Reports
export const GenericParser = (objValue, objKey) => {
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
