import SellingPartnerAPI from 'amazon-sp-api';

import { parseTSV } from '../utils/parse';

const DownloadReport = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  reportDocument
}) => {
  const sellingPartner = new SellingPartnerAPI({
    region,
    refresh_token: refreshToken,
    credentials: {
      SELLING_PARTNER_APP_CLIENT_ID: clientId,
      SELLING_PARTNER_APP_CLIENT_SECRET: clientSecret,
      AWS_ACCESS_KEY_ID: accessKey,
      AWS_SECRET_ACCESS_KEY: secretKey,
      AWS_SELLING_PARTNER_ROLE: role
    }
  });

  let report = await sellingPartner.download(reportDocument);
  report = await parseTSV(report);

  return report;
};

export default DownloadReport;
