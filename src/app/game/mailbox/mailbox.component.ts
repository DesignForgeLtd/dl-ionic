import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {

  @Output() closeMenu = new EventEmitter();

  public mailbox = 'inbox';
  public threadId: number;

  constructor() { }

  ngOnInit() {}

  closeFeature() {
    this.closeMenu.emit();
  }

  onChooseThread(threadId: number) {
    this.mailbox = 'thread';
    this.threadId = threadId;
  }

}
