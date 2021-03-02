import { isBefore, getHours, format, parseISO } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  appointment_id: string;
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    appointment_id,
    user_id,
    provider_id,
    date,
  }: IRequest): Promise<Appointment> {
    const findAppointment = await this.appointmentsRepository.findById(
      appointment_id,
    );

    if (!findAppointment) {
      throw new AppError('This appointment does not exist');
    }

    if (
      user_id !== findAppointment.user_id &&
      user_id !== findAppointment.provider_id
    ) {
      throw new AppError('You can not edit this appointment');
    }

    if (isBefore(date, Date.now())) {
      throw new AppError("You can't change this appointment to a past date");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (getHours(date) < 8 || getHours(date) > 17) {
      throw new AppError(
        'You can only create appointments between 8:00 and 18:00',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      date,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.update({
      appointment_id,
      provider_id,
      user_id,
      date,
    });

    const dateFormated = format(date, "dd/MM/yyyy 'às' HH:mm'h");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Reagendado para dia ${dateFormated}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${findAppointment.provider_id}:${format(
        findAppointment.date,
        'yyyy-M-d',
      )}`,
    );

    await this.cacheProvider.invalidate(
      `provider-day-availability:${findAppointment.provider_id}:${format(
        findAppointment.date,
        'yyyy-M-d',
      )}`,
    );

    await this.cacheProvider.invalidate(
      `provider-month-availability:${findAppointment.provider_id}:${format(
        findAppointment.date,
        'yyyy-M',
      )}`,
    );

    await this.cacheProvider.invalidate(`user-appointments:${user_id}`);

    await this.cacheProvider.invalidate(`single-appointment:${appointment.id}`);

    return appointment;
  }
}

export default CreateAppointmentService;
