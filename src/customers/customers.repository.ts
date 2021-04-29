import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
    async getCustomers(filterDto: GetCustomersFilterDto): Promise<Customer[]> {
        const { search } = filterDto;
        const query = this.createQueryBuilder('customer');

        if (search) {
            query.andWhere(
                'LOWER(customer.firstName) LIKE LOWER(:search) OR LOWER(customer.lastName) LIKE LOWER(:search)',
                { search: `%${search.toLowerCase()}%` },
            );
        }

        const customers = await query.getMany();

        return customers;
    }

    async getCustomerById(id: number): Promise<Customer> {
        const found = await this.findOne(id);

        if (!found) {
            throw new NotFoundException(`Customer with ID {id} not found`);
        }

        return found;
    }

    async createCustomer(
        createCustomerDto: CreateCustomerDto,
    ): Promise<Customer> {
        const {
            firstName,
            lastName,
            contactNumber,
            emailAddress,
        } = createCustomerDto;

        const customer = this.create({
            firstName,
            lastName,
            contactNumber,
            emailAddress,
        });

        try {
            await customer.save();
        } catch (error) {
            // duplicated phone number or email address
            if (error.code === '23505') {
                throw new ConflictException(
                    'A customer with that email address or phone number already exists',
                );
            } else {
                throw new InternalServerErrorException();
            }
        }

        return customer;
    }

    async updateCustomer(
        id: number,
        updateCustomerDto: UpdateCustomerDto,
    ): Promise<Customer> {
        const existingCustomer = await this.getCustomerById(id);

        const customer = this.create({
            ...existingCustomer,
            ...updateCustomerDto,
        });

        await customer.save();

        return customer;
    }

    async deleteCustomer(id: number): Promise<void> {
        const result = await this.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Customer with ID {id} not found`);
        }
    }
}
