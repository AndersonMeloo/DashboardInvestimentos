import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';
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

  async update(id: string, updateFundDto: UpdateFundDto) {
    try {
      const fundExists = await this.prisma.fund.findUnique({
        where: { id },
      });

      if (!fundExists) {
        throw new NotFoundException('Fundo não encontrado');
      }

      const fund = await this.prisma.fund.update({
        where: { id },
        data: {
          ...(updateFundDto.name && { name: updateFundDto.name }),
          ...(updateFundDto.type && { type: updateFundDto.type }),
          ...(updateFundDto.pricePerShare && {
            pricePerShare: updateFundDto.pricePerShare,
          }),
        },
      });

      return {
        message: 'Fundo atualizado com sucesso',
        data: fund,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao atualizar fundo');
    }
  }

  async deleteAll() {
    try {
      // Primeiro deleta todas as transações (por causa do onDelete: Restrict)
      await this.prisma.transaction.deleteMany();

      // Depois deleta os fundos
      const result = await this.prisma.fund.deleteMany();

      return {
        message: `${result.count} fundo(s) deletado(s) com sucesso`,
        data: { deletedCount: result.count },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao deletar fundos: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
      );
    }
  }
}
