/* eslint-disable no-await-in-loop */
import { chunk } from 'lodash';

import Products from '../../../../models/products';

const SaveProduct = async ({
  storeId,
  marketplaceId,
  sellerSkuList
}) => {
  console.log('\n\n', {
    storeId,
    marketplaceId,
    sellerSkuLength: sellerSkuList.length
  });
  if (sellerSkuList.length > 0) {
    const sellerSkuListChunk = chunk(sellerSkuList, 100);
    console.log('\n\n', 'Chunks', sellerSkuListChunk.length);
    const writeData = [];
    for (let i = 0; i < sellerSkuListChunk.length; i += 1) {
      const chunkWise = sellerSkuListChunk[i];
      console.log('\n\n', `Chunk${i + 1})`, chunkWise.length);
      for (let j = 0; j < chunkWise.length; j += 1) {
        writeData.push({
          updateOne: {
            filter: {
              storeId,
              marketplaceId,
              sellerSku: sellerSkuListChunk[i][j]
            },
            update: {

            },
            upsert: true
          }
        });
      }
      if (writeData.length > 0) {
        await Products.bulkWrite(writeData);
      }
    }
  }
};

export default SaveProduct;
