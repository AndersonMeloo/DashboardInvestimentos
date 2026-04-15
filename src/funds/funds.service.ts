import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { CreateFundDto } from './dto/create-fund.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FundsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFundDto: CreateFundDto) {
    try {
      const fund = await this.prisma.fund.create({
        data: {
          name: createFundDto.name,
          ticker: createFundDto.ticker.toUpperCase(),
          type: createFundDto.type,
          pricePerShare: createFundDto.pricePerShare,
        },
      });

      return {
        message: 'Fundo criado com sucesso',
        data: fund,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Já existe. Por favor, escolha outro.');
      }

      throw new InternalServerErrorException(
        'Já existe um fundo com esse nome ou ocorreu um erro ao criar o fundo.',
      );
    }
  }

  async findAll() {
    try {
      const funds = await this.prisma.fund.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        message: 'Fundos listados com sucesso',
        data: funds,
      };
    } catch {
      throw new InternalServerErrorException('Erro ao listar fundos');
    }
  }
}
