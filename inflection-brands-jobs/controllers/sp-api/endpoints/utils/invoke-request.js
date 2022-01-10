import SellingPartnerAPI from 'amazon-sp-api';

const invokeRequest = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  request
}) => {
  const client = new SellingPartnerAPI({
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

  const response = await client.callAPI(request);

  return {
    response,
    client
  };
};

export default invokeRequest;
