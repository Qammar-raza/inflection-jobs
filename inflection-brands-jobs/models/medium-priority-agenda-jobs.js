import { Schema, model } from 'mongoose';

const schema = new Schema({}, { strict: false });

const MediumPriorityAgendaJobs = model('mediumPriorityAgendaJobs', schema, 'mediumPriorityAgendaJobs');

export default MediumPriorityAgendaJobs;
