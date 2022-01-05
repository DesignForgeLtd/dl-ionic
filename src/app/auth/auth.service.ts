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

  register(email: string, password: string){
    return this.http.post<AuthResponseData>(
      AppSettings.API_ENDPOINT + '/auth/register',
      {
        email,
        password
      }
    );
  }
}
