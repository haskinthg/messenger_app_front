import { MinioService } from './../../../services/minio.service';
import { UserFilename } from './../../../models/UserFilename';
import { ProfileComponent } from './../profile/profile.component';
import { AuthService } from './../../../auth/auth.service';
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
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  constructor(private service: ChatService,
    private dataservice: SendDataService,
    private auth: AuthService,
    public dialog: MatDialog,
    private minio: MinioService) {
  }

  search: string = '';
  username: string = "";
  // users: ShortUser[] = []

  @Output() onChangedChat = new EventEmitter<Chat>()
  chats: Chat[] = [];
  users: User[] = [];

  currentChat: Chat;

  ngOnInit(): void {
    this.username = this.service.username;
    this.dataservice.lastMsg$.subscribe((msg) => this.getLastMsg(msg));
    this.dataservice.newChatMessage$.subscribe((chatmsg) => this.newChatMessage(chatmsg));
    this.dataservice.delChat$.subscribe((chatmsg) => this.deleteChat(chatmsg));
    this.dataservice.chat$.subscribe((chat) => this.currentChat = chat);
    this.service.getChats(this.username).subscribe(data => {
      this.chats = data;
    });
  }

  deleteChat(chatmsg: WebSocketObject<Chat>) {
    this.service.newChatMessageWebSocket(chatmsg);
    this.chats.splice(this.chats.findIndex(c => c.id === chatmsg.content.id), 1);
  }

  newChatMessage(msg: WebSocketObject<Chat>) {
    if (!this.chats.some(c => c.id === msg.content.id)) {
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

  profile() {
    this.service.getUserByUsername(this.username).subscribe(u => {
      const d: UserFilename = new UserFilename;
      d.user = u;
      d.url = environment.minio_s3_endpoint + `/${environment.minio_s3_bucket_name}/`;
      const dialogProfile = this.dialog.open(ProfileComponent, {
        width: '400px',
        data: d
      });
      console.log(d);
      dialogProfile.afterClosed().subscribe((result: UserFilename) => {
        console.log(result);
        if (result != null) {
          console.log(result);
          this.minio.putObject(result.file);
          this.service.updateUser(result.user).subscribe(dat => {
            console.log(dat, 'с сервера');
            this.users[(this.users.findIndex(c => c.id === dat.id))] = dat;
          });
        }
      });
    });

  }

  logout() {
    this.auth.logout();
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

  chatPhoto(users: User[]) {
    return (users.find(u => u.username != this.username) as User).photo;
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
    (this.chats.find(ch => ch.id === msg.content.chat_id) as Chat).lastMessage = msg.content;
  }

  addChat(user: User) {
    this.getChat2u(user.username);
  }

  getUrlMinio() {
    return environment.minio_s3_endpoint + `/${environment.minio_s3_bucket_name}/`;
  }

}
