import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import DeleteAppointmentService from '@modules/appointments/services/DeleteAppointmentService';
import UpdateAppointmentService from '@modules/appointments/services/UpdateAppointmentService';
import ShowAppointmentService from '@modules/appointments/services/ShowAppointmentService';
import { classToClass } from 'class-transformer';

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

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { appointment_id } = request.query;

    const showAppointment = container.resolve(ShowAppointmentService);

    const appointment = await showAppointment.execute({
      appointment_id: String(appointment_id),
      user_id,
    });

    return response.json(classToClass(appointment));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date, appointment_id } = request.body;

    const updateAppointment = container.resolve(UpdateAppointmentService);

    const appointment = await updateAppointment.execute({
      appointment_id,
      user_id,
      provider_id,
      date,
    });

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { appointment_id } = request.query;

    const deleteAppointment = container.resolve(DeleteAppointmentService);

    await deleteAppointment.execute({
      user_id,
      appointment_id: String(appointment_id),
    });

    return response.json('Appointment deleted');
  }
}
