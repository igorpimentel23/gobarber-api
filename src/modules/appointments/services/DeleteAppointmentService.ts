import { format, isPast } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  appointment_id: string;
}

@injectable()
class DeleteAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, appointment_id }: IRequest): Promise<void> {
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
      throw new AppError('You can not delete this appointment');
    }

    const { date, provider_id } = findAppointment;

    if (isPast(date)) {
      throw new AppError('You can not delete a past appointment');
    }

    const cacheDate = format(date, 'yyyy-M-d');
    const cacheDateMonth = format(date, 'yyyy-M');

    await this.appointmentsRepository.delete(appointment_id);

    const dateFormated = format(date, "dd/MM/yyyy 'às' HH:mm'h");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Agendamento para dia ${dateFormated} cancelado`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${cacheDate}`,
    );

    await this.cacheProvider.invalidate(
      `provider-day-availability:${provider_id}:${cacheDate}`,
    );

    await this.cacheProvider.invalidate(
      `provider-month-availability:${provider_id}:${cacheDateMonth}`,
    );

    await this.cacheProvider.invalidate(`user-appointments:${user_id}`);

    await this.cacheProvider.invalidate(`single-appointment:${appointment_id}`);
  }
}

export default DeleteAppointmentService;
