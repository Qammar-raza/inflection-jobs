import AddAdmin from './add-admin';
import AddProducts from './add-products';
import StartJobs from './start-jobs';

const ScriptMethods = async ({
  method,
  userId,
  storeId,
  marketplaceId
}) => {
  console.log('\n\n', 'method', method);

  switch (method) {
    case 'AddAdmin': {
      await AddAdmin();
      break;
    }

    case 'AddProducts': {
      await AddProducts({ storeId });
      break;
    }

    case 'StartJobs': {
      StartJobs(userId, storeId);
      break;
    }

    default: {
      break;
    }
  }
};

export default ScriptMethods;
