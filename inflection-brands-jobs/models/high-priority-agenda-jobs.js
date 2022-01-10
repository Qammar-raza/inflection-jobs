import { Schema, model } from 'mongoose';

const schema = Schema({}, {
  strict: false,
  timestamps: true
});

const HighPriorityAgendaJobs = model('highPriorityAgendaJobs', schema, 'highPriorityAgendaJobs');

export default HighPriorityAgendaJobs;
