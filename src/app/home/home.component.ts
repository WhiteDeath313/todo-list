import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService, TaskService } from '../_services';
import { Task, User } from '../_models';
import { State } from '../_models/state';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks_todo!: Observable<Task[]>;
  tasks_in_progress!: Observable<Task[]>;
  tasks_done!: Observable<Task[]>;
  users!: Observable<User[]>;


  constructor(private taskService: TaskService, 
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute) { 
  }

  delete_task(id: string) {
    console.log(id);
    return this.taskService.delete(id).pipe(first())
    .subscribe( {
        next: () => {
            this.alertService.success('Remove task successful', { keepAfterRouteChange: true });
        },
        error: error => {
            console.log(error);
            this.alertService.error(error);
        }
    });
  }

  ngOnInit(): void {
    this.tasks_todo = this.taskService.getAll(State.TODO);
    this.tasks_in_progress = this.taskService.getAll(State.IN_PROGRESS);
    this.tasks_done = this.taskService.getAll(State.DONE);
    this.users = this.accountService.getAll();
  }

}
