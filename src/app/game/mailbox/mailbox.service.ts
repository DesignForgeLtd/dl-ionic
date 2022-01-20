import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

interface MessageResponseData{
  status: string;
  error: any;
  data: string;
}

@Injectable({providedIn: 'root'})
export class MailboxService {

  constructor(private http: HttpClient){}

  loadRecipients(){
    return this.http.get<{'id': number; 'name': string}>(
      AppSettings.API_ENDPOINT + '/user/getAll',
      {responseType: 'json'}
    );
  }

  sendNewMessage(recipientId: number, subject: string, message: string){
    return this.http.post<MessageResponseData>(
      AppSettings.API_ENDPOINT + '/message/create',
      {
        recipientId,
        subject,
        message
      }
    );
  }

  loadThreads(page: number) {
    return this.http.get<{'id': number; 'subject': string; 'data': []}>(
      AppSettings.API_ENDPOINT + '/message/threads?page=' + page,
      {responseType: 'json'}
    );
  }

}
