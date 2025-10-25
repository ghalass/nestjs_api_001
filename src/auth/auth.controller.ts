import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { JwtAuthGuard } from './jwt.guard';
import { Roles } from './roles/roles.decorator';
import { RoleGuard } from './role/role.guard';

import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Res() res: Response, @Body() authenticateDto: AuthenticateDto) {
    try {
      const response = await this.authService.authenticate(authenticateDto);
      return res.status(HttpStatus.OK).json({ response });
    } catch (error: any) {
      return res.status(error.status).json(error.response);
    }
  }

  // @Roles('USER', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  profile(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);

    return res.status(HttpStatus.OK).json(req.user);
  }
}
