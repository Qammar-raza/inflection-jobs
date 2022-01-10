/* eslint-disable no-await-in-loop */
import Refund from '../../../../models/refund';
import CombineData from '../../../../models/combine-data';

const SaveCombineDataForRefund = async ({
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

  const salesDataArr = await Refund.aggregate([{
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
      type: 'Refund',
      sellerSku,
      ...salesDataArr[i]
    };
    console.log(setObj);

    writeData.push({
      updateOne: {
        filter: {
          storeId,
          marketplaceId,
          timestamp: startDate,
          type: 'Refund',
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

  console.log('Save Refund', writeData.length);
  if (writeData.length > 0) {
    await CombineData.bulkWrite(writeData);
  }
};

export default SaveCombineDataForRefund;
