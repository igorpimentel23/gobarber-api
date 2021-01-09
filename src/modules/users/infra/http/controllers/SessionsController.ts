import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user: userResponse, token } = await authenticateUser.execute({
      email,
      password,
    });

    const { password: pass, ...user } = userResponse;
    //delete user.password;

    return response.json({ user, token });
  }
}
