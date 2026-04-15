import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FundsService } from './funds.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';

@Controller('funds')
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  @Post()
  create(@Body() createFundDto: CreateFundDto) {
    return this.fundsService.create(createFundDto);
  }

  @Get()
  findAll() {
    return this.fundsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFundDto: UpdateFundDto) {
    return this.fundsService.update(id, updateFundDto);
  }

  @Delete()
  deleteAll() {
    return this.fundsService.deleteAll();
  }
}
