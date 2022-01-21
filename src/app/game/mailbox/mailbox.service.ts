/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/AppSettings';

interface MessageResponseData{
  status: string;
  error: any;
  data: string;
}

interface MessageThreadsData{
  data: string;
  current_page: number;
  last_page: number;
  links: {
    active: boolean;
    label: string;
  }[];
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
    return this.http.get<MessageThreadsData>(
      AppSettings.API_ENDPOINT + '/message/threads?page=' + page,
      {responseType: 'json'}
    );
  }

  showMessages(threadId: number) {
    return this.http.get<any>(
      AppSettings.API_ENDPOINT + '/message/read/' + threadId,
      {responseType: 'json'}
    );
  }

  sendMessage(threadId: number, recipientId: number, message: string) {
    return this.http.post<any>(
      AppSettings.API_ENDPOINT + '/message/send',
      {
        threadId,
        recipientId,
        message
      }
    );
  }

}
