import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleError(error: Error): never {
    this.logger.error(error.message, error.stack);
    throw new InternalServerErrorException(
      'Internal Server Error ',
      error.message,
    );
  }

  async checkAuthStatus(user: User) {
    return {
      ok: true,
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  //Creacion de token para validar usuario
  async createAuthToken(email: string): Promise<string> {
    const payload = { email };
    const options = { expiresIn: '2h' }; // token expira en 2 horas
    return this.jwtService.signAsync(payload, options);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @description: Valida el token y retorna el id del usuario
   * @param token
   * @returns id del usuario
   * @returns null si el token no es valido
   */
  async comprobarJWT(token: string): Promise<string | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload.id;
    } catch {
      return null;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      return user;
    } catch (e) {
      this.handleError(e);
    }
  }
}
