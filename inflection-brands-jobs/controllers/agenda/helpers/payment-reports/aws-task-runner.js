import AWS_SDK from 'aws-sdk';

const {
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey,
  AWS_REGION: region
} = process.env;

AWS_SDK.config.update({
  accessKeyId,
  secretAccessKey,
  region
});

const PaymentReports = ({
  userId,
  storeId,
  marketplaceId,
  marketplaceName,
  monsSelDirPaid,
  monsSelDirMcid,
  startDate,
  endDate
}) => new Promise(async (resolve, reject) => {
  const subnets = ['subnet-0fd035be5710afa4b', 'subnet-0d6f9c0d227082f73', 'subnet-05f14e9b2dd886137', 'subnet-04fd4f3ca2dc1c86a', 'subnet-03dc58632f57c71cf', 'subnet-030c899472d947404'];
  const awsvpcConfiguration = { assignPublicIp: 'ENABLED', subnets };
  const ecs = new AWS_SDK.ECS();
  const params = {
    capacityProviderStrategy: [{ capacityProvider: 'FARGATE_SPOT' }],
    cluster: 'inflection-brand',
    platformVersion: '1.4.0',
    count: 1,
    overrides: {
      containerOverrides: [{
        name: 'fetch-payment-reports-container',
        environment: [
          { name: 'userId', value: userId },
          { name: 'storeId', value: storeId },
          { name: 'marketplaceId', value: marketplaceId },
          { name: 'marketplaceName', value: marketplaceName },
          { name: 'monsSelDirPaid', value: monsSelDirPaid },
          { name: 'monsSelDirMcid', value: monsSelDirMcid },
          { name: 'startDate', value: startDate },
          { name: 'endDate', value: endDate }
        ]
      }
      ]
    },
    taskDefinition: 'fetch-payment-reports',
    networkConfiguration: {
      awsvpcConfiguration
    }
  };

  await ecs.runTask(params, (err, data) => {
    if (err) {
      reject(new Error('\n task not running'));
      console.log('err', err);
    } else {
      resolve(true);
      console.log('\n Task', data);
    }
  });
});

export default PaymentReports;
