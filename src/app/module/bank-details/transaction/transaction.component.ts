import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import {
  TransactionMode,
  TransactionType,
} from 'src/app/core/constants/transaction.constant';
import { Master } from 'src/app/core/enums/master.enum';
import { Transaction } from 'src/app/core/models/transaction.model';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { MasterStore } from 'src/app/core/stores/master.store';
import { TransactionEnum } from 'src/app/core/enums/transaction.enum';
import { BankDetailsStore } from 'src/app/core/stores/bank.store';
import { BankDetails } from 'src/app/core/models/bankDetails.model';
import { ToastMessageService } from 'src/app/core/services/toast-message.service';
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  host: {
    class: 'fullWidth',
  },
})
export class TransactionComponent implements OnInit {
  transactionTypeOption = TransactionType;
  transactionEnum = TransactionEnum;
  transactionModeOption = TransactionMode;
  MASTER = Master;
  banks?: BankDetails[] = undefined;

  subscription: Subscription[] = [];
  masterDetail: any;
  masterDetailList: any;
  filteredMasterDetails: Observable<any[]> | undefined;
  activeId: string = '';

  transactionForm: FormGroup = new FormGroup({
    transactionDate: new FormControl(null, Validators.required),
    particular: new FormControl(null, Validators.required),
    reference: new FormControl(null),
    transactionType: new FormControl(null, Validators.required),
    transactionMode: new FormControl(null, Validators.required),
    transactionAmount: new FormControl(null, Validators.required),
    remark: new FormControl(null),
  });

  get particular() {
    return this.transactionForm.get('particular');
  }

  get type() {
    return this.transactionForm.get('transactionType');
  }

  get amount() {
    return this.transactionForm.get('transactionAmount');
  }

  constructor(
    private masterStore: MasterStore,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private bankStore: BankDetailsStore,
    private toast: ToastMessageService
  ) {
    this.subscription.push(
      this.masterStore.bindStore().subscribe((data) => {
        this.masterDetail = data;
        //this.masterDetailList = Object.keys(data);
      }),
      this.route.params.subscribe((param) => {
        this.activeId = param['bank_accountName'];
      }),
      this.bankStore.bindStore().subscribe((data) => {
        this.banks = data;
      })
    );
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.masterDetail?.filter((option: any) =>
      option[this.MASTER.LEDGER].toLowerCase().includes(filterValue)
    );
  }

  ngOnInit(): void {
    this.filteredMasterDetails = this.particular?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  onAddTransaction() {
    if (this.transactionForm.valid) {
      let data = this.addcomputedValues(this.transactionForm.value);
      this.transactionService.add(data).subscribe((result) => {
        this.transactionService.syncStore();
        this.toast.success('Transaction has been added.', 'close');
      });
    }
  }

  addcomputedValues(p_data: any) {
    let data: Transaction = new Transaction().deserialize(p_data);

    data.accountName = this.activeId;

    data.withdrawal =
      data.transactionType?.toLowerCase() ==
      this.transactionEnum.WITHDARWAL.toLowerCase()
        ? Number(data.transactionAmount)
        : 0;
    data.deposit =
      data.transactionType?.toLowerCase() ==
      this.transactionEnum.DEPOSIT.toLowerCase()
        ? Number(data.transactionAmount)
        : 0;

    let date = new Date(data.transactionDate);
    let currentYear = +date.toLocaleDateString('default', { year: '2-digit' });
    data.transactionMonth = date.toLocaleDateString('default', {
      month: 'short',
    });
    data.transactionFY =
      date.getMonth() > 2
        ? `FY ${currentYear}-${currentYear + 1}`
        : `FY ${currentYear - 1}-${currentYear}`;

    /* let headers = this.masterDetail[data.particular];
    data.groupHead = headers[this.MASTER.GROUP_HEAD];
    data.subHead = headers[this.MASTER.SUB_HEAD];
    data.accountHead = headers[this.MASTER.ACCOUNT_HEAD];
    data.costCenter = headers[this.MASTER.COST_CENTER];
    data.costCategory = headers[this.MASTER.COST_CATEGORY]; */

    return data;
  }
}
