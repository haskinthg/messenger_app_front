import { MinioService } from './../../../services/minio.service';
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

  constructor(private service: MessageService, private dataservice: SendDataService, private minioService: MinioService) { }

  // для скроллинга
  distance: number = 2;
  throttle: number = 50;
  page: number = 0;
  size: number = 20;

  countMsgs: number = 0;

  onScroll() {
    this.page++;
    console.log("scroll", this.page);
    this.service.getMessagesByChatId(this.currentChat.id, this.page, this.size).subscribe(data => {
      this.msgs = [...data, ...this.msgs];
    });
    setTimeout(() => console.log(this.msgs), 200);
  }
  //

  msgs: Message[] = [];


  @Input() currentChat: Chat;

  ngOnInit(): void {
    this.dataservice.chat$.subscribe((chat) => this.changedChat(chat))
    this.service.setComp(this);
  }

  ScrollToBottom() {
    const container = document.getElementById("conv");
    setTimeout(() => (container as HTMLElement).scrollTop = (container as HTMLElement).scrollHeight, 50);

  }

  messageSide(msg: Message): string {
    if (msg.user.username === this.service.username)
      return 'message-card right';
    else
      return 'message-card left';
  }

  changedChat(chat: Chat) {
    this.msg = new Message();
    this.page = 0;
    this.currentChat = chat;
    console.log(this.page);
    if (this.currentChat != undefined)
      this.service.getMessagesByChatId(this.currentChat.id, this.page, this.size).subscribe(data => {
        this.msgs = data;
      });
    setTimeout(()=> this.ScrollToBottom(),20);
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
    this.dataservice.updateLastMsg(msg);
    setTimeout(()=> this.ScrollToBottom(),10);
  }

  msg: Message;
  async sendMessage() {
    this.msg.chat_id = this.currentChat.id;
    this.msg.messageType = MessageType.TEXT;
    // this.msg.status = MessageStatus.RECEIVED;
    this.msg.usernameFrom = this.service.username;
    if (!this.currentChat.users.every(u => u.username === this.service.username))
      this.msg.usernameTo = this.currentChat.users.filter(e => e.username != this.service.username)[0].username;
    let socketMsg = new WebSocketObject<Message>();
    socketMsg.content = this.msg;
    socketMsg.type = WebSocketType.ADD;
    this.service.send(socketMsg);
    console.log(this.msgs);
    this.msg = new Message();
  }

  nameChat() {
    return this.currentChat.users.find(e => e.username != this.service.username)?.username
  }


  dateTime(date: Date) {
    var newDate = new Date(date).toLocaleString();
    return newDate;
  }


}
