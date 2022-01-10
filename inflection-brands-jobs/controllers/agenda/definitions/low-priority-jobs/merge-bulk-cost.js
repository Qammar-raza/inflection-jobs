/* eslint-disable no-await-in-loop */
import { extend, uniq, sortBy } from 'lodash';
import moment from 'moment';

import agenda from '../../config/low-priority-jobs';

import CostFiles from '../../../../models/cost-files';
import ProductCosts from '../../../../models/product-costs';
import DailySalesHistory from '../../../../models/daily-sales-history';

import ApplyFormulasOnMonthlySales from '../../helpers/apply-formulas/monthly-sales';

import { JOB_STATES } from '../../../utils/constants';

agenda.define('merge-bulk-cost', { concurrency: 3 }, async (job, done) => {
  console.log('*********************************************************');
  console.log('************   Sync MERGE BULK COST Started   ***********');
  console.log('*********************************************************');

  const {
    storeId,
    marketplaceId
  } = job.attrs.data;

  job.attrs.state = JOB_STATES.IN_PROGRESS;
  job.attrs.progress = 0;
  await job.save();

  try {
    const costFileEntry = await CostFiles.findOne({
      isSynced: false
    }).sort({ timestamp: 1 });
    console.log('\n\n', 'costFileEntry', costFileEntry);

    if (costFileEntry) {
      const { _id: costFileId } = costFileEntry;
      const productCosts = await ProductCosts.find({ costFileId });
      console.log('\n\n', 'productCosts', productCosts.length);
      for (let i = 0; i < productCosts.length; i += 1) {
        const {
          startDate,
          endDate,
          sellerSku,
          costPrice
        } = productCosts[i];

        if (costPrice > 0) {
          const productDailyHistory = await DailySalesHistory.find({
            storeId,
            marketplaceId,
            timestamp: { $gte: startDate, $lte: endDate },
            sellerSku,
            $or: [{
              unitsSold: { $gte: 0 }
            }, {
              unitsRefunded: { $gte: 0 }
            }]
          });

          const dates = [];
          if (productDailyHistory) {
            const writeData = [];
            for (let j = 0; j < productDailyHistory.length; j += 1) {
              const {
                _id: salesDailyHistoryId,
                unitsSold,
                unitsRefunded
              } = productDailyHistory[j];

              const setObj = {};
              let saleCostPrice = 0;
              let refundCostPrice = 0;

              if (unitsSold > 0) {
                saleCostPrice = -1 * (unitsSold * costPrice);
                extend(setObj, { saleCostPrice });
              }

              if (unitsRefunded > 0) {
                refundCostPrice = unitsRefunded * costPrice;
                extend(setObj, { refundCostPrice });
              }

              writeData.push({
                updateOne: {
                  filter: {
                    _id: salesDailyHistoryId
                  },
                  update: {
                    $set: {
                      ...setObj
                    }
                  }
                }
              });

              dates.push(startDate);
            }

            console.log('\n\n', 'writeData', writeData.length);
            if (writeData.length > 0) {
              await DailySalesHistory.bulkWrite(writeData);
            }

            costFileEntry.isSynced = true;
            await costFileEntry.save();

            await job.touch();
            await job.save();
          }
          const uniqueDates = uniq(dates);
          const sortedDates = sortBy(uniqueDates);
          const startDateForMonth = moment(sortedDates[0]).startOf('month');
          const endDateForMonth = moment(sortedDates[sortedDates.length - 1]).endOf('month');
          const diff = endDateForMonth.diff(startDateForMonth, 'months');
          let nextStartDate = startDateForMonth;
          console.log('\n\n', {
            nextStartDate,
            nextEndDate: moment(nextStartDate).endOf('month')
          });
          for (let j = 0; j < diff + 1; j += 1) {
            const nextEndDate = moment(nextStartDate).endOf('month');
            await ApplyFormulasOnMonthlySales({
              storeId,
              marketplaceId,
              startDate: nextStartDate,
              endDate: nextEndDate
            });

            nextStartDate = moment(nextStartDate).add(1, 'month');
          }
        }
      }
    }

    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    job.attrs.lockedAt = null;
    await job.save();

    console.log('*********************************************************');
    console.log('***********   Sync MERGE BULK COST Completed   **********');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('*************   Sync MERGE BULK COST Retry   ************');
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
