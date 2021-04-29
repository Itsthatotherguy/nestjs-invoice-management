import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsString()
    contactNumber: string;

    @IsOptional()
    @IsEmail()
    emailAddress: string;
}
