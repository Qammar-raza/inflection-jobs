/* eslint-disable no-await-in-loop */
import { uniq } from 'lodash';

import Order from '../../models/order';
import Other from '../../models/other';
import Refund from '../../models/refund';
import Stores from '../../models/stores';

import SaveProduct from '../agenda/helpers/save-report/save-product';

// http://localhost:5500/api/v1/script?method=AddProducts&storeId=616984ab4116ed760c70680a

const AddProducts = async ({ storeId }) => {
  let sellerSkuList = [];
  try {
    const store = await Stores.findOne({ _id: storeId });
    console.log('\n\n', 'store', store);
    if (!store.marketplaces.length) {
      throw new Error('No Marketplaces Available');
    }

    const marketplaces = store.marketplaces.map(
      item => item.marketplaceId
    );
    console.log('\n\n', {
      marketplaces
    });
    for (let i = 0; i < marketplaces.length; i += 1) {
      const orderSkuList = await Order.distinct('sellerSku', {
        storeId,
        marketplaceId: marketplaces[i]
      });
      sellerSkuList = [].concat(orderSkuList);
      const otherSkuList = await Other.distinct('sellerSku', {
        storeId,
        marketplaceId: marketplaces[i]
      });
      sellerSkuList = sellerSkuList.concat(otherSkuList);
      const refundSkuList = await Refund.distinct('sellerSku', {
        storeId,
        marketplaceId: marketplaces[i]
      });
      sellerSkuList = sellerSkuList.concat(refundSkuList);
      console.log('sellerSkuList...', sellerSkuList);
      console.log('sellerSkuList.length...', sellerSkuList.length);
      sellerSkuList = sellerSkuList.filter(s => s && s !== '');
      sellerSkuList = uniq(sellerSkuList);
      console.log('\n uniq sellerSkuList', sellerSkuList);
      if (sellerSkuList) {
        await SaveProduct({
          storeId,
          marketplaceId: marketplaces[i],
          sellerSkuList
        });
      }
      sellerSkuList = [];
    }
  } catch (error) {
    console.log('error...', error);
  }
};

export default AddProducts;
