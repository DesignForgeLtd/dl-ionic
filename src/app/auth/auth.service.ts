import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/AppSettings';
import { User } from './user.model';


interface AuthResponseData{
  status: string;
  data: {
    token: string;
    email: string;
    id: number;
    expiresIn: number;
    name: string;
  };
}

@Injectable({providedIn: 'root'})
export class AuthService {

  user = new Subject<User>();

  constructor(private http: HttpClient){}

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
      AppSettings.API_ENDPOINT + '/auth/login',
      {
        email,
        password
      }
    );
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
      const tokenExpirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
      const user = new User(response.data.email, response.data.id, response.data.token, tokenExpirationDate);
    }));
  }

  handleError(){

  }
}
