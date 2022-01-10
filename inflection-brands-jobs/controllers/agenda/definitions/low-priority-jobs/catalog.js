/* eslint-disable no-await-in-loop */
import moment from 'moment';
import { extend } from 'lodash';

import agenda from '../../config/low-priority-jobs';

import GetCatalogItem from '../../helpers/catalog/get-catalog-item';
import SaveCatalog from '../../helpers/catalog/save';

import Products from '../../../../models/products';

import { JOB_STATES } from '../../../utils/constants';
import { SPAPIErrorException, ThrottlingException } from '../../../utils/custom-exceptions';
import { sleep } from '../../utils';

agenda.define('catalog', { concurrency: 3, priority: 'lowest' }, async (job, done) => {
  console.log('*********************************************************');
  console.log('***************   Sync CATALOG Started   ***************');
  console.log('*********************************************************');

  job.attrs.state = JOB_STATES.STARTED;
  job.attrs.progress = 0;
  await job.save();
  const { userId, storeId } = job.attrs.data;
  try {
    const lastUpdatedDate = moment().subtract(5, 'days').toDate();

    job.attrs.state = JOB_STATES.IN_PROGRESS;
    await job.save();

    const products = await Products.find({
      storeId,
      $or: [
        { catalogUpdatedAt: { $lte: lastUpdatedDate } },
        { catalogUpdatedAt: { $exists: false } }
      ]
    }).limit(1000);
    let result = true;
    try {
      const productsData = [];
      for (let i = 0; i < products.length; i += 1) {
        const item = products[i];
        const {
          marketplaceId,
          asin
        } = item;
        const res = await GetCatalogItem({
          userId,
          storeId,
          marketplaceId,
          asin
        });
        if (res.Identifiers.MarketplaceASIN) {
          const productObj = {
            marketplaceId: item.marketplaceId,
            asin: item.asin
          };
          if (res.AttributeSets[0] && res.AttributeSets[0].SmallImage) {
            extend(productObj, { imageUrl: res.AttributeSets[0].SmallImage.URL });
          }
          if (res.AttributeSets[0] && res.AttributeSets[0].ProductGroup) {
            extend(productObj, { productGroup: res.AttributeSets[0].ProductGroup });
          }
          if (res.AttributeSets[0] && res.AttributeSets[0].Brand) {
            extend(productObj, { productBrand: res.AttributeSets[0].Brand });
          }
          if (res.SalesRankings[0] && res.SalesRankings[0].Rank) {
            extend(productObj, { salesRanking: res.SalesRankings[0].Rank });
          }
          productsData.push(productObj);
        }
      }
      await SaveCatalog({
        storeId,
        data: productsData
      });
    } catch (error) {
      if (error instanceof ThrottlingException) {
        const { nextAvailableAt } = error;

        const waitTime = moment(nextAvailableAt).diff(moment(), 'millisecond');
        if (waitTime > 0) await sleep(waitTime);
      } else if (error instanceof SPAPIErrorException) {
        result = false;

        throw error;
      } else {
        result = false;

        throw new SPAPIErrorException({
          message: error.message,
          endpoint: 'GetCatalogItem',
          userId,
          storeId
        });
      }
    }
    if (!result) {
      job.attrs.state = JOB_STATES.FAILED;
    } else {
      job.attrs.state = JOB_STATES.COMPLETED;
      job.attrs.progress = 100;
    }
    job.attrs.lockedAt = null;
    await job.save();

    console.log('*********************************************************');
    console.log('**************   Sync CATALOG Completed   **************');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('****************   Sync CATALOG Retry   ****************');
    console.log('*********************************************************');
    console.log(error.message);
    console.log('*********************************************************');

    job.attrs.state = 'FAILED';
    job.attrs.failedAt = new Date();
    job.attrs.failReason = error.message;

    await job.save();
  }

  done();
});
