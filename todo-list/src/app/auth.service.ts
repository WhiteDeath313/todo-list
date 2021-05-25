import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user/user'

@Injectable({
  providedIn: 'root'
})

// const mongoose = require('mongoose');
// const db = "mongodb+srv://root:toor@cluster0.7sq0l.mongodb.net/Cluster0?retryWrites=true&w=majority";
// const err = "";

// mongoose.connect(db, err => {
//   if (err)
// })

export class AuthService {

  private _registerUrl = "http://localhost:4200/api/auth/register"
  private _loginUrl = "http://localhost:4200/api/auth/login"

  constructor(private http: HttpClient) {}

  registerUser() {
    return this.http.post<any>(this._registerUrl, User);
  }

  loginUser() {
    this.http.post<any>(this._loginUrl, User);
  }
}
