import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message/message';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'
import { MessangesComponent } from '../components/user/messanges/messanges.component';
import { WebSocketObject } from '../models/webSocketObject';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private auth: AuthService) {
    this.initWebSocket();
  }
  username: string = "";
  private url = "api/messages";
  private messageComp: MessangesComponent;

  setComp(value: MessangesComponent) {
    this.messageComp = value;
  }

  stompClient: any;
  ws_url = "ws";

  getMessageByChatId(id: number) {
    return this.http.get<Message[]>(this.url + `/chat/${id}`).pipe();
  }

  newMessage(msg: WebSocketObject<Message>) {
    this.messageComp.newMessage(msg);
  }

  initWebSocket() {
    var ws = new SockJS(this.ws_url);
    console.log("url: ", ws.url);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, (frame: Stomp.Frame) => {
      console.log("connected by websocket", frame);
      this.username = this.auth.LoggedUser.name;
      this.stompClient.subscribe(`/user/${this.username}/messages`, (payload: any) => {
        this.newMessage(JSON.parse(payload.body));
      })
    }, this.onError);
  }

  send(msg: WebSocketObject<Message>) {
    this.stompClient.send("/app/conversation", {}, JSON.stringify(msg));
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
