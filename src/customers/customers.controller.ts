import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Customer } from './customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomersFilterDto } from './dto/get-customers-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseGuards(AuthGuard())
export class CustomersController {
    constructor(private customersService: CustomersService) {}

    @Get()
    getCustomers(
        @Query(ValidationPipe) filterDto: GetCustomersFilterDto,
    ): Promise<Customer[]> {
        return this.customersService.getCustomers(filterDto);
    }

    @Get('/:id')
    getCustomerById(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
        return this.customersService.getCustomerById(id);
    }

    @Post()
    createCustomer(
        @Body(ValidationPipe) createCustomerDto: CreateCustomerDto,
    ): Promise<Customer> {
        return this.customersService.createCustomer(createCustomerDto);
    }

    @Put('/:id')
    updateCustomer(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        return this.customersService.updateCustomer(id, updateCustomerDto);
    }

    @Delete('/:id')
    @HttpCode(204)
    deleteCustomer(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.customersService.deleteCustomer(id);
    }
}
