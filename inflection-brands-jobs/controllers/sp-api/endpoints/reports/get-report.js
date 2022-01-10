import invokeRequest from '../utils/invoke-request';

const GetReport = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  reportId
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
      operation: 'getReport',
      endpoint: 'reports',
      path: {
        reportId
      },
      options: {
        version: '2021-06-30'
      }
    }
  });

  if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response;
};

export default GetReport;
