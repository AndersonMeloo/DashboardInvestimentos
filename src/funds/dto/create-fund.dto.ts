import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFundDto {
  @IsString({ message: 'O nome do fundo deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do fundo é obrigatório' })
  @MaxLength(20, { message: 'Nome do fundo deve ter no máximo 120 caracteres' })
  name!: string;

  @IsString({ message: 'O Ticker deve ser um texto' })
  @IsNotEmpty({ message: 'O Ticker é obrigatório' })
  @MaxLength(20, { message: 'O Ticker deve ter no máximo 20 caracteres' })
  ticker!: string;

  @IsString({ message: 'O tipo do fundo deve ser um texto' })
  @IsNotEmpty({ message: 'O tipo do fundo é obrigatório' })
  @MaxLength(80, { message: 'Tipo do fundo deve ter no máximo 80 caracteres' })
  type!: string;

  @IsNumber({}, { message: 'O preço por cota deve ser um número' })
  @IsPositive({ message: 'O preço por cota deve ser um número positivo' })
  @Min(0.01, { message: 'O preço por cota deve ser no mínimo R$ 0,01' })
  pricePerShare!: number;
}
