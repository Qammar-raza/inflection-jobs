import moment from 'moment';
import { extend } from 'lodash';

import mediumPriorityAgenda from './config/medium-priority-jobs';

import LastUpdateTracker from '../../models/last-update-tracker';
import MediumPriorityAgendaJobs from '../../models/medium-priority-agenda-jobs';

import { JOB_STATES } from '../utils/constants';

export const HandleThrottleReportException = (job, error) => {
  const {
    nextAvailableAt
  } = error;
  job.attrs.state = JOB_STATES.THROTTLE;

  const { data } = job.attrs;
  job.attrs.data = {
    ...data
  };

  job.attrs.nextRunAt = nextAvailableAt;
  return job;
};

export const mergeColumn = (row, columnName) => parseFloat(
  (row.reduce((feild, next) => (feild + (next[columnName] || 0)), 0)).toFixed(2)
);

export const UpdateTrackerForJob = async ({
  storeId,
  name,
  lastUpdatedAt
}) => {
  const setObj = {};
  if (lastUpdatedAt) {
    extend(setObj, { lastUpdatedAt: moment(lastUpdatedAt).toDate() });
  } else {
    extend(setObj, { lastUpdatedAt: new Date() });
  }

  return LastUpdateTracker.updateOne({
    storeId,
    name
  }, {
    $set: setObj
  }, {
    upsert: true
  });
};

export const sleep = ms => (new Promise(resolve => setTimeout(resolve, ms)));

export const getMarketplaceName = (marketplaceId) => {
  switch (marketplaceId) {
    case 'ATVPDKIKX0DER': {
      return 'Amazon.com';
    }
    case 'A2EUQ1WTGCTBG2': {
      return 'Amazon.ca';
    }
    case 'A1AM78C64UM0Y8': {
      return 'Amazon.com.mx';
    }
    case 'A2Q3Y263D00KWC': {
      return 'Amazon.com.br';
    }
    case 'A1F83G8C2ARO7P': {
      return 'Amazon.co.uk';
    }
    case 'A1PA6795UKMFR9': {
      return 'Amazon.de';
    }
    case 'A13V1IB3VIYZZH': {
      return 'Amazon.fr';
    }
    case 'APJ6JRA9NG5V4': {
      return 'Amazon.it';
    }
    case 'A1RKKUPIHCS9HS': {
      return 'Amazon.es';
    }
    case 'A1805IZSGTT6HS': {
      return 'Amazon.nl';
    }
    case 'A2NODRKZP88ZB9': {
      return 'Amazon.se';
    }
    case 'A1C3SOZRARQ6R3': {
      return 'Amazon.pl';
    }
    case 'A33AVAJ2PDY3EV': {
      return 'Amazon.tr';
    }
    case 'A2VIGQ35RCS4UG': {
      return 'Amazon.ae';
    }
    case 'A21TJRUUN4KGV': {
      return 'Amazon.in';
    }
    case 'A19VAU5U5O7RUS': {
      return 'Amazon.sg';
    }
    case 'A39IBJ37TRP1C6': {
      return 'Amazon.au';
    }
    case 'A1VC38T7YXB528': {
      return 'Amazon.jp';
    }
    default: {
      return 'None';
    }
  }
};

export const getMarketplaceIdByCountry = (country) => {
  switch (country) {
    case 'US': {
      return 'ATVPDKIKX0DER';
    }
    case 'CA': {
      return 'A2EUQ1WTGCTBG2';
    }
    case 'MX': {
      return 'A1AM78C64UM0Y8';
    }
    case 'BR': {
      return 'A2Q3Y263D00KWC';
    }
    case 'GB': {
      return 'A1F83G8C2ARO7P';
    }
    case 'DE': {
      return 'A1PA6795UKMFR9';
    }
    case 'FR': {
      return 'A13V1IB3VIYZZH';
    }
    case 'IT': {
      return 'APJ6JRA9NG5V4';
    }
    case 'ES': {
      return 'A1RKKUPIHCS9HS';
    }
    case 'NL': {
      return 'A1805IZSGTT6HS';
    }
    case 'SE': {
      return 'A2NODRKZP88ZB9';
    }
    case 'PL': {
      return 'A1C3SOZRARQ6R3';
    }
    case 'TR': {
      return 'A33AVAJ2PDY3EV';
    }
    case 'AE': {
      return 'A2VIGQ35RCS4UG';
    }
    case 'IN': {
      return 'A21TJRUUN4KGV';
    }
    case 'SG': {
      return 'A19VAU5U5O7RUS';
    }
    case 'AU': {
      return 'A39IBJ37TRP1C6';
    }
    case 'JP': {
      return 'A1VC38T7YXB528';
    }
    default: {
      return 'None';
    }
  }
};

