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
  public lastPage: number;
  public links: {
    active: boolean;
    label: string;
  }[];

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.onLoadThreads(this.page);
  }

  onLoadThreads(page) {
    this.mailboxService.loadThreads(page).subscribe(result => {
      this.threads = result.data;
      this.isLoading = false;

      this.page = result.current_page;
      this.lastPage = result.last_page;
      this.page = result.current_page;
      this.links = result.links;

      //remove prev and next from array
      this.links.forEach((element, index) => {
        if(element.label === 'pagination.previous' || element.label === 'pagination.next') {
          this.links.splice(index,1);
        }
      });
    });
  }

  onChangePage(page) {
    this.onLoadThreads(page);
  }

}
