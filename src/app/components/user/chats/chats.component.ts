import { WebSocketObject } from './../../../models/webSocketObject';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Chat } from 'src/app/models/chat/chat';
import { Message } from 'src/app/models/message/message';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { SendDataService } from 'src/app/services/send-data.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  constructor(private service: ChatService, private dataservice: SendDataService) {
  }

  search: string = '';

  username: string = "";
  // users: ShortUser[] = []

  @Output() onChangedChat = new EventEmitter<Chat>()

  chats: Chat[] = [];

  users: User[] = [];

  ngOnInit(): void {
    this.username = this.service.username;
    this.dataservice.lastMsg$.subscribe((msg)=>this.getLastMsg(msg));
    this.service.getChats(this.username).subscribe(data => {
      this.chats = data;
    });
  }

  openChat(chat: Chat) {
    this.dataservice.updateChat(chat);
  }

  lastMessage(msg: Message) {
    if (msg != null) return msg.value;
    return "";
  }

  nameChat(users: User[]) {
    if(users.every(u=>u.username===this.service.username))
      return "Избранное";
    return users.find(u => u.username != this.username)?.username;
  }

  getFilterUsers(name: Event) {
    let filter = (name.target as HTMLInputElement).value;
    this.service.findUsersByFilter(filter).subscribe(data => {
      this.users = data;
    })
  }

  getChat2u(u: string) {
    this.service.getChatBy2Users(u, this.username).subscribe(data => {
      if (!this.chats.some(chat => chat.id === data.id))
        this.chats = [data, ...this.chats];
        this.openChat(data);
    })
  }

  getLastMsg(msg: WebSocketObject<Message>) {
    (this.chats.find(ch=> ch.id === msg.content.chat_id) as Chat).lastMessage=msg.content;
  }

  addChat(user: User) {
    this.getChat2u(user.username);
  }

}
