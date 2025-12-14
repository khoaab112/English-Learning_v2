import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { AttemptsModule } from './attempts/attempts.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: parseInt(configService.get<string>('MYSQL_PORT') || '3306', 10),
        username: configService.get<string>('MYSQL_USER') || 'root',
        password: configService.get<string>('MYSQL_PASSWORD') || '',
        database: configService.get<string>('MYSQL_DATABASE') || 'test',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Use migrations in production, but true for dev speed
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    LessonsModule,
    AttemptsModule,
    AuthModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