export const getMarketplaceTimezone = (marketplaceId) => {
  switch (marketplaceId) {
    case 'ATVPDKIKX0DER': {
      return 'America/Los_Angeles';
    }
    case 'A2EUQ1WTGCTBG2': {
      return 'America/Los_Angeles';
    }
    case 'A1AM78C64UM0Y8': {
      return 'America/Los_Angeles';
    }
    case 'A2Q3Y263D00KWC': {
      return 'America/Sao_Paulo';
    }
    case 'A1F83G8C2ARO7P': {
      return 'Europe/London';
    }
    case 'A1PA6795UKMFR9': {
      return 'Europe/Paris';
    }
    case 'A13V1IB3VIYZZH': {
      return 'Europe/Paris';
    }
    case 'APJ6JRA9NG5V4': {
      return 'Europe/Paris';
    }
    case 'A1RKKUPIHCS9HS': {
      return 'Europe/Paris';
    }
    case 'A1805IZSGTT6HS': {
      return 'Europe/Paris';
    }
    case 'A2NODRKZP88ZB9': {
      return 'Europe/Paris';
    }
    case 'A1C3SOZRARQ6R3': {
      return 'Europe/Paris';
    }
    case 'A33AVAJ2PDY3EV': {
      return 'Europe/Paris';
    }
    case 'A2VIGQ35RCS4UG': {
      return 'Asia/Dubai';
    }
    case 'A21TJRUUN4KGV': {
      return 'Asia/Dubai';
    }
    case 'A19VAU5U5O7RUS': {
      return 'Asia/Singapore';
    }
    case 'A39IBJ37TRP1C6': {
      return 'Australia/Sydney';
    }
    case 'A1VC38T7YXB528': {
      return 'Asia/Tokyo';
    }
    default: {
      return 'None';
    }
  }
};

export const getCurrencyCode = (marketplaceId) => {
  switch (marketplaceId) {
    case 'ATVPDKIKX0DER': {
      return 'USD';
    }
    case 'A2EUQ1WTGCTBG2': {
      return 'CAD';
    }
    case 'A1AM78C64UM0Y8': {
      return 'MXN';
    }
    case 'A2Q3Y263D00KWC': {
      return 'BRL';
    }
    case 'A1F83G8C2ARO7P': {
      return 'GBP';
    }
    case 'A1PA6795UKMFR9': {
      return 'EUR';
    }
    case 'A2NODRKZP88ZB9': {
      return 'SEK';
    }
    case 'A1C3SOZRARQ6R3': {
      return 'PLN';
    }
    case 'A33AVAJ2PDY3EV': {
      return 'TRY';
    }
    case 'A2VIGQ35RCS4UG': {
      return 'AED';
    }
    case 'A21TJRUUN4KGV': {
      return 'INR';
    }
    case 'A19VAU5U5O7RUS': {
      return 'SGD';
    }
    case 'A39IBJ37TRP1C6': {
      return 'AUD';
    }
    case 'A1VC38T7YXB528': {
      return 'JPY';
    }
    default: {
      return 'None';
    }
  }
};

export const getMarketplaceIdByCurrencyCode = (currencyCode) => {
  switch (currencyCode) {
    case 'USD': {
      return 'ATVPDKIKX0DER';
    }
    case 'CAD': {
      return 'A2EUQ1WTGCTBG2';
    }
    case 'MXN': {
      return 'A1AM78C64UM0Y8';
    }
    case 'BRL': {
      return 'A2Q3Y263D00KWC';
    }
    case 'GBP': {
      return 'A1F83G8C2ARO7P';
    }
    case 'EUR': {
      return 'A1PA6795UKMFR9';
    }
    case 'SEK': {
      return 'A2NODRKZP88ZB9';
    }
    case 'PLN': {
      return 'A1C3SOZRARQ6R3';
    }
    case 'TRY': {
      return 'A33AVAJ2PDY3EV';
    }
    case 'AED': {
      return 'A2VIGQ35RCS4UG';
    }
    case 'INR': {
      return 'A21TJRUUN4KGV';
    }
    case 'SGD': {
      return 'A19VAU5U5O7RUS';
    }
    case 'AUD': {
      return 'A39IBJ37TRP1C6';
    }
    case 'JPY': {
      return 'A1VC38T7YXB528';
    }
    default: {
      return 'None';
    }
  }
};

export const StartCombineDataJobs = async ({
  userId,
  storeId
}) => {
  // Get Past Orders Job
  const pastOrdersJobs = await MediumPriorityAgendaJobs.findOne({
    'data.storeId': storeId,
    name: 'past:orders'
  });

  if (!pastOrdersJobs) {
    // Get Past Combine Data Job
    const pastCombineDataJob = await MediumPriorityAgendaJobs.findOne({
      'data.storeId': storeId,
      name: 'past:combine-data'
    });
    // Get Combine Data Job
    const combineDataJob = await MediumPriorityAgendaJobs.findOne({
      'data.storeId': storeId,
      name: 'combine-data'
    });
    // If No Past Combine Data & Combine Data Job Found
    if (!pastCombineDataJob && !combineDataJob) {
      const startOfMonth = moment().startOf('month').toISOString();

      const globalEndDate = {
        day: moment(startOfMonth).get('date'),
        month: moment(startOfMonth).get('month'),
        year: moment(startOfMonth).get('year')
      };

      mediumPriorityAgenda
        .create('past:combine-data', { userId, storeId, globalEndDate })
        .unique({
          'data.userId': userId,
          'data.storeId': storeId
        })
        .repeatEvery('30 minutes')
        .schedule('1 minute')
        .save();
    }
  }
};
