import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersRepository } from './customers.repository';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([CustomersRepository]), AuthModule],
    controllers: [CustomersController],
    providers: [CustomersService],
})
export class CustomersModule {}
