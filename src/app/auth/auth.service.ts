/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/AppSettings';
import { User } from './user.model';


interface AuthResponseData{
  status: string;
  error: any;
  data: {
    access_token: string;
    token_type: string;
    user_id: number;
    user_name: string;
    expires_in: number;
  };
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ){}

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      AppSettings.API_ENDPOINT + '/auth/login',
      {
        email,
        password
      }
    )
    .pipe(tap(response => { // catchError(this.handleError),
      this.handleAuth(response.data.user_name, response.data.user_id, response.data.access_token, response.data.expires_in);
    }));
  }

  register(name: string, email: string, password: string){
    return this.http.post<AuthResponseData>(
      AppSettings.API_ENDPOINT + '/auth/register',
      {
        name,
        email,
        password
      }
    )
    .pipe(tap(response => { // catchError(this.handleError),
      this.handleAuth(response.data.user_name, response.data.user_id, response.data.access_token, response.data.expires_in);
    }));
  }

  // handleError(){

  // }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuth(name: string, userId: number, token: string, expiresIn: number){
    const tokenExpirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(name, userId, token, tokenExpirationDate);

    this.user.next(user);
  }

}
