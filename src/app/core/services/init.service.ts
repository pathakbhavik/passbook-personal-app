import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddBankDialogComponent } from 'src/app/shared/component/add-bank-dialog/add-bank-dialog.component';
import { BankDetails } from '../models/bankDetails.model';
import { BankDetailsStore } from '../stores/bank.store';
import { MasterStore } from '../stores/master.store';
import { TransactionStore } from '../stores/transaction.store';
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
    private route: Router,
  ) {
    this.initApp();
  }

  initApp() {
    this.transactionService.syncStore();
    this.masterService.getMasterDetails().subscribe((data) => {
      this.masterStore.setStore(data);
      console.log('Connected to Master data');
    });
    this.bankService.getBankDetails().subscribe((data) => {
      this.bankStore.setStore(data);
      if(data.length>0){
        this.route.navigate(['bank', data[0].accountName]);
       }
    });
  }


}
