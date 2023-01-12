import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message/message';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'
import { MessangesComponent } from '../components/user/messanges/messanges.component';
import { WebSocketObject } from '../models/webSocketObject';
import { AuthService } from '../auth/auth.service';
import { SendDataService } from './send-data.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private auth: AuthService, private sendDataService: SendDataService) {
    this.sendDataService.username$.subscribe((username)=>this.username = username);
    this.initWebSocket();
  }
  username: string = "";
  private url = "api/messages";
  // private messageComp: MessangesComponent;

  // setComp(value: MessangesComponent) {
  //   this.messageComp = value;
  // }

  stompClient: any;
  ws: any;
  ws_url = "ws";


  getMessagesByChatId(id: number, page: number, size: number) {
    return this.http.get<Message[]>(this.url + `/chat/${id}/${page}/${size}`).pipe();
  }

  getCountMsg(id: number) {
    return this.http.get<number>(this.url + `/chat/${id}`).pipe();
  }

  newMessage(msg: WebSocketObject<Message>) {
    // this.messageComp.newMessage(msg);
    this.sendDataService.updateNewMessage(msg);
  }

  initWebSocket() {
    this.ws = new SockJS(this.ws_url);
    this.stompClient = Stomp.over(this.ws);
    this.stompClient.connect({}, (frame: Stomp.Frame) => {
      console.log("connected by websocket (messages)", frame);
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
