import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}
  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const cacheKey = `provider-day-availability:${provider_id}:${year}-${month}-${day}`;
    let availability = await this.cacheProvider.recover<IResponse>(cacheKey);

    if (!availability) {
      const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          month,
          year,
          day,
        },
      );

      const startingHour = 8;

      const eachHour = Array.from(
        { length: 10 },
        (value, index) => index + startingHour,
      );
      const currentDate = new Date(Date.now());

      availability = eachHour.map(hour => {
        const appointmentInHour = appointments.find(appointment => {
          return getHours(appointment.date) - 3 === hour;
        });

        const compareDate = new Date(year, month - 1, day, hour);

        return {
          hour,
          available: !appointmentInHour && isAfter(compareDate, currentDate),
        };
      });

      await this.cacheProvider.save(cacheKey, availability);
    }

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
