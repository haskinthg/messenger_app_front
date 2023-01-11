import { MESSAGE_TYPE_MAPPER } from './../../../models/message/messageType';
import { environment } from './../../../../environments/environment';
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
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-messanges',
  templateUrl: './messanges.component.html',
  styleUrls: ['./messanges.component.css']
})
export class MessangesComponent implements OnInit {

  constructor(private service: MessageService, private dataservice: SendDataService, private minioService: MinioService) {
    this.minioService.url = (this.service.ws.url as string).replace('4200/ws', '9000');
    this.minioService.initMinio();
    this.url_file = this.minioService.url + `/${environment.minio_s3_bucket_name}/`
    console.log(this.minioService.url,"to minio");
  }

  // для скроллинга
  distance: number = 2;
  throttle: number = 50;
  page: number = 0;
  size: number = 20;

  countMsgs: number = 0;

  // url_file: string = `${environment.minio_s3_endpoint}:${environment.minio_s3_port}/${environment.minio_s3_bucket_name}/`;
  url_file: string = '';

  text_msg: string = "";


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
    // this.service.setComp(this);
    this.dataservice.newMessage$.subscribe((msg) => this.newMessage(msg));
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
    setTimeout(() => this.ScrollToBottom(), 20);
  }

  newMessage(msg: WebSocketObject<Message>) {
    if (this.currentChat.id === msg.content.chat_id) {
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
    this.dataservice.updateLastMsg(msg);
    setTimeout(() => this.ScrollToBottom(), 10);
  }

  msg: Message;
  async sendMessage() {
    this.msg.chat_id = this.currentChat.id;
    this.msg.messageType = MessageType.TEXT;
    this.msg.status = MessageStatus.RECEIVED;
    this.msg.usernameFrom = this.service.username;
    if (!this.currentChat.users.every(u => u.username === this.service.username))
      this.msg.usernameTo = this.currentChat.users.filter(e => e.username != this.service.username)[0].username;
    let socketMsg = new WebSocketObject<Message>();
    this.msg.value = this.text_msg;
    socketMsg.content = this.msg;
    socketMsg.type = WebSocketType.ADD;
    this.service.send(socketMsg);
    console.log(this.msgs);
    this.msg = new Message();
    this.text_msg = "";
  }

  nameChat() {
    return this.currentChat.users.find(e => e.username != this.service.username)?.username
  }


  dateTime(date: Date) {
    var newDate = new Date(date).toLocaleString();
    return newDate;
  }

  checkType(type: MessageType) {
    return MESSAGE_TYPE_MAPPER[type];
  }

  chatPhoto() {
    return (this.currentChat.users.find(u => u.username != this.service.username) as User).photo;
  }
}
