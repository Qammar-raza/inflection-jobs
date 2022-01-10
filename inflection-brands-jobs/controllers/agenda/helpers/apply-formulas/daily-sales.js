/* eslint-disable no-await-in-loop */
import { uniq } from 'lodash';

import CombineData from '../../../../models/combine-data';
import ProductCosts from '../../../../models/product-costs';
import DailySalesHistory from '../../../../models/daily-sales-history';

const ApplyFormulasOnDailySales = async ({
  storeId,
  marketplaceId,
  startDate,
  endDate
}) => {
  console.log('ApplyFormulasOnDailySales', {
    storeId,
    marketplaceId,
    startDate,
    endDate
  });

  let sellerSkuList = await CombineData.distinct('sellerSku', {
    storeId,
    marketplaceId,
    timestamp: { $gte: startDate, $lte: endDate }
  });
  sellerSkuList = sellerSkuList.filter(s => s !== '');
  sellerSkuList = uniq(sellerSkuList);
  console.log('sellerSkuList', sellerSkuList.length);

  const writeData = [];
  for (let i = 0; i < sellerSkuList.length; i += 1) {
    const sellerSku = sellerSkuList[i];
    // console.log('sellerSku', sellerSku);

    const types = await CombineData.distinct('type', {
      storeId,
      marketplaceId,
      timestamp: { $gte: startDate, $lte: endDate },
      sellerSku
    });
    // console.log('types', types);

    let unitsSold = 0;
    let orderSales = 0;
    let saleCostPrice = 0;
    if (types.includes('Order')) {
      const [orderFinances] = await CombineData.aggregate([{
        $match: {
          storeId,
          marketplaceId,
          timestamp: { $gte: startDate, $lte: endDate },
          type: 'Order',
          sellerSku
        }
      }, {
        $group: {
          _id: null,
          unitsSold: { $sum: '$quantity' },
          orderSales: { $sum: '$productSales' }
        }
      }]);
      ({
        unitsSold = 0,
        orderSales = 0
      } = orderFinances || {});

      if (unitsSold > 0) {
        const product = await ProductCosts.findOne({
          storeId,
          marketplaceId,
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
          sellerSku,
          costPrice: { $gt: 0 }
        });
        if (product) {
          saleCostPrice = -1 * (unitsSold * product.costPrice);
        }
      }
    }
    // console.log({
    //   unitsSold,
    //   orderSales,
    //   saleCostPrice
    // });

    let unitsRefunded = 0;
    let refundSales = 0;
    let refundCostPrice = 0;
    if (types.includes('Refund')) {
      const [orderFinances] = await CombineData.aggregate([{
        $match: {
          storeId,
          marketplaceId,
          timestamp: { $gte: startDate, $lte: endDate },
          type: 'Refund',
          sellerSku
        }
      }, {
        $group: {
          _id: null,
          unitsRefunded: { $sum: '$quantity' },
          refundSales: { $sum: '$productSales' }
        }
      }]);
      ({
        unitsRefunded = 0,
        refundSales = 0
      } = orderFinances || {});

      if (unitsRefunded > 0) {
        const product = await ProductCosts.findOne({
          storeId,
          marketplaceId,
          startDate: { $lte: startDate },
          endDate: { $gte: endDate },
          sellerSku,
          costPrice: { $gt: 0 }
        });
        if (product) {
          refundCostPrice = (unitsRefunded * product.costPrice);
        }
      }
    }
    // console.log({
    //   unitsRefunded,
    //   refundSales,
    //   refundCostPrice
    // });

    const [allFinances] = await CombineData.aggregate([{
      $match: {
        storeId,
        marketplaceId,
        timestamp: { $gte: startDate, $lte: endDate },
        type: { $in: types },
        sellerSku
      }
    }, {
      $group: {
        _id: null,
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
        other: { $sum: '$other' }
      }
    }]);
    const {
      productSalesTax = 0,
      shippingCredits = 0,
      shippingCreditsTax = 0,
      giftWrapCredits = 0,
      giftwrapCreditsTax = 0,
      promotionalRebates = 0,
      promotionalRebatesTax = 0,
      marketplaceWithheldTax = 0,
      sellingFees = 0,
      fbaFees = 0,
      otherTransactionFees = 0,
      other = 0
    } = allFinances || {};
    // console.log({
    //   productSalesTax,
    //   shippingCredits,
    //   shippingCreditsTax,
    //   giftWrapCredits,
    //   giftwrapCreditsTax,
    //   promotionalRebates,
    //   promotionalRebatesTax,
    //   marketplaceWithheldTax,
    //   sellingFees,
    //   fbaFees,
    //   otherTransactionFees,
    //   other
    // });

    writeData.push({
      updateOne: {
        filter: {
          storeId,
          marketplaceId,
          timestamp: startDate,
          sellerSku
        },
        update: {
          $set: {
            unitsSold,
            orderSales,
            saleCostPrice,
            unitsRefunded,
            refundSales,
            refundCostPrice,
            productSalesTax,
            shippingCredits,
            shippingCreditsTax,
            giftWrapCredits,
            giftwrapCreditsTax,
            promotionalRebates,
            promotionalRebatesTax,
            marketplaceWithheldTax,
            sellingFees,
            fbaFees,
            otherTransactionFees,
            other
          }
        },
        upsert: true
      }
    });
  }

  console.log('Save DailySalesHistory', writeData.length);
  if (writeData.length > 0) {
    await DailySalesHistory.bulkWrite(writeData);
  }
};

export default ApplyFormulasOnDailySales;
