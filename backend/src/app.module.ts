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
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const requiredKeys = [
          'MYSQL_HOST',
          'MYSQL_PORT',
          'MYSQL_USER',
          'MYSQL_PASSWORD',
          'MYSQL_DATABASE',
        ];

        for (const key of requiredKeys) {
          if (!configService.get(key)) {
            throw new Error(`MISSING CONFIGURATION: ${key} is not defined in .env file`);
          }
        }

        const config = {
          type: 'mysql',
          host: configService.get<string>('MYSQL_HOST')!,
          port: parseInt(configService.get<string>('MYSQL_PORT')!, 10),
          username: configService.get<string>('MYSQL_USER')!,
          password: configService.get<string>('MYSQL_PASSWORD')!,
          database: configService.get<string>('MYSQL_DATABASE')!,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
        return config as any;
      },
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
