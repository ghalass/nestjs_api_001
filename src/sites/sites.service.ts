import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.site.findMany();
  }

  async findOne(id: string) {
    return this.prisma.site.findUnique({ where: { id } });
  }

  async create(createUserDto: CreateSiteDto) {
    return this.prisma.site.create({ data: createUserDto });
  }

  async update(id: string, updateUserDto: UpdateSiteDto) {
    return this.prisma.site.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: string) {
    return this.prisma.site.delete({ where: { id } });
  }
}
