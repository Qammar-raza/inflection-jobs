import moment from 'moment';
import { extend, isArray } from 'lodash';

import * as Endpoints from './endpoints';

import Stores from '../../models/stores';

import { RETRYABLE_ERRORS } from '../utils/constants';
import { ThrottlingException, SPAPIErrorException } from '../utils/custom-exceptions';

const {
  SELLING_PARTNER_APP_CLIENT_ID: clientId,
  SELLING_PARTNER_APP_CLIENT_SECRET: clientSecret,
  SELLING_PARTNER_ACCESS_KEY_ID: accessKey,
  SELLING_PARTNER_SECRET_ACCESS_KEY: secretKey,
  SELLING_PARTNER_ROLE: role
} = process.env;

const SPAPI = async ({ endpoint, params }) => {
  const { userId, storeId } = params;
  const store = await Stores.findOne({ _id: storeId });
  const { region, refreshToken } = store;

  extend(params, {
    clientId,
    clientSecret,
    accessKey,
    secretKey,
    role,
    region,
    refreshToken
  });

  console.log('\n\n', 'params', params);
  console.log('endpoint', endpoint);

  try {
    const response = await Endpoints[endpoint](params);

    return response;
  } catch (e) {
    for (let i = 0; i < RETRYABLE_ERRORS.length; i += 1) {
      const message = RETRYABLE_ERRORS[i];
      const errorMessage = isArray(e.message) ? e.message[0] : e.message;
      if (errorMessage) {
        let nextAvailableAt;
        if (errorMessage === 'quota exceeded') {
          ({ nextAvailableAt } = e);
        }
        if (errorMessage.includes(message)) {
          nextAvailableAt = moment().add(60, 'seconds').toDate();
        }

        throw new ThrottlingException({
          message: e.message,
          nextAvailableAt,
          endpoint,
          userId,
          storeId
        });
      }
    }

    console.log('Error: ', e);

    throw new SPAPIErrorException({
      message: e.message || e,
      endpoint,
      userId,
      storeId
    });
  }
};

export default SPAPI;
