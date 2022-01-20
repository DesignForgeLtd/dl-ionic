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
  public page = 1;

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.mailboxService.loadThreads(this.page).subscribe(result => {
      this.threads = result.data;
      this.isLoading = false;
      console.log(result.data);
    });
  }

  onNextPage() {
    this.page++;
    this.mailboxService.loadThreads(this.page).subscribe(result => {
      this.threads = result.data;
      this.isLoading = false;
      console.log(result);
    });
  }

}
