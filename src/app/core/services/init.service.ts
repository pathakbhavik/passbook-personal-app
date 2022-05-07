import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BankDetailsStore } from '../stores/bank.store';
import { MasterStore } from '../stores/master.store';
import { BankService } from './bank.service';
import { MasterService } from './master.service';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  constructor(
    private bankService: BankService,
    private bankStore: BankDetailsStore,
    private transactionService: TransactionService,
    private masterService: MasterService,
    private masterStore: MasterStore,
    private route: Router
  ) {
    this.initApp();
  }

  initApp() {
    this.transactionService.syncStore();
    this.masterService.getMasterDetails().subscribe((data) => {
      this.masterStore.setStore(data);
    });
    this.bankService.getBankDetails().subscribe((data) => {
      this.bankStore.setStore(data);
      if (data.length > 0) {
        this.route.navigate(['bank', data[0].accountName]);
      }
    });
  }
}
