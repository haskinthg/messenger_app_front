import { environment } from './../../../../environments/environment.prod';
import { WEBSOCKETTYPE_MAPPER } from './../../../models/WebSocketType';
import { WebSocketObject } from './../../../models/webSocketObject';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Chat } from 'src/app/models/chat/chat';
import { Message } from 'src/app/models/message/message';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { SendDataService } from 'src/app/services/send-data.service';
import { WebSocketType } from 'src/app/models/WebSocketType';

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
    this.dataservice.lastMsg$.subscribe((msg) => this.getLastMsg(msg));
    this.dataservice.newChatMessage$.subscribe((chatmsg) => this.newChatMessage(chatmsg));
    this.service.getChats(this.username).subscribe(data => {
      this.chats = data;
    });
  }

  newChatMessage(msg: WebSocketObject<Chat>) {
    if (!this.chats.some(c=> c.id ===msg.content.id)) {
      switch (WEBSOCKETTYPE_MAPPER[msg.type]) {
        case WebSocketType.ADD: {
          this.chats = [msg.content, ...this.chats];
          break;
        }
        case WebSocketType.DELETE: {
          this.chats.splice(this.chats.findIndex(c => c.id === msg.content.id), 1);
          break;
        }
        case WebSocketType.UPDATE: {
          this.chats[this.chats.findIndex(c => c.id === msg.content.id)] = msg.content;
          break;
        }
      }
    }
  }

  openChat(chat: Chat) {
    this.dataservice.updateChat(chat);
    this.search = "";
  }

  lastMessage(msg: Message) {
    if (msg != null) return msg.value;
    return "";
  }

  nameChat(users: User[]) {
    if (users.every(u => u.username === this.service.username))
      return "Избранное";
    return users.find(u => u.username != this.username)?.username;
  }

  chatPhoto(users:User[]) {
    // console.log(users.find(u => u.username != this.username));
    return (users.find(u => u.username != this.username) as User).photo;
  }

  getFilterUsers(name: Event) {
    let filter = (name.target as HTMLInputElement).value;
    console.log(filter);
    this.service.findUsersByFilter(filter).subscribe(data => {
      this.users = data;
      console.log(data);
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
    (this.chats.find(ch => ch.id === msg.content.chat_id) as Chat).lastMessage = msg.content;
  }

  addChat(user: User) {
    this.getChat2u(user.username);
  }

  getUrlMinio() {
    return environment.minio_s3_endpoint + `/${environment.minio_s3_bucket_name}/`;
  }

}
