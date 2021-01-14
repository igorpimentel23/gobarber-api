import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderDayAvailablityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailablityController';
import ProviderMonthAvailablityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailablityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailablityController = new ProviderDayAvailablityController();
const providerMonthAvailablityController = new ProviderMonthAvailablityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailablityController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailablityController.index,
);

export default providersRouter;
