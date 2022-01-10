/* eslint-disable no-await-in-loop */
import moment from 'moment';

import agenda from '../../config/high-priority-jobs';

import AccountDetails from '../../../../models/account-details';

import PaymentReports from '../../helpers/payment-reports/aws-task-runner';

import { getMarketplaceTimezone } from '../../utils';
import { JOB_STATES } from '../../../utils/constants';

agenda.define('payment-report', { concurrency: 3, priority: 'highest' }, async (job, done) => {
  console.log('*********************************************************');
  console.log('************   PAYMENT REPORT Job Started   *************');
  console.log('*********************************************************');

  job.attrs.state = JOB_STATES.STARTED;
  job.attrs.progress = 0;

  await job.save();
  const {
    userId,
    storeId,
    sellerId,
    marketplaces,
    startDate,
    endDate
  } = job.attrs.data;

  console.log('\n', {
    startDate,
    endDate
  });

  try {
    const accountDetails = await AccountDetails.findOne({ sellerId });
    const {
      monsSelDirPaid,
      monsSelDirMcid
    } = accountDetails;
    for (let i = 0; i < marketplaces.length; i += 1) {
      const marketplaceName = getMarketplaceTimezone(marketplaces[i]);
      await PaymentReports({
        userId,
        storeId,
        sellerId,
        marketplaceId: marketplaces[i],
        marketplaceName,
        monsSelDirPaid,
        monsSelDirMcid,
        startDate,
        endDate
      });
    }
    console.log('*********************************************************');
    console.log('***********   PAYMENT REPORT Job Completed   ************');
    console.log('*********************************************************');

    const sDate = moment(endDate).add(1, 'day').toISOString();
    const eDate = moment(sDate).endOf('month').toISOString();
    job.attrs.data = {
      userId,
      storeId,
      sellerId,
      marketplaces,
      startDate: sDate,
      endDate: eDate
    };
    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;

    await job.save();
  } catch (error) {
    console.log('*********************************************************');
    console.log('*************   PAYMENT REPORT Job Retry   **************');
    console.log('*********************************************************');
    console.log(error.message);
    console.log('*********************************************************');

    job.attrs.data = {
      userId,
      storeId,
      sellerId,
      marketplaces,
      startDate,
      endDate
    };
    job.attrs.state = JOB_STATES.FAILED;
    job.attrs.failedAt = new Date();
    job.attrs.failReason = error.message;

    await job.save();
  }

  done();
});
