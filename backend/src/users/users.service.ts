import { Injectable, OnApplicationBootstrap, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) { }

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminEmail = 'admin@example.com';
    const adminExists = await this.userRepository.findOneBy({ email: adminEmail });
    if (!adminExists) {
      console.log('Seeding admin account...');
      const password = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        password: password,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('Admin seeded successfully.');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại.');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.email LIKE :search OR user.fullName LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: number, status: string) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('Người dùng không tồn tại.'); // Optional safety
    if (user.role === 'ADMIN') {
      throw new BadRequestException('Không thể chặn tài khoản Quản trị viên (Admin).');
    }
    return this.userRepository.update(id, { status });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại.');
    }
    if (user.role === 'ADMIN') {
      throw new BadRequestException('Không thể xóa tài khoản Quản trị viên (Admin).');
    }
    return this.userRepository.delete(id);
  }
}
