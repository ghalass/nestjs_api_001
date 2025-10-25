import { Injectable, NotFoundException } from '@nestjs/common';
import { IAuthenticate, Role, User } from './interface/Role';
import { AuthenticateDto } from './dto/authenticate.dto';
import { sign } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWT_SECRT } from 'src/utils/const';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async authenticate(authenticateDto: AuthenticateDto): Promise<IAuthenticate> {
    console.log(authenticateDto);

    const user = await this.prisma.user.findFirst({
      where: {
        username: authenticateDto.username,
        password: authenticateDto.password,
      },
      select: {
        id: true,
        username: true,
        email: true,
        // role: true,
        // pas de password
      },
    });

    console.log(user);

    if (!user) throw new NotFoundException('Invalid credentials');

    const token = sign({ ...user }, JWT_SECRT);

    return { token, user };
  }
}
