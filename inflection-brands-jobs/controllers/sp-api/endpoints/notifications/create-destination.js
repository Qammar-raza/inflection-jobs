import { extend } from 'lodash';

import invokeRequest from '../utils/invoke-request';

const CreateDestination = async ({
  region,
  refreshToken,
  clientId,
  clientSecret,
  accessKey,
  secretKey,
  role,
  queueName,
  queueArn
}) => {
  const body = {};
  if (queueName) extend(body, { name: queueName });
  if (queueArn) {
    extend(body, {
      resourceSpecification: {
        sqs: {
          arn: queueArn
        }
      }
    });
  }

  const { response } = await invokeRequest({
    region,
    refreshToken,
    clientId,
    clientSecret,
    accessKey,
    secretKey,
    role,
    request: {
      operation: 'createDestination',
      endpoint: 'notifications',
      body
    }
  });

  if (response && response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response;
};

export default CreateDestination;
