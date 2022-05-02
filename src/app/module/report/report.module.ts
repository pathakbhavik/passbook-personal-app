import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResportComponent } from './resport/resport.component';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  declarations: [ResportComponent, ReportComponent],
  imports: [CommonModule, SharedModule, ReportRoutingModule],
})
export class ReportModule {}
