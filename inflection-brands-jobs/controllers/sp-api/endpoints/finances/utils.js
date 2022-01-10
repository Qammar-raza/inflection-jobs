import { concat } from 'lodash';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const mergeFinancialEvents = (prevfinances, nextFinances) => {
  const finances = {};

  finances.AdjustmentEventList = concat((prevfinances.AdjustmentEventList || []),
    (nextFinances.AdjustmentEventList || []));

  finances.AffordabilityExpenseEventList = concat((prevfinances.AffordabilityExpenseEventList || []),
    (nextFinances.AffordabilityExpenseEventList || []));

  finances.AffordabilityExpenseReversalEventList = concat((prevfinances.AffordabilityExpenseReversalEventList || []),
    (nextFinances.AffordabilityExpenseReversalEventList || []));

  finances.ChargebackEventList = concat((prevfinances.ChargebackEventList || []),
    (nextFinances.ChargebackEventList || []));

  finances.CouponPaymentEventList = concat((prevfinances.CouponPaymentEventList || []),
    (nextFinances.CouponPaymentEventList || []));

  finances.DebtRecoveryEventList = concat((prevfinances.DebtRecoveryEventList || []),
    (nextFinances.DebtRecoveryEventList || []));

  finances.FBALiquidationEventList = concat((prevfinances.FBALiquidationEventList || []),
    (nextFinances.FBALiquidationEventList || []));

  finances.GuaranteeClaimEventList = concat((prevfinances.GuaranteeClaimEventList || []),
    (nextFinances.GuaranteeClaimEventList || []));

  finances.ImagingServicesFeeEventList = concat((prevfinances.ImagingServicesFeeEventList || []),
    (nextFinances.ImagingServicesFeeEventList || []));

  finances.LoanServicingEventList = concat((prevfinances.LoanServicingEventList || []),
    (nextFinances.LoanServicingEventList || []));

  finances.NetworkComminglingTransactionEventList = concat((prevfinances.NetworkComminglingTransactionEventList || []),
    (nextFinances.NetworkComminglingTransactionEventList || []));

  finances.PayWithAmazonEventList = concat((prevfinances.PayWithAmazonEventList || []),
    (nextFinances.PayWithAmazonEventList || []));

  finances.PerformanceBondRefundEventList = concat((prevfinances.PerformanceBondRefundEventList || []),
    (nextFinances.PerformanceBondRefundEventList || []));

  finances.ProductAdsPaymentEventList = concat((prevfinances.ProductAdsPaymentEventList || []),
    (nextFinances.ProductAdsPaymentEventList || []));

  finances.RefundEventList = concat((prevfinances.RefundEventList || []),
    (nextFinances.RefundEventList || []));

  finances.RemovalShipmentAdjustmentEventList = concat((prevfinances.RemovalShipmentAdjustmentEventList || []),
    (nextFinances.RemovalShipmentAdjustmentEventList || []));

  finances.RemovalShipmentEventList = concat((prevfinances.RemovalShipmentEventList || []),
    (nextFinances.RemovalShipmentEventList || []));

  finances.RentalTransactionEventList = concat((prevfinances.RentalTransactionEventList || []),
    (nextFinances.RentalTransactionEventList || []));

  finances.RetrochargeEventList = concat((prevfinances.RetrochargeEventList || []),
    (nextFinances.RetrochargeEventList || []));

  finances.SAFETReimbursementEventList = concat((prevfinances.SAFETReimbursementEventList || []),
    (nextFinances.SAFETReimbursementEventList || []));

  finances.SellerDealPaymentEventList = concat((prevfinances.SellerDealPaymentEventList || []),
    (nextFinances.SellerDealPaymentEventList || []));

  finances.SellerReviewEnrollmentPaymentEventList = concat((prevfinances.SellerReviewEnrollmentPaymentEventList || []),
    (nextFinances.SellerReviewEnrollmentPaymentEventList || []));

  finances.ServiceFeeEventList = concat((prevfinances.ServiceFeeEventList || []),
    (nextFinances.ServiceFeeEventList || []));

  finances.ServiceProviderCreditEventList = concat((prevfinances.ServiceProviderCreditEventList || []),
    (nextFinances.ServiceProviderCreditEventList || []));

  finances.ShipmentEventList = concat((prevfinances.ShipmentEventList || []),
    (nextFinances.ShipmentEventList || []));

  finances.TaxWithholdingEventList = concat((prevfinances.TaxWithholdingEventList || []),
    (nextFinances.TaxWithholdingEventList || []));

  return finances;
};
