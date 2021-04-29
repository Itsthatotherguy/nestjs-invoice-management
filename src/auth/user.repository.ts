import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();

        const user = this.create({
            username,
            salt,
            password: await bcrypt.hash(password, salt),
        });

        try {
            await user.save();
        } catch (error) {
            // duplicate username
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<string> {
        const { username, password } = authCredentialsDto;

        const user = await this.findOne({ username });

        if (user && user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }
}
