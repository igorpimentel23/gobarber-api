import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 3, 19, 8, 0, 0),
    });

    const eachDayArray = Array.from({ length: 10 }, (value, index) => {
      return {
        provider_id: 'user',
        date: new Date(2020, 3, 20, index + 8, 0, 0),
      };
    });

    const teste = async () => {
      return Promise.all(
        eachDayArray.map(async ({ provider_id, date }) => {
          return Promise.resolve(
            fakeAppointmentsRepository.create({
              provider_id,
              date,
            }),
          );
        }),
      );
    };

    teste().then(() => {});

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      month: 4,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
