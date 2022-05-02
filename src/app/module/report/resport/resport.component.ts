import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankDetails } from 'src/app/core/models/bankDetails.model';
import { Transaction } from 'src/app/core/models/transaction.model';
import { BankDetailsStore } from 'src/app/core/stores/bank.store';
import { TransactionStore } from 'src/app/core/stores/transaction.store';
import * as WebDataRocks from 'webdatarocks';

@Component({
  selector: 'app-resport',
  templateUrl: './resport.component.html',
  styleUrls: ['./resport.component.scss'],
})
export class ResportComponent implements OnInit {
  pivot: any = null;
  activeReport: string = '';
  _wdr?: ElementRef;
  dataSetTransaction: any;
  dataSetBank: any;
  @ViewChild('wdr') set wdr(wdr: ElementRef) {
    //this._refreshTable();
    this._wdr = wdr;
    this.updateReport();
  }

  subscription: Subscription[] = [];
  transactions: Transaction[] = [];
  banks: BankDetails[] = [];

  constructor(
    private transactionStore: TransactionStore,
    private bankStore: BankDetailsStore,
    private route: ActivatedRoute
  ) {
    this.subscription.push(
      this.transactionStore.bindStore().subscribe((data) => {
        this.transactions = data;
        this.dataSetTransaction = this.transactions.map((t) => {
          return {
            'Financial Year': t.transactionFY,
            Month: t.transactionMonth,
            Withdrawal: t.withdrawal,
            Deposit: t.deposit,
            Particular: t.particular,
            Bank: t.accountName,
            'Sub Head': t.subHead,
            'Group Head': t.groupHead,
            'Account Head': t.accountHead,
          };
        });
      }),
      this.bankStore.bindStore().subscribe((data) => {
        this.banks = data;
        this.dataSetBank = this.banks.map((b) => {
          return {
            'Account name': b.accountName,
            'Bank name': b.bankName,
            'Account type': b.accountType,
            Branch: b.branch,
            'Account no': b.accountNumber,
            Deposit: b.totalDeposit,
            Withdraw: b.totalWithdrawn,
            Balance: b.estimatedBalance,
          };
        });
        if (this.pivot) {
          this.pivot.updateData({
            data: this.dataSetBank,
          });
          this.pivot.refresh();
        }
      }),
      this.route.params.subscribe((param) => {
        this.activeReport = param['report_id'];
        this.updateReport();
      })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this._wdr && this.activeReport) {
      this.refreshTable();
    }
  }

  updateReport() {
    if (this._wdr && this.activeReport) {
      this.refreshTable();
    }
  }

  refreshTable() {
    const wdrReportObject = {
      container: this._wdr!.nativeElement,
      toolbar: false,
      height: '100%',
      report: {
        dataSource: {
          data: undefined,
        },
        options: {
          grid: {
            showHeaders: false,
            title: '',
          },
          configuratorButton: false,
        },
        slice: {
          rows: [{ uniqueName: 'Particular' }],
          columns: [{ uniqueName: 'Financial Year' }, { uniqueName: 'Month' }],
          measures: [
            {
              uniqueName: 'Withdrawal',
              aggregation: 'sum',
              format: 'currency',
            },
            {
              uniqueName: 'Deposit',
              aggregation: 'sum',
              format: 'currency',
            },
          ],
          reportFilters: [{ uniqueName: 'Bank' }],
        },
        formats: [
          {
            name: '',
            decimalPlaces: 2,
            currencySymbol: '₹',
            currencySymbolAlign: 'left',
            textAlign: 'right',
            thousandsSeparator: ',',
          },
        ],
      },
    };

    switch (this.activeReport) {
      case 'particular-overview':
        wdrReportObject.report.options.grid.title = 'Particular overview';
        wdrReportObject.report.dataSource.data = this.dataSetTransaction;
        break;
      case 'group-overview':
        wdrReportObject.report.options.grid.title = 'Groupby headers overview';
        wdrReportObject.report.dataSource.data = this.dataSetTransaction;
        wdrReportObject.report.slice.rows.unshift({ uniqueName: 'Sub Head' });
        wdrReportObject.report.slice.rows.unshift({
          uniqueName: 'Group Head',
        });
        break;
      case 'consolidated-bank':
        wdrReportObject.report.options.grid.title = 'Banks Consolidated';
        wdrReportObject.report.slice = {
          rows: [
            {
              uniqueName: 'Account type',
            },
            {
              uniqueName: 'Account name',
            },
          ],
          columns: [],
          measures: [
            { uniqueName: 'Deposit', aggregation: 'sum', format: 'currency' },
            { uniqueName: 'Withdraw', aggregation: 'sum', format: 'currency' },
            { uniqueName: 'Balance', aggregation: 'sum', format: 'currency' },
          ],
          reportFilters: [],
        };
        wdrReportObject.report.dataSource.data = this.dataSetBank;
        break;
      default:
        break;
    }
    this.pivot = new WebDataRocks(wdrReportObject);
  }

  ngOnDestory() {
    this.subscription.map((sub) => sub.unsubscribe());
  }
}
