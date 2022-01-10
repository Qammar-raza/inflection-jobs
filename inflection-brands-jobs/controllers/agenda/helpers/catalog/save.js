import { extend, isEmpty } from 'lodash';

import Products from '../../../../models/products';

const SaveCatalog = async ({ storeId, data }) => {
  console.log('\n\n', 'SaveCatalog => data', data.length);
  const queryOperation = [];
  for (let i = 0; i < data.length; i += 1) {
    const {
      marketplaceId,
      asin,
      imageUrl,
      productBrand,
      productGroup,
      salesRanking
    } = data[i];

    const setObj = {};
    if (imageUrl) {
      extend(setObj, { imageUrl });
    }
    if (productBrand) {
      extend(setObj, { productBrand });
    }
    if (productGroup) {
      extend(setObj, { productGroup });
    }
    if (salesRanking) {
      extend(setObj, { salesRanking });
    }
    if (!isEmpty(setObj)) {
      queryOperation.push({
        updateMany: {
          filter: {
            storeId,
            marketplaceId,
            asin
          },
          update: {
            ...setObj,
            catalogUpdatedAt: new Date()
          }
        }
      });
    }
  }

  console.log('\n\n', 'SaveCatalog => ', queryOperation.length);
  if (queryOperation.length > 0) {
    await Products.bulkWrite(queryOperation);
  }

  return Promise.resolve();
};

export default SaveCatalog;
