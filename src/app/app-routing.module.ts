import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeAtGlanceComponent } from './module/income-at-glance/income-at-glance.component';
import { PendingPaymentComponent } from './module/pending-payment/pending-payment.component';
const routes: Routes = [
  {
    path: 'bank',
    loadChildren: () =>
      import('./module/bank-details/bank-details.module').then(
        (m) => m.BankDetailsModule
      ),
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./module/report/report.module').then((m) => m.ReportModule),
  },
  {
    path: 'income-at-glance',
    component: IncomeAtGlanceComponent,
  },
  {
    path: 'pending-payment',
    component: PendingPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
