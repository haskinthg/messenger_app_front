import { MESSAGE_TYPE_MAPPER } from './../../../models/message/messageType';
import { environment } from './../../../../environments/environment';
import { MinioService } from './../../../services/minio.service';
import { AfterViewChecked, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat/chat';
import { Message } from 'src/app/models/message/message';
import { MessageStatus } from 'src/app/models/message/messageStatus';
import { MessageType } from 'src/app/models/message/messageType';
import { WebSocketObject } from 'src/app/models/webSocketObject';
import { WebSocketType } from 'src/app/models/WebSocketType';
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
  }

  // для скроллинга
  distance: number = 2;
  throttle: number = 200;
  page: number = 0;
  size: number = 20;

  countMsgs: number = 0;

  // url_file: string = `${environment.minio_s3_endpoint}:${environment.minio_s3_port}/${environment.minio_s3_bucket_name}/`;
  url_file: string = '';


  // text of message for sending message
  text_msg: string = "";
  type: MessageType = MessageType.TEXT;

  // child message for forward or reply
  childMessage: Message = null;

  onScroll() {
    this.page++;
    this.service.getMessagesByChatId(this.currentChat.id, this.page, this.size).subscribe(data => {
      this.msgs = [...data, ...this.msgs];
    });
  }
  //
  // array messages
  msgs: Message[] = [];


  @Input() currentChat: Chat;

  ngOnInit(): void {
    this.dataservice.chat$.subscribe((chat) => this.changedChat(chat))
    this.dataservice.newMessage$.subscribe((msg) => this.newMessage(msg));
    this.dataservice.forwardMessage$.subscribe((msg)=> this.childMessage = msg);
  }

  changeChildMessage(msg: Message) {
    this.childMessage = msg;
  }

  ScrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById("conv");
      (container as HTMLElement).scrollTop = (container as HTMLElement).scrollHeight;
    }, 100);

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
    if (this.currentChat != undefined)
      this.service.getMessagesByChatId(this.currentChat.id, this.page, this.size).subscribe(data => {
        this.msgs = data;
      });
    this.ScrollToBottom();
  }

  newMessage(msg: WebSocketObject<Message>) {
    if (this.currentChat.id === msg.content.chat_id) {
      switch (msg.type) {
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

  // sending message
  msg: Message;
  async sendMessage() {

    if (this.childMessage != null) {
      if (this.currentChat.id === this.childMessage.chat_id)
        this.type = MessageType.REPLY;
      else this.type = MessageType.FORWARD;
    }

    let socketMsg = new WebSocketObject<Message>();
    socketMsg.type = WebSocketType.ADD;
    this.msg.chat_id = this.currentChat.id;
    this.msg.status = MessageStatus.RECEIVED;
    this.msg.usernameFrom = this.service.username;
    if (!this.currentChat.users.every(u => u.username === this.service.username))
      this.msg.usernameTo = this.currentChat.users.filter(e => e.username != this.service.username)[0].username;
    this.msg.messageType = this.type;
    switch (this.type) {
      case MessageType.TEXT: {
        if (this.text_msg != '')
          this.msg.value = this.text_msg;
        else return;
        break;
      }
      case MessageType.IMAGE: {
        if (this.file != null)
          this.msg.value = this.file.name;
        else return;
        break;
      }
      case MessageType.FILE: {
        if (this.file != null)
          this.msg.value = this.file.name;
        else return;
        break;
      }
      case MessageType.REPLY: {
        if (this.childMessage != null) {
          this.msg.value = this.text_msg;
          this.msg.childMessage = this.childMessage;
        }
        else return;
        break;
      }
      case MessageType.FORWARD: {
        if (this.childMessage != null) {
          this.msg.value = this.text_msg;
          this.msg.childMessage = this.childMessage;
        }
        else return;
        break;
      }
    }
    socketMsg.content = this.msg;
    if (this.msg.messageType === MessageType.FILE || this.msg.messageType === MessageType.IMAGE) {
      this.minioService.putObject(this.file);
      this.delFile();
    }
    this.service.send(socketMsg);
    this.text_msg = '';
    this.type = MessageType.TEXT;
    this.childMessage = null as Message;
    this.dataservice.updateForward(null as Message);
  }

  delChatClick() {
    let msg = new WebSocketObject<Chat>();
    msg.content = Object.assign({}, this.currentChat);
    msg.type = WebSocketType.DELETE;
    this.currentChat = null as Chat;
    this.dataservice.updateDelChat(msg);
  }

  delMessageClick(msg: Message) {
    let socketMsg = new WebSocketObject<Message>();
    socketMsg.type = WebSocketType.DELETE;
    socketMsg.content = msg;
    this.service.send(socketMsg);
  }

  messangeSenderMenuClick(event: Event) {
    this.type = (event.target as HTMLElement).id as MessageType;
  }

  changeChildMessageClick(msg: Message) {
    this.dataservice.updateForward(msg);
    this.childMessage = msg;
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


  file: File;
  public onFileSelected(event: EventEmitter<File[]>) {
    this.file = event[0];
    // this.minioService.putObject(this.file);
  }

  delFile() {
    (document.getElementById('input__file') as HTMLInputElement).value = '';
    this.file = null as File;
  }


  rekurs(msg: Message) {
    return
  }

}
