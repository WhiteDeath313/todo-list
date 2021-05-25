import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, TaskService, AlertService } from '../_services';
import { User } from '../_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  submitted = false;
  users!: Observable<User[]>;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private taskService: TaskService,
    private alertService: AlertService) { }

    ngOnInit() {
      this.form = this.formBuilder.group({
          title: ['', Validators.required],
          description: ['', Validators.required],
          due_date: ['', [Validators.required]],
          state: ['', [Validators.required]],
          idUser: ['', [Validators.required]],
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
      this.taskService.create(this.form.value)
          .pipe(first())
          .subscribe( {
              next: () => {
                  this.alertService.success('Add task successful', { keepAfterRouteChange: true });
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
