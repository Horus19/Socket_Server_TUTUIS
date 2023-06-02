import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RabbitMqService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    AuthService,
    RabbitMqService,
  ],
})
export class AuthModule {}
