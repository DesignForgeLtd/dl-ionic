import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

@Injectable({providedIn: 'root'})
export class MailboxService {
  //temporary
  private recipients = [
    {id: 1, name: 'MarrQ'},
    {id: 2, name: 'Sachem'}
  ];

  constructor(private http: HttpClient){}

  loadRecipients(){
    return this.http.get<{'id': number; 'name': string}>(
      AppSettings.API_ENDPOINT + '/user/getAll',
      {responseType: 'json'}
    );
  }

  send(recipientId: number, subject: string, message: string){
    return this.http.post<{result: string}>(
      AppSettings.API_ENDPOINT + '/message/create',
      {
        recipientId,
        subject,
        message
      }
    );
  }

}
