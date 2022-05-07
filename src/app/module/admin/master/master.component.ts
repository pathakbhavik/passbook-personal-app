import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Master } from 'src/app/core/enums/master.enum';
import { MasterService } from 'src/app/core/services/master.service';
import { ToastMessageService } from 'src/app/core/services/toast-message.service';
import { MasterStore } from 'src/app/core/stores/master.store';
import { ConfirmDialogComponent } from 'src/app/shared/component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
  host: {
    class: 'full-page flexColumn',
  },
})
export class MasterComponent implements OnInit {
  subscription: Subscription[] = [];
  masterDetails: any = [];
  MASTER = Master;
  displayedColumns = [
    'groupHead',
    'subHead',
    'accountHead',
    'ledger',
    'costCenter',
    'costCategory',
    'action',
  ];
  masterForm = new FormGroup({
    groupHead: new FormControl(null, Validators.required),
    subHead: new FormControl(null, Validators.required),
    accountHead: new FormControl(null, Validators.required),
    ledger: new FormControl(null, Validators.required),
    costCenter: new FormControl(null, Validators.required),
    costCategory: new FormControl(null, Validators.required),
  });

  constructor(
    private masterStore: MasterStore,
    private masterService: MasterService,
    private toast: ToastMessageService,
    private dialog: MatDialog
  ) {
    this.subscription.push(
      this.masterStore.bindStore().subscribe((data) => {
        this.masterDetails = data?.map((d: any) => {
          return {
            groupHead: d[this.MASTER.GROUP_HEAD],
            subHead: d[this.MASTER.SUB_HEAD],
            accountHead: d[this.MASTER.ACCOUNT_HEAD],
            ledger: d[this.MASTER.LEDGER],
            costCenter: d[this.MASTER.COST_CENTER],
            costCategory: d[this.MASTER.COST_CATEGORY],
            id: d['id'],
          };
        });
      })
    );
  }

  ngOnInit(): void {}

  onAddMaster() {
    if (this.masterForm.valid) {
      let formValue = this.masterForm.value;
      let obj = {
        'Group Head': formValue['groupHead'],
        'Sub Head': formValue['subHead'],
        'Account Head': formValue['accountHead'],
        Ledger: formValue['ledger'],
        'Cost Center': formValue['costCenter'],
        'Cost Category': formValue['costCategory'],
      };

      this.masterService.addMasterData(obj).subscribe(
        (data) => {
          this.masterService.syncStore();
          this.toast.success('Master Details added successfully.', 'close');
        },
        (err) => {
          this.toast.success(
            'Some error occured. Please try again later.',
            'close'
          );
        }
      );
    }
  }

  onDeleteMaster(row: any) {
    let deleteConfirmed = () => {
      this.masterService.deleteMaster(row.id).subscribe(
        (data) => {
          this.masterService.syncStore();
          this.toast.success('Master detail deleted successfully.', 'close');
        },
        (err) => {
          this.toast.success(
            'Some error occured. Please try again later.',
            'close'
          );
        }
      );
    };

    let dialogObj = {
      minWidth: 450,
      disableClose: true,
      data: {
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        hideCancel: false,
        title: 'Delete master detail',
        message: `Are you sure you want to delete Master detail?`,
      },
    };

    const dialog = this.dialog?.open(ConfirmDialogComponent, dialogObj);

    dialog?.afterClosed().subscribe((result) => {
      if (result) {
        deleteConfirmed();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.map((sub) => sub.unsubscribe());
  }
}
