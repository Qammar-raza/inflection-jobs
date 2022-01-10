import { extend } from 'lodash';

import invokeRequest from '../utils/invoke-request';

const CreateReport = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  marketplaceIds,
  reportType,
  dataStartTime,
  dataEndTime,
  reportOptions
}) => {
  const body = {};
  if (reportType) extend(body, { reportType });
  if (marketplaceIds && marketplaceIds.length) extend(body, { marketplaceIds });
  if (dataStartTime) extend(body, { dataStartTime });
  if (dataEndTime) extend(body, { dataEndTime });
  if (reportOptions) extend(body, { reportOptions });

  const { response } = await invokeRequest({
    region,
    refreshToken,
    clientId,
    clientSecret,
    accessKey,
    secretKey,
    role,
    request: {
      operation: 'createReport',
      endpoint: 'reports',
      body,
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

export default CreateReport;
