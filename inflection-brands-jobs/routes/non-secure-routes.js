import express from 'express';

import Scripts from '../controllers/scripts';

const Router = express.Router();

// http://localhost:5200/api/v1/script?method=issuedFinancesJob
Router.route('/script').get((req, res) => {
  const { query } = req;
  const {
    method,
    userId,
    storeId,
    marketplaceId
  } = query;
  Scripts({
    method,
    userId,
    storeId,
    marketplaceId
  });
});

export default Router;
