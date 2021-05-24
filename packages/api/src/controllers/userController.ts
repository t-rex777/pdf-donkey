import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Body, Controller, Get, HttpError, Put, Req, Res, UseBefore } from 'routing-controllers';
import { User } from 'src/entities/user';
import { authMiddleware, RequestWithUser } from 'src/middlewares/auth.middleware';
import { authService } from 'src/services/authService';
import { getRepository } from 'typeorm';

@Controller('/user')
export class userController {
  private readonly userRepo = getRepository(User);
  private readonly authService = new authService();
  @Get('/')
  async getUserFromToken(@Req() request: Request, @Res() response: Response) {
    const accessToken = request.headers['access-token'] as string;
    if (typeof accessToken !== 'string')
      return response.status(401).send(new HttpError(401, 'access token not found !'));
    const token = accessToken.split('Bearer ')[1];
    if (!token) return response.status(401).send(new HttpError(401, 'access token not found !'));
    let data: any;
    try {
      data = <{ userId: string }>verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch {
      return response.status(401).send(new HttpError(401, 'Token is expired or invalid !'));
    }
    const user = await this.userRepo.findOne({ id: data.userId });
    if (!user) return response.status(400).send(new HttpError(400, "user doesn't exist !"));

    (user.password as any) = undefined;
    return {
      ...user,
      ...this.authService.createTokens(user),
    };
  }
  @UseBefore(authMiddleware)
  @Put('/')
  async updateUser(@Req() { userId }: RequestWithUser, @Body() user: Partial<User>) {
    try {
      const userFromDb = await this.userRepo.findOne({ where: { id: userId } });
      if (!userFromDb) return new HttpError(400, 'User not found');
      const { name, username, email } = user;
      return await this.userRepo.update(
        { id: userId },
        { name: name, username: username, email: email },
      );
    } catch (error) {
      return new HttpError(500, error);
    }
  }
}
