import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(CustomersRepository)
        private customerRepository: CustomersRepository,
    ) {}

    async getCustomers(filterDto: GetCustomersFilterDto): Promise<Customer[]> {
        return this.customerRepository.getCustomers(filterDto);
    }

    async getCustomerById(id: number): Promise<Customer> {
        return this.customerRepository.getCustomerById(id);
    }

    async createCustomer(
        createCustomerDto: CreateCustomerDto,
    ): Promise<Customer> {
        return this.customerRepository.createCustomer(createCustomerDto);
    }

    async updateCustomer(
        id: number,
        updateCustomerDto: UpdateCustomerDto,
    ): Promise<Customer> {
        return this.customerRepository.updateCustomer(id, updateCustomerDto);
    }

    async deleteCustomer(id: number): Promise<void> {
        return this.customerRepository.deleteCustomer(id);
    }
}
