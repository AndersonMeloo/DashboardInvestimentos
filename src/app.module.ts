import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FundsModule } from './funds/funds.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [FundsModule, WalletModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
