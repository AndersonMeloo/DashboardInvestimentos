import { Module } from '@nestjs/common';
import { FundsModule } from './funds/funds.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, FundsModule, WalletModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
