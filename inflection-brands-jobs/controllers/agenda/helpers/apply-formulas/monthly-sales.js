import CombineData from '../../../../models/combine-data';
import DailySalesHistory from '../../../../models/daily-sales-history';
import MonthlySalesHistory from '../../../../models/monthly-sales-history';

const ApplyFormulasOnMonthlySales = async ({
  storeId,
  marketplaceId,
  startDate,
  endDate
}) => {
  console.log('ApplyFormulasOnMonthlySales', {
    storeId,
    marketplaceId,
    startDate,
    endDate
  });

  const [dailySales] = await DailySalesHistory.aggregate([{
    $match: {
      storeId,
      marketplaceId,
      timestamp: { $gte: startDate, $lte: endDate }
    }
  }, {
    $group: {
      _id: null,
      unitsSold: { $sum: '$unitsSold' },
      orderSales: { $sum: '$orderSales' },
      saleCostPrice: { $sum: '$saleCostPrice' },
      unitsRefunded: { $sum: '$unitsRefunded' },
      refundSales: { $sum: '$refundSales' },
      refundCostPrice: { $sum: '$refundCostPrice' }
    }
  }]);
  const {
    unitsSold = 0,
    orderSales = 0,
    saleCostPrice = 0,
    unitsRefunded = 0,
    refundSales = 0,
    refundCostPrice = 0
  } = dailySales || {};

  const grossSales = orderSales + refundSales;

  const [allFinances] = await CombineData.aggregate([{
    $match: {
      storeId,
      marketplaceId,
      timestamp: { $gte: startDate, $lte: endDate }
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
    giftWrapCreditsTax = 0,
    promotionalRebates = 0,
    promotionalRebatesTax = 0,
    marketplaceWithheldTax = 0,
    sellingFees = 0,
    fbaFees = 0,
    otherTransactionFees = 0,
    other = 0
  } = allFinances || {};

  const netRevenues = (
    grossSales + shippingCredits + giftWrapCredits + refundSales + promotionalRebates
  );

  const productCosts = saleCostPrice + refundCostPrice;

  const [transferFinances] = await CombineData.aggregate([{
    $match: {
      storeId,
      marketplaceId,
      timestamp: { $gte: startDate, $lte: endDate },
      type: 'Transfer_'
    }
  }, {
    $group: {
      _id: null,
      otherOfTransfer: { $sum: '$other' }
    }
  }]);
  const {
    otherOfTransfer = 0
  } = transferFinances || {};

  const amazonFees = sellingFees + fbaFees + other - otherOfTransfer;

  const grossProfit = netRevenues + productCosts + amazonFees;

  const percentageOfNetRevenuesGrossProfit = (grossProfit / netRevenues) * 100;

  const opex = (netRevenues * -1) / 100;

  const ebtida = grossProfit + otherTransactionFees + opex;

  const percentageOfNetRevenuesEbtida = (ebtida / netRevenues) * 100;

  // console.log({
  //   unitsSold,
  //   orderSales,
  //   saleCostPrice,
  //   unitsRefunded,
  //   refundSales,
  //   refundCostPrice,
  //   grossSales,
  //   productSalesTax,
  //   shippingCredits,
  //   shippingCreditsTax,
  //   giftWrapCredits,
  //   giftWrapCreditsTax,
  //   promotionalRebates,
  //   promotionalRebatesTax,
  //   marketplaceWithheldTax,
  //   sellingFees,
  //   fbaFees,
  //   otherTransactionFees,
  //   other,
  //   otherOfTransfer,
  //   netRevenues,
  //   productCosts,
  //   amazonFees,
  //   grossProfit,
  //   percentageOfNetRevenuesGrossProfit,
  //   opex,
  //   ebtida,
  //   percentageOfNetRevenuesEbtida
  // });
  await MonthlySalesHistory.updateOne({
    storeId,
    marketplaceId,
    timestamp: startDate
  }, {
    $set: {
      unitsSold,
      orderSales,
      saleCostPrice,
      unitsRefunded,
      refundSales,
      refundCostPrice,
      grossSales,
      productSalesTax,
      shippingCredits,
      shippingCreditsTax,
      giftWrapCredits,
      giftWrapCreditsTax,
      promotionalRebates,
      promotionalRebatesTax,
      marketplaceWithheldTax,
      sellingFees,
      fbaFees,
      otherTransactionFees,
      other,
      otherOfTransfer,
      netRevenues,
      productCosts,
      amazonFees,
      grossProfit,
      percentageOfNetRevenuesGrossProfit,
      opex,
      ebtida,
      percentageOfNetRevenuesEbtida
    }
  }, {
    upsert: true
  });
};

export default ApplyFormulasOnMonthlySales;
