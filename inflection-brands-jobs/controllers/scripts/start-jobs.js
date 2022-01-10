import StartAgendaJobs from '../agenda/start-agenda-jobs';

// http://localhost:5500/api/v1/script?method=StartJobs&userId=6169844b4116ed760c706714&storeId=616984ab4116ed760c70680a
// http://jobs.inflectionbrands.com/api/v1/script?method=StartJobs&userId=61a60a6b5e9b9c7bf8980e34&storeId=61a60c465ba9352199052c2e

const StartJobs = async (userId, storeId) => {
  console.log('\n\n', 'In StartJobs()', userId, storeId);
  try {
    await StartAgendaJobs({
      userId,
      storeId
    });
  } catch (error) {
    console.log('\n\n', 'error', error.message);
  }
};

export default StartJobs;
