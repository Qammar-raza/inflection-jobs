import invokeRequest from '../utils/invoke-request';

const DeleteDestination = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  destinationId
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
      operation: 'deleteDestination',
      endpoint: 'notifications',
      path: {
        destinationId
      }
    }
  });

  if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response;
};

export default DeleteDestination;
