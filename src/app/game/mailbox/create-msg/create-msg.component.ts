import { Component, OnInit } from '@angular/core';
import { MailboxService } from '../mailbox.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-msg',
  templateUrl: './create-msg.component.html',
  styleUrls: ['./create-msg.component.scss'],
})
export class CreateMsgComponent implements OnInit {

  public users: any;
  public userId: number;
  public subject: string;
  public message: string;

  public isLoading = false;

  public status: string;
  public response: string;

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.mailboxService.loadRecipients().subscribe(data => {
      this.users = data;
    });
  }

  onSubmit(form: NgForm) {
    if ( ! form.valid){
      return;
    }
    this.isLoading = true;
    this.sendNewMessage(form);
    //form.reset(); //here is working, but wrong place
  }

  sendNewMessage(form: NgForm) {
    const userId = form.value.userId;
    const subject = form.value.subject;
    const message = form.value.message;
    this.mailboxService.sendNewMessage(userId, subject, message).subscribe(
      response => {
        //form.reset(); //not working
        this.status = response.status;
        this.response = response.data;
        console.log(this.response);
        this.isLoading = false;
        if(this.status === 'success') {
          form.resetForm(); //not working
        }
      }
    );
  }

}
