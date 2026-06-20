import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database.service';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, LeadsModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
