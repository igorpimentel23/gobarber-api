import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
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
  }: IRequest): Promise<IResponse> {
    const cacheKey = `provider-month-availability:${provider_id}:${year}-${month}`;

    let availability = await this.cacheProvider.recover<IResponse>(cacheKey);

    if (!availability) {
      const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
        {
          provider_id,
          month,
          year,
        },
      );

      const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

      const eachDayArray = Array.from(
        { length: numberOfDaysInMonth },
        (value, index) => index + 1,
      );

      availability = eachDayArray.map(day => {
        const appointmentsInDay = appointments.filter(appointment => {
          return getDate(appointment.date) === day;
        });

        const compareDate = new Date(year, month - 1, day, 23, 59, 59);

        return {
          day,
          available:
            appointmentsInDay.length < 10 &&
            isAfter(compareDate, new Date(Date.now())),
        };
      });

      await this.cacheProvider.save(cacheKey, availability);
    }

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
