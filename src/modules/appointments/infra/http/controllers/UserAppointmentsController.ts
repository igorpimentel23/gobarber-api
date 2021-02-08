import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';
import { classToClass } from 'class-transformer';

export default class UserAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listUserAppointments = container.resolve(ListUserAppointmentsService);

    const appointments = await listUserAppointments.execute(user_id);

    return response.json(classToClass(appointments));
  }
}
