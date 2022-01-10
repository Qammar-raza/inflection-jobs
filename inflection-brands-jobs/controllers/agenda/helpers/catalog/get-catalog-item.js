import SPAPI from '../../../sp-api';

const GetCatalogItem = async ({
  userId,
  storeId,
  marketplaceId,
  asin
}) => {
  try {
    const items = await SPAPI({
      endpoint: 'GetCatalogItem',
      params: {
        userId,
        storeId,
        marketplaceId,
        asin
      }
    });

    return Promise.resolve(items);
  } catch (error) {
    throw error;
  }
};
export default GetCatalogItem;
