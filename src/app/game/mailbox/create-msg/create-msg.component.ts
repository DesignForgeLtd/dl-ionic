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
  }

  sendNewMessage(form: NgForm) {
    this.mailboxService.sendNewMessage(form.value.userId, form.value.subject, form.value.message).subscribe(
      response => {
        form.reset();
        this.status = response.status;
        this.response = response.data;
        this.isLoading = false;
        if(this.status === 'success') {
          form.reset();
        }
      }
    );
  }

}
