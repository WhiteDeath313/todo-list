import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, empty, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/login`, { username, password })
            .pipe(map(user => {
                console.log(user);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next({_id: '', username: '', email: '', password: ''});
        this.router.navigate(['/login']);
    }

    register(user: User) {
        let body = {username: user.username, email: user.email, password: user.password};
        let headers = new HttpHeaders(); 
        headers.set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.apiUrl}/users/register`, body, {headers: headers, responseType: 'json', observe: 'response'});
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
            map(
              (users => {
                  return users;
              })
            )
          );;
    }
}