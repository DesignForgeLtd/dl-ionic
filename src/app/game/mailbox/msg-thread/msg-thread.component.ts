/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MailboxService } from '../mailbox.service';

@Component({
  selector: 'app-msg-thread',
  templateUrl: './msg-thread.component.html',
  styleUrls: ['./msg-thread.component.scss'],
})
export class MsgThreadComponent implements OnInit {
  @Input() threadId: number;

  public isLoading = true;
  public threadData: {
    sender_id: number;
    sender_name: string;
    recipient_id: number;
    delivered: string;
    content: string;
  }[];
  public recipientId: number;
  public message: string;

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.loadMessages(this.threadId);
  }

  loadMessages(threadId: number) {
    this.mailboxService.showMessages(threadId).subscribe(result => {
      this.isLoading = false;
      this.threadData = result;
      this.recipientId = result[0].recipient_id;
      console.log(result);
    });
  }

  onSubmit(form: NgForm) {
    console.log(this.threadId);
    this.mailboxService.sendMessage(this.threadId, this.recipientId, form.value.message).subscribe(
      response => {
        form.reset();
        // this.status = response.status;
        // this.response = response.data;
        // this.isLoading = false;
        // console.log(response);
        // if(this.status === 'success') {
        //   //form.reset();
        // }
        if(response.status === 'success') {
          this.loadMessages(this.threadId);
        }
      }
    );
  }

}
