import moment from 'moment';

import Stores from '../../models/stores';

import highPriorityAgenda from './config/high-priority-jobs';
import lowPriorityAgenda from './config/low-priority-jobs';
import mediumPriorityAgenda from './config/medium-priority-jobs';

const StartAgendaJobs = async ({ userId, storeId }) => {
  console.log('\n\n', 'StartAgendaJobs', {
    userId,
    storeId
  });
  console.log({ userId, storeId });
  const store = await Stores.findOne({ _id: storeId });
  const { sellerId } = store;
  if (!store.marketplaces.length) {
    throw new Error('No Marketplaces Available');
  }

  const marketplaces = store.marketplaces.map(
    item => item.marketplaceId
  );
  console.log('\n\n', {
    marketplaces
  });
  const initStartDate = moment({ day: 1, month: 0, year: 2018 }).toISOString();
  const initEndDate = moment().subtract(1, 'month').endOf('month').toISOString();
  const sDate = moment(initEndDate).add(1, 'second').toISOString();
  const eDate = moment(sDate).endOf('month').toISOString();

  console.log('\n\n', {
    initStartDate,
    initEndDate,
    sDate,
    eDate
  });

  /* *
  highPriorityAgenda
    .create('monthly-payment-report', {
      userId,
      storeId,
      sellerId,
      marketplaces,
      startDate: initStartDate,
      endDate: initEndDate
    })
    .unique({
      'data.userId': userId,
      'data.storeId': storeId
    })
    .repeatEvery('2 hours')
    .schedule('in 1 minute')
    .save();

  /* *
  highPriorityAgenda
    .create('payment-report', {
      userId,
      storeId,
      sellerId,
      marketplaces,
      startDate: sDate,
      endDate: eDate
    })
    .unique({
      'data.userId': userId,
      'data.storeId': storeId
    })
    .repeatEvery('0 0 4 * *')
    .save();

  /* *
  highPriorityAgenda
    .create('save-report', { userId, storeId })
    .unique({
      'data.userId': userId,
      'data.storeId': storeId
    })
    .repeatEvery('15 minutes')
    .schedule('in 10 minutes')
    .save();

  /* *
  mediumPriorityAgenda
    .create('combine-data', { userId, storeId })
    .unique({
      'data.userId': userId,
      'data.storeId': storeId
    })
    .repeatEvery('1 hour')
    .schedule('20 minutes')
    .save();

  /* *
  mediumPriorityAgenda
    .create('apply-formulas', { userId, storeId })
    .unique({
      'data.userId': userId,
      'data.storeId': storeId
    })
    .repeatEvery('1 hour')
    .schedule('30 minutes')
    .save();

  /* *
  for (let i = 0; i < marketplaces.length; i += 1) {
    const marketplaceId = marketplaces[i];
    lowPriorityAgenda
      .create('merge-bulk-cost', { userId, storeId, marketplaceId })
      .unique({
        'data.userId': userId,
        'data.storeId': storeId,
        'data.marketplaceId': marketplaceId
      })
      .repeatEvery('1 hour')
      .schedule('30 minutes')
      .save();
  }
  /* */
};

export default StartAgendaJobs;
