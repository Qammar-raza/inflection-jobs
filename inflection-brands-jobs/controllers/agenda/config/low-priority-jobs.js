import Agenda from 'agenda';

const { MONGO_URL } = process.env;

const agenda = new Agenda({
  db: {
    address: MONGO_URL,
    collection: 'lowPriorityAgendaJobs'
  },
  defaultConcurrency: 3,
  maxConcurrency: 100,
  defaultLockLifetime: 20 * 60000
});

export default agenda;
