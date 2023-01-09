import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat/chat';
import { Message } from 'src/app/models/message/message';
import { MessageStatus } from 'src/app/models/message/messageStatus';
import { MessageType } from 'src/app/models/message/messageType';
import { WebSocketObject } from 'src/app/models/webSocketObject';
import { WebSocketType, WEBSOCKETTYPE_MAPPER } from 'src/app/models/WebSocketType';
import { MessageService } from 'src/app/services/message.service';
import { SendDataService } from 'src/app/services/send-data.service';

@Component({
  selector: 'app-messanges',
  templateUrl: './messanges.component.html',
  styleUrls: ['./messanges.component.css']
})
export class MessangesComponent implements OnInit {

  constructor(private service: MessageService, private dataservice: SendDataService) { }

  // для скроллинга
  distance: number = 10;
  throttle: number = 0;
  onScroll() {
    console.log("need scroll");
  }
  // 

  msgs: Message[] = [];

  valueMessage: string;

  @Input() currentChat: Chat;

  ngOnInit(): void {
    this.dataservice.chat$.subscribe((chat) => this.changedChat(chat))
    this.service.setComp(this);
    // this.service.setComp(this);
    // this.service.getMessageByChatId(this.currentChat.id);
  }

  ScrollToBottom() {
    const container = document.getElementById("conv");
    (container as HTMLElement).scrollTop = (container as HTMLElement).scrollHeight;
    console.log(container);
  }

  messageSide(msg: Message): string {
    if (msg.user.username === this.service.username)
      return 'message-card right';
    else
      return 'message-card left';
  }

  changedChat(chat: Chat) {
    this.currentChat = chat;
    console.log(this.currentChat, this.msgs);
    if (this.currentChat != undefined)
      this.service.getMessageByChatId(this.currentChat.id).subscribe(data => {
        this.msgs = data;
        console.log("data ", data);
      });
    this.ScrollToBottom();
  }

  newMessage(msg: WebSocketObject<Message>) {
    switch (WEBSOCKETTYPE_MAPPER[msg.type]) {
      case WebSocketType.ADD: {
        this.msgs.push(msg.content);
        break;
      }
      case WebSocketType.DELETE: {
        this.msgs.splice(this.msgs.findIndex(m => msg.content.id === m.id), 1);
      }
    }
  }

  sendMessage() {
    let msg = new Message();
    msg.chat_id = 1;
    msg.messageType = MessageType.TEXT;
    msg.status = MessageStatus.RECEIVED;
    msg.usernameFrom = this.service.username;
    msg.usernameTo = this.currentChat.users.filter(e => e.username != this.service.username)[0].username;
    msg.value = this.valueMessage;
    let socketMsg = new WebSocketObject<Message>();
    socketMsg.content = msg;
    socketMsg.type = WebSocketType.ADD;
    this.service.send(socketMsg);
    console.log(this.msgs);
  }


}
