import invokeRequest from '../utils/invoke-request';

const GetReportDocument = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  reportDocumentId
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
      operation: 'getReportDocument',
      endpoint: 'reports',
      path: {
        reportDocumentId
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

export default GetReportDocument;
