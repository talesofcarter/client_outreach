import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../database.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'fdf-vb5-dfdf-cvwx-oit8-bmcs', // to be move to .env later
      signOptions: { expiresIn: '1d' },
    }),
  ],

  providers: [AuthService, DatabaseService],
  controllers: [AuthController],
})
export class AuthModule {}
