import { Component,OnInit, ViewChild } from '@angular/core';
import { Chat } from 'src/app/models/chat/chat';
import { MessangesComponent } from './messanges/messanges.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  // currentChat: Chat;

  // @ViewChild(MessangesComponent, {static: false})
  //   private msgComponent: MessangesComponent|undefined;

  ngOnInit(): void {
  }
  
  // changeChat(event: Chat) {
  //   console.log("chat changed: ", event);
  //   this.currentChat = event;
  //   this.msgComponent?.changedChat()
  // }



}
