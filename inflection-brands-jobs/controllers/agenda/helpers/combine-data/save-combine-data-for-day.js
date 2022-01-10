/* eslint-disable no-await-in-loop */
import { extend } from 'lodash';

import Other from '../../../../models/other';
import CombineData from '../../../../models/combine-data';

const SaveCombineDataForDay = async ({
  storeId,
  marketplaceId,
  startDate,
  endDate
}) => {
  console.log({
    storeId,
    marketplaceId,
    startDate,
    endDate
  });

  const salesDataArr = await Other.aggregate([{
    $match: {
      storeId,
      marketplaceId,
      timestamp: { $gte: startDate, $lte: endDate }
    }
  }, {
    $group: {
      _id: {
        type: '$type',
        sellerSku: '$sellerSku'
      },
      quantity: { $sum: '$quantity' },
      productSales: { $sum: '$productSales' },
      productSalesTax: { $sum: '$productSalesTax' },
      shippingCredits: { $sum: '$shippingCredits' },
      shippingCreditsTax: { $sum: '$shippingCreditsTax' },
      giftWrapCredits: { $sum: '$giftWrapCredits' },
      giftwrapCreditsTax: { $sum: '$giftwrapCreditsTax' },
      promotionalRebates: { $sum: '$promotionalRebates' },
      promotionalRebatesTax: { $sum: '$promotionalRebatesTax' },
      marketplaceWithheldTax: { $sum: '$marketplaceWithheldTax' },
      sellingFees: { $sum: '$sellingFees' },
      fbaFees: { $sum: '$fbaFees' },
      otherTransactionFees: { $sum: '$otherTransactionFees' },
      other: { $sum: '$other' },
      total: { $sum: '$total' }
    }
  }]);

  const writeData = [];
  for (let i = 0; i < salesDataArr.length; i += 1) {
    const {
      _id: { type, sellerSku }
    } = salesDataArr[i];

    // eslint-disable-next-line no-underscore-dangle
    delete salesDataArr[i]._id;

    const selector = {
      storeId,
      marketplaceId
    };
    if (sellerSku && sellerSku !== '') {
      extend(selector, {
        timestamp: startDate,
        type,
        sellerSku
      });
    } else {
      const newType = type === '' ? 'No Type' : type;
      extend(selector, {
        type: `${newType}_`,
        timestamp: startDate
      });
    }
    const setObj = {
      ...selector,
      ...salesDataArr[i]
    };
    console.log(selector, setObj);

    writeData.push({
      updateOne: {
        filter: selector,
        update: {
          $setOnInsert: {
            createdAt: new Date()
          },
          $set: {
            ...setObj,
            updatedAt: new Date()
          }
        },
        upsert: true
      }
    });
  }

  console.log('Save Other', writeData.length);
  if (writeData.length > 0) {
    await CombineData.bulkWrite(writeData);
  }
};

export default SaveCombineDataForDay;
