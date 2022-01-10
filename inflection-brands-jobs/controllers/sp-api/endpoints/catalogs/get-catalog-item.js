import invokeRequest from '../utils/invoke-request';

const GetCatalogItem = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  marketplaceId,
  asin
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
      operation: 'getCatalogItem',
      endpoint: 'catalogItems',
      path: {
        asin
      },
      query: {
        MarketplaceId: marketplaceId
      },
      includedData: ['images']
    }
  });

  if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response;
};

export default GetCatalogItem;
