import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, TaskService, AlertService } from '../_services';
import { User } from '../_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  submitted = false;
  users!: Observable<User[]>;
  tasks!: Observable<Task[]>;
  taskId!: String;
  title!: String;
  description!: String;
  due_date!: String;
  state!: String;
  idUser!: String;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private taskService: TaskService,
    private alertService: AlertService) { }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.taskId = params['task_id'];
        this.title = params['title'];
        this.description = params['description'];
        this.due_date = params['due_date'];
        this.state = params['state'];
        this.idUser = params['idUser'];
      });
      this.form = this.formBuilder.group({
          _id: [this.taskId, ],
          title: [this.title, Validators.required],
          description: [this.description, Validators.required],
          due_date: [this.due_date, [Validators.required]],
          state: [this.state, [Validators.required]],
          idUser: [this.idUser, [Validators.required]],
      });
      this.users = this.accountService.getAll();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      this.taskService.update(this.form.value)
          .pipe(first())
          .subscribe( {
              next: () => {
                  this.alertService.success('Update task successful', { keepAfterRouteChange: true });
                  this.router.navigate(['../home'], { relativeTo: this.route });
              },
              error: error => {
                  console.log(error);
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }
}
