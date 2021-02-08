import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import UserAppointmentsController from '@modules/appointments/infra/http/controllers/UserAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();
const userAppointmentsController = new UserAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      appointmentId: Joi.string().uuid().required(),
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.update,
);
appointmentsRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      appointmentId: Joi.string().uuid().required(),
    },
  }),
  appointmentsController.delete,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);
appointmentsRouter.get('/user', userAppointmentsController.index);

export default appointmentsRouter;
