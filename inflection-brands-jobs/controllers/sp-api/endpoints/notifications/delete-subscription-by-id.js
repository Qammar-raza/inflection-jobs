import invokeRequest from '../utils/invoke-request';

const DeleteSubscriptionById = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  notificationType,
  subscriptionId
}) => {
  const { response } = await invokeRequest({
    region,
    refreshToken,
    clientId,
    clientSecret,
    accessKey,
    secretKey,
    role,
    request: {
      operation: 'deleteSubscriptionById',
      endpoint: 'notifications',
      path: {
        notificationType,
        subscriptionId
      }
    }
  });

  if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response;
};

export default DeleteSubscriptionById;
