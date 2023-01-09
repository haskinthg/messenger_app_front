import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() onChangedChat =  new EventEmitter<Chat>()

  chats: Chat[] = [];

  ngOnInit(): void {
    this.username = this.service.username;
    this.service.getChats(this.username).subscribe(data => {
      this.chats = data;
    });
  }
  
  openChat(chat: Chat) {
    // this.onChangedChat.emit(chat);
    this.dataservice.updateChat(chat);
  }

  lastMessage(msg: Message) {
    if(msg!=null) return msg.value;
    return "";
  }

  nameChat(users: User[]){
    return users.filter(u=> u.username != this.username)[0].username;
  }

}
