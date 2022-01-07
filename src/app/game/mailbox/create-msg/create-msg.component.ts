import { Component, OnInit } from '@angular/core';
import { MailboxService } from '../mailbox.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-msg',
  templateUrl: './create-msg.component.html',
  styleUrls: ['./create-msg.component.scss'],
})
export class CreateMsgComponent implements OnInit {

  public users;
  public userId;
  public subject;
  public message;

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.mailboxService.loadRecipients().subscribe(data => {
      this.users = data;
      console.log(this.users);
    });

  }

  sendMsg() {
    const clbk = this.mailboxService.send(this.userId, this.subject, this.message);
    console.log(clbk);
    // console.log(this.userId);
  }

}
