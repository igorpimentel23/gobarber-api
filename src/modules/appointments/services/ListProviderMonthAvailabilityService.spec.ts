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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2022, 3, 17, 12).getTime();
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '789',
      date: new Date(2022, 3, 19, 8, 0, 0),
    });

    const eachDayArray = Array.from({ length: 10 }, (value, index) => {
      return {
        provider_id: 'user',
        user_id: '789',
        date: new Date(2022, 3, 20, index + 8, 0, 0),
      };
    });

    const teste = async () => {
      return Promise.all(
        eachDayArray.map(async ({ provider_id, user_id, date }) => {
          return Promise.resolve(
            fakeAppointmentsRepository.create({
              provider_id,
              user_id,
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
      year: 2022,
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
