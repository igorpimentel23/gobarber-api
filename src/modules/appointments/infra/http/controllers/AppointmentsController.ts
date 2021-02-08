import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import DeleteAppointmentService from '@modules/appointments/services/DeleteAppointmentService';
import UpdateAppointmentService from '@modules/appointments/services/UpdateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    return response.json(appointment);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date, appointmentId } = request.body;

    const updateAppointment = container.resolve(UpdateAppointmentService);

    const appointment = await updateAppointment.execute({
      appointmentId,
      user_id,
      provider_id,
      date,
    });

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { appointmentId } = request.body;

    const deleteAppointment = container.resolve(DeleteAppointmentService);

    await deleteAppointment.execute({
      user_id,
      appointmentId,
    });

    return response.json('Appointment deleted');
  }
}
