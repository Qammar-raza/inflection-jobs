import { Schema, model } from 'mongoose';

const schema = new Schema({}, { strict: false });

const LowPriorityAgendaJobs = model('lowPriorityAgendaJobs', schema, 'lowPriorityAgendaJobs');

export default LowPriorityAgendaJobs;
