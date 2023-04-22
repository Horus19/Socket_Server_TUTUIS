import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import axios from 'axios';

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
}
