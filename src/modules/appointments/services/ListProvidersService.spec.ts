import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUserRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Malany',
      email: 'johnmalany@example.com',
      password: 'password',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Richard Roe',
      email: 'richardroe@email.com',
      password: 'password',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    await expect(providers).toEqual([user1, user2]);
  });
});
