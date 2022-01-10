import { extend } from 'lodash';

import invokeRequest from '../utils/invoke-request';

const CreateSubscription = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  notificationType,
  payloadVersion,
  destinationId
}) => {
  const body = {};
  if (payloadVersion) extend(body, { payloadVersion });
  if (destinationId) extend(body, { destinationId });

  const { response } = await invokeRequest({
    region,
    refreshToken,
    clientId,
    clientSecret,
    accessKey,
    secretKey,
    role,
    request: {
      operation: 'createSubscription',
      endpoint: 'notifications',
      path: {
        notificationType
      },
      body
    }
  });

  if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response;
};

export default CreateSubscription;
