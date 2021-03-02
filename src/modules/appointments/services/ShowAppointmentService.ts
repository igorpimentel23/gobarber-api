import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
  appointment_id: string;
}

@injectable()
class ShowAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    appointment_id,
  }: IRequest): Promise<Appointment> {
    const cacheKey = `single-appointment:${appointment_id}`;

    let findAppointment = await this.cacheProvider.recover<
      Appointment | undefined
    >(cacheKey);

    if (!findAppointment) {
      findAppointment = await this.appointmentsRepository.show(appointment_id);

      if (!findAppointment) {
        throw new AppError('This appointment does not exist');
      }

      if (
        user_id !== findAppointment.user_id &&
        user_id !== findAppointment.provider_id
      ) {
        throw new AppError('You can not see this appointment');
      }

      await this.cacheProvider.save(cacheKey, classToClass(findAppointment));
    }

    return findAppointment;
  }
}

export default ShowAppointmentService;
