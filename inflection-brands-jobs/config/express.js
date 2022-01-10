import express from 'express';
import morgan from 'morgan';

import lowPriorityAgenda from '../controllers/agenda/config/low-priority-jobs';
import mediumPriorityAgenda from '../controllers/agenda/config/medium-priority-jobs';
import highPriorityAgenda from '../controllers/agenda/config/high-priority-jobs';

import '../controllers/agenda/definitions';
import '../controllers/scripts';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

const { PORT } = process.env;

app.listen({ port: PORT }, async () => {
  console.log(`app listening on port ${PORT}!`);

  await lowPriorityAgenda._ready;
  console.log('Low Priority Agenda Ready');
  lowPriorityAgenda.start();
  console.log('Low Priority Agenda Started');

  await mediumPriorityAgenda._ready;
  console.log('Medium Priority Agenda Ready');
  mediumPriorityAgenda.start();
  console.log('Medium Priority Agenda Started');

  await highPriorityAgenda._ready;
  console.log('High Priority Agenda Ready');
  highPriorityAgenda.start();
  console.log('High Priority Agenda Started');
});

export default app;
