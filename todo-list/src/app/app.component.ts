import { Component } from '@angular/core';
import { User } from './_models';
import { AccountService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-list';
  user!: User;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    isConnected() {
        if (this.accountService.userValue !== null && this.accountService.userValue._id !== undefined)
          return true;
        return false;
    }

    logout() {
        this.accountService.logout();
    }
}
