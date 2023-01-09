import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/chat/chat';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private auth: AuthService) {
    //  this.initWebSocket();
    this.username = this.auth.LoggedUser.name;
  }

  username: string = "";

  private url = "api/chats";
  stompClient: any;
  ws_url = "ws";

  getChats(username: string) {
    return this.http.get<Chat[]>(this.url + `/${username}`).pipe();
  }

  initWebSocket() {
    var ws = new SockJS(this.ws_url);
    console.log("url: ", ws.url);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, this.onConnected, this.onError);
  }

  private onConnected() {
    console.log("connected");
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
