/* eslint-disable no-await-in-loop */
import Order from '../../../../models/order';
import CombineData from '../../../../models/combine-data';

const SaveCombineDataForOrder = async ({
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
  const salesDataArr = await Order.aggregate([{
    $match: {
      storeId,
      marketplaceId,
      timestamp: { $gte: startDate, $lte: endDate }
    }
  }, {
    $group: {
      _id: '$sellerSku',
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
  console.log('\n\n', 'salesDataArr', salesDataArr.length);

  const writeData = [];
  for (let i = 0; i < salesDataArr.length; i += 1) {
    const {
      _id: sellerSku
    } = salesDataArr[i];

    // eslint-disable-next-line no-underscore-dangle
    delete salesDataArr[i]._id;

    const setObj = {
      storeId,
      marketplaceId,
      timestamp: startDate,
      type: 'Order',
      sellerSku,
      ...salesDataArr[i]
    };
    console.log('\n\n', setObj);

    writeData.push({
      updateOne: {
        filter: {
          storeId,
          marketplaceId,
          timestamp: startDate,
          type: 'Order',
          sellerSku
        },
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

  console.log('Save Order', writeData.length);
  if (writeData.length > 0) {
    await CombineData.bulkWrite(writeData);
  }
};

export default SaveCombineDataForOrder;
