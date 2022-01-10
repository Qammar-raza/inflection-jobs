/* eslint-disable no-await-in-loop */
import moment from 'moment';

import agenda from '../../config/medium-priority-jobs';

import SaveCombineDataForOrder from '../../helpers/combine-data/save-combine-data-for-order';
import SaveCombineDataForRefund from '../../helpers/combine-data/save-combine-data-for-refund';
import SaveCombineDataForDay from '../../helpers/combine-data/save-combine-data-for-day';

import LastUpdateTracker from '../../../../models/last-update-tracker';
import ReportsDownloaded from '../../../../models/reports-downloaded';
import Stores from '../../../../models/stores';

import { JOB_STATES } from '../../../utils/constants';
import { getMarketplaceTimezone, UpdateTrackerForJob } from '../../utils';

agenda.define('combine-data', { concurrency: 3 }, async (job, done) => {
  console.log('*********************************************************');
  console.log('***************   COMBINE DATA Started   ****************');
  console.log('*********************************************************');

  job.attrs.state = JOB_STATES.STARTED;
  job.attrs.progress = 0;
  await job.save();

  const { userId, storeId } = job.attrs.data;
  try {
    console.log({
      userId,
      storeId
    });

    let sDate;
    let eDate;
    const tracker = await LastUpdateTracker.findOne({
      storeId,
      name: 'CombineData'
    });
    if (!tracker) {
      sDate = moment({ day: 1, month: 0, year: 2018 }).startOf('day').toDate();
      eDate = moment(sDate).endOf('month').toDate();
    } else {
      sDate = moment(tracker.lastUpdatedAt).add(1, 'second').startOf('month').toDate();
      eDate = moment(sDate).endOf('month').toDate();
    }
    const difference = moment(eDate).diff(moment(sDate).toDate(), 'days');
    console.log({
      sDate,
      eDate,
      difference
    });

    let terminateJob = false;
    const reportEntry = await ReportsDownloaded.findOne({
      userId,
      storeId,
      status: 'Completed'
    }).sort({ updatedAt: -1 });
    if (reportEntry) {
      const reportStartDate = moment(reportEntry.timestamp).toDate();
      const reportEndDate = moment(reportStartDate).endOf('month').toDate();
      const diff = moment(eDate).diff(moment(sDate).toDate(), 'days');
      console.log({
        reportStartDate,
        reportEndDate,
        diff
      });

      if (moment(sDate).isSameOrBefore(moment(reportStartDate))
        && moment(eDate).isSameOrBefore(moment(reportEndDate))) {
        console.log('Can Combine Data');
      } else {
        terminateJob = true;
      }
    }

    if (!terminateJob) {
      const store = await Stores.findOne({ _id: storeId });

      const { marketplaces } = store;
      console.log('marketplaces,', marketplaces);

      job.attrs.state = JOB_STATES.IN_PROGRESS;
      await job.save();

      for (let day = 0; day <= difference; day += 1) { // end - start days
        for (let i = 0; i < marketplaces.length; i += 1) {
          console.log({ i, day });
          const { marketplaceId } = marketplaces[i];

          const timezone = getMarketplaceTimezone(marketplaceId);

          const startDate = moment.tz(sDate, timezone).add(day, 'days').startOf('day').toDate();
          const endDate = moment.tz(sDate, timezone).add(day, 'days').endOf('day').toDate();

          await SaveCombineDataForOrder({
            storeId,
            marketplaceId,
            startDate,
            endDate
          });

          await job.touch();
          await job.save();

          await SaveCombineDataForRefund({
            storeId,
            marketplaceId,
            startDate,
            endDate
          });

          await job.touch();
          await job.save();

          await SaveCombineDataForDay({
            storeId,
            marketplaceId,
            startDate,
            endDate
          });

          await job.touch();
          await job.save();
        }
      }

      await UpdateTrackerForJob({
        storeId,
        name: 'CombineData',
        lastUpdatedAt: moment(eDate)
      });
    }

    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    job.attrs.lockedAt = null;
    await job.save();

    console.log('*********************************************************');
    console.log('**************   COMBINE DATA Completed   ***************');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('****************   COMBINE DATA Retry   *****************');
    console.log('*********************************************************');
    console.log('error', error);

    await job.save();
  }

  done();
});
