import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
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
    );
  }
}
