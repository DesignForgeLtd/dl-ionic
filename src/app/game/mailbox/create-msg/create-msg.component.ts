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

  public clbck;

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.mailboxService.loadRecipients().subscribe(data => {
      this.users = data;
    });

  }

  sendMsg() {
    this.mailboxService.send(this.userId, this.subject, this.message).subscribe(data => {
      this.clbck = data;
      console.log(this.clbck);
    });
    console.log(this.clbck);
    // console.log(this.userId);
  }

}
