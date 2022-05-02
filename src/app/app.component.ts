import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { InitService } from './core/services/init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Personal Passbook Manager';
  subscription: Subscription[] = [];

  constructor(private initService: InitService) {
    //this.subscription.push();
  }

  ngOnDestroy(): void {
    this.subscription.map((sub) => sub.unsubscribe());
  }
}
