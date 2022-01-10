import Agendash from 'agendash';

import app from '../config/express';

import highPriorityAgenda from '../controllers/agenda/config/high-priority-jobs';
import mediumPriorityAgenda from '../controllers/agenda/config/medium-priority-jobs';
import lowPriorityAgenda from '../controllers/agenda/config/low-priority-jobs';

import NonSecureRoutes from './non-secure-routes';

app.use('/highPriorityJobs', Agendash(highPriorityAgenda));
app.use('/mediumPriorityJobs', Agendash(mediumPriorityAgenda));
app.use('/lowPriorityJobs', Agendash(lowPriorityAgenda));

app.use('/api/v1', NonSecureRoutes);
