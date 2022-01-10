import invokeRequest from '../utils/invoke-request';

import { sleep, mergeFinancialEvents } from './utils';
import { UNKNOWN_CHARS } from '../../../utils/constants';

const ListFinancialEventsByOrderIdByNextToken = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  nextToken
}) => {
  const restoreRate = 0.5;
  const { client, response } = await invokeRequest({
    region,
    refreshToken,
    clientId,
    clientSecret,
    accessKey,
    secretKey,
    role,
    request: {
      operation: 'finances.listFinancialEvents',
      query: {
        NextToken: nextToken
      },
      options: {
        raw_result: true
      }
    }
  });

  for (let i = 0; i < UNKNOWN_CHARS.length; i += 1) {
    const unknownChar = UNKNOWN_CHARS[i];
    response.body = response.body.replace(
      new RegExp(unknownChar.key, 'g'), unknownChar.value
    );
  }

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(response.body.replace(/\n/g, ''));
  } catch (e) {
    console.log('\n\n', 'jsonResponse', jsonResponse);

    throw e;
  }
  if (jsonResponse.errors) {
    const error = jsonResponse.errors[0];
    // Refresh tokens when expired
    if (response.statusCode === 403 && error.code === 'Unauthorized') {
      if (/access token.*expired/.test(error.details)) {
        await client.refreshAccessToken();
        return ListFinancialEventsByOrderIdByNextToken({
          region,
          refreshToken,
          clientId,
          clientSecret,
          accessKey,
          secretKey,
          role,
          nextToken
        });
      } if (/security token.*expired/.test(error.message)) {
        await client.refreshRoleCredentials();
        return ListFinancialEventsByOrderIdByNextToken({
          region,
          refreshToken,
          clientId,
          clientSecret,
          accessKey,
          secretKey,
          role,
          nextToken
        });
      }
    // Retry when call is throttled
    } else if (response.statusCode === 429 && error.code === 'QuotaExceeded') {
      if (response.headers['x-amzn-ratelimit-limit'] || restoreRate) {
        const nextAvailableAt = response.headers['x-amzn-ratelimit-limit'] ? (1 / (response.headers['x-amzn-ratelimit-limit'] * 1)) : restoreRate;
        throw new Error({
          message: 'quota exceeded',
          nextAvailableAt
        });
      }
    }
    throw new Error(error);
  }

  let { FinancialEvents: financialEvents } = jsonResponse.payload;

  if (jsonResponse.payload.NextToken) {
    await sleep(2000);
    const nextFinancialEvents = await ListFinancialEventsByOrderIdByNextToken({
      region,
      refreshToken,
      clientId,
      clientSecret,
      accessKey,
      secretKey,
      role,
      nextToken: jsonResponse.payload.NextToken
    });
    financialEvents = mergeFinancialEvents(
      financialEvents,
      nextFinancialEvents
    );
  }

  return financialEvents;
};

export default ListFinancialEventsByOrderIdByNextToken;
