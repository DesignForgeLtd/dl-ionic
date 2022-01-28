import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MailboxService } from '../mailbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {

  @Output() chooseThread = new EventEmitter<{threadId: number; threadTitle: string}>();

  public myID = JSON.parse(localStorage.getItem('userData')).id;
  public isLoading = true;
  public showMessages = 1;
  public threads: any;
  public page = 1;
  public lastPage: number;
  public links: {
    active: boolean;
    label: any;
  }[];

  constructor(private mailboxService: MailboxService) { }

  ngOnInit() {
    this.onLoadThreads(this.page);
  }

  onLoadThreads(page: number) {
    this.mailboxService.loadThreads(page).subscribe(result => {
      this.threads = result.data;
      this.showMessages = result.data.length;
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
        //change string type to number type for page numbers
        element.label = parseInt(element.label, 10);
      });
    });
  }

  onChangePage(page: number) {
    this.onLoadThreads(page);
  }

  onThreadSelected(threadId: number, threadTitle: string) {
    this.chooseThread.emit({threadId, threadTitle});
  }

}
