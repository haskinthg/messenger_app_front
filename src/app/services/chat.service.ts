import { WebSocketObject } from './../models/webSocketObject';
import { SendDataService } from 'src/app/services/send-data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/chat/chat';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private auth: AuthService, private sendDataService: SendDataService) {
    this.initWebSocket();
    this.username = this.auth.LoggedUser.name;
  }

  username: string = "";

  private url = "api/chats";
  private user_url = "api/users";
  stompClient: any;
  ws: any;
  ws_url = "ws";

  getChats(username: string) {
    return this.http.get<Chat[]>(this.url + `/${username}`).pipe();
  }

  findUsersByFilter(usernameFilter: string) {
    return this.http.get<User[]>(this.user_url + `/${usernameFilter}`).pipe();
  }

  getChatBy2Users(u1: string, u2: string) {
    return this.http.get<Chat>(this.url + `/${u1}/${u2}`).pipe();
  }

  initWebSocket() {
    this.ws = new SockJS(this.ws_url);
    console.log("url: ", this.ws.url);
    this.stompClient = Stomp.over(this.ws);
    this.stompClient.connect({}, (frame: Stomp.Frame) => {
      console.log("connected by websocket (chats)", frame);
      this.username = this.auth.LoggedUser.name;
      this.stompClient.subscribe(`/user/${this.username}/chats`, (payload: any) => {
        this.newChatMessage(JSON.parse(payload.body));
      })
    }, this.onError);
  }

  newChatMessage(msg: WebSocketObject<Chat>){
    this.sendDataService.updateNewChatMessage(msg);
  }

  private onError() {
    console.log("websocket error");
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
      console.log('Disconnected by socket.');
    }
  }

}
