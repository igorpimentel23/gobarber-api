import { format, isPast } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  appointmentId: string;
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

  public async execute({ user_id, appointmentId }: IRequest): Promise<void> {
    const findAppointment = await this.appointmentsRepository.findById(
      appointmentId,
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

    await this.appointmentsRepository.delete(appointmentId);

    const dateFormated = format(date, "dd/MM/yyyy 'às' HH:mm'h");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Agendamento para dia ${dateFormated} cancelado`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(date, 'yyyy-M-d')}`,
    );
  }
}

export default DeleteAppointmentService;
