import S3FS from 's3fs';
import csv from 'csv-parse';
import { uniq, camelCase } from 'lodash';

import agenda from '../../config/high-priority-jobs';

import ReportsDownloaded from '../../../../models/reports-downloaded';

import SaveProduct from '../../helpers/save-report/save-product';
import SaveReport from '../../helpers/save-report/save';

import {
  JOB_STATES,
  // HEADERS_COLUMN,
  FIELDS_TO_CONVERT_TO_NUMBER,
  FIELDS_TO_CONVERT_CURRENCY,
  BRITISH_CURRENCY
} from '../../../utils/constants';

const bucketPath = 'inflection-reports';
const s3Options = {
  region: process.env.AWS_REGION
};
const fsImpl = new S3FS(bucketPath, s3Options);
let sellerSkuList = [];

const GetReport = ({
  storeId,
  marketplaceId,
  path,
  job
}) => new Promise((resolve, reject) => {
  let lineNo = 0;
  const stream = fsImpl.createReadStream(path)
    .on('error', (err) => {
      console.log('Error while reading file.', err);
      reject(err);
    })

    .pipe(csv({
      cast: (value, context) => { // Headers + Data Conversion to Int Float & String
        if (context.header) return camelCase(value);
        if (FIELDS_TO_CONVERT_TO_NUMBER.includes(context.column)) {
          if (FIELDS_TO_CONVERT_CURRENCY.includes(context.column)) {
            if (BRITISH_CURRENCY.includes(marketplaceId)) {
              value = value.replace(/,/g, '');
            } else {
              value = value.replace(/./g, '');
              value = value.replace(/,/g, '.');
            }
          }
          return Number(value);
        }
        return String(value);
      },
      relax: true,
      columns: true, // HEADERS_COLUMN
      delimiter: ',', // Split by Comma
      from_line: 8, // Start from Line#9 i.e. Real Data
      trim: true, // Skip White Spaces
      skip_empty_lines: true // Skip Empty Lines
    }))

    .on('data', (row) => {
      stream.pause();

      // Save in DB
      SaveReport({
        storeId,
        marketplaceId,
        row
      }).then(() => {
        stream.resume();
      });

      const { sku } = row;
      if (sku && sku !== '') {
        sellerSkuList.push(sku);
      }

      // Increment Line No for Testing
      lineNo += 1;

      if (lineNo % 5 === 0) {
        job.touch();
        job.save();
      }
    })

    .on('end', () => {
      sellerSkuList = uniq(sellerSkuList);
      SaveProduct({
        storeId,
        marketplaceId,
        sellerSkuList
      });

      console.log('Read entire file.', lineNo);
      resolve();
    });
});

agenda.define('save-report', { concurrency: 10 }, async (job, done) => {
  console.log('*********************************************************');
  console.log('************   Sync SAVE REPORT Job Started   ***********');
  console.log('*********************************************************');

  job.attrs.state = JOB_STATES.STARTED;
  job.attrs.progress = 0;
  await job.save();

  try {
    const {
      userId,
      storeId
    } = job.attrs.data;
    console.log({
      userId,
      storeId
    });
    const reportEntry = await ReportsDownloaded.findOne({
      userId,
      storeId,
      status: 'Downloaded'
    }).sort({ updatedAt: 1 });
    console.log('reportEntry', reportEntry);

    if (reportEntry) {
      const {
        _id: reportDocumentId,
        marketplaceId,
        path
      } = reportEntry;

      await GetReport({
        storeId,
        marketplaceId,
        path,
        job
      });

      job.attrs.progress = 50;
      await job.save();

      // Delete Download Report Entry
      await ReportsDownloaded.updateOne({
        _id: reportDocumentId
      }, {
        $set: {
          status: 'Completed'
        }
      });
    }

    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    job.attrs.lockedAt = null;
    await job.save();

    console.log('*********************************************************');
    console.log('***********   Sync SAVE REPORT Job Completed   **********');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('*************   Sync SAVE REPORT Job Retry   ************');
    console.log('*********************************************************');
    console.log(error.message);
    console.log('*********************************************************');

    job.attrs.state = JOB_STATES.FAILED;
    job.attrs.failedAt = new Date();
    job.attrs.failReason = error.message;

    await job.save();
  }

  done();
});
