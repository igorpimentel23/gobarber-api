/* import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import DeleteAppointmentService from './DeleteAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let deleteAppointment: DeleteAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('DeleteAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteAppointment = new DeleteAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a Appointment', async () => {
    const appointment = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(),
    });

    await deleteAppointment.execute({
      user_id: 'user',
      appointment_id: appointment.id,
    });
  });

  it('Should not be able to delete an unexisting appointment', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(),
    });

    await expect(
      await deleteAppointment.execute({
        user_id: 'user',
        appointment_id: 'appointment.id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to delete an appointment if it is not the owner or the provider of the appointment', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(),
    });

    await expect(
      await deleteAppointment.execute({
        user_id: 'user2',
        appointment_id: 'appointment.id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
 */
