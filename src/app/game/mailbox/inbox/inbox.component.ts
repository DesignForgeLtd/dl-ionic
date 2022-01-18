import { Component, OnInit } from '@angular/core';
import { MailboxService } from '../mailbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {

  public isLoading = true;
  public threads;

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.mailboxService.loadThreads().subscribe(data => {
      this.threads = data;
      this.isLoading = false;
      console.log(data);
    });
  }

}
