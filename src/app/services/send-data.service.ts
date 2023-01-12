import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Chat } from '../models/chat/chat';
import { Message } from '../models/message/message';
import { WebSocketObject } from '../models/webSocketObject';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  public chat$ = new Subject<Chat>();

  public lastMsg$ = new Subject<WebSocketObject<Message>>();

  public newChatMessage$ = new Subject<WebSocketObject<Chat>>();

  public newMessage$ = new Subject<WebSocketObject<Message>>();

  public delChat$ = new Subject<WebSocketObject<Chat>>();

  public username$ = new Subject<string>();


  public forwardMessage$ = new Subject<Message>();

  updateForward(msg: Message) {
    this.forwardMessage$.next(msg);
  }

  updateUsername(un: string) {
    this.username$.next(un);
  }

  updateDelChat(msg: WebSocketObject<Chat>) {
    this.delChat$.next(msg);
  }

  updateNewMessage(msg: WebSocketObject<Message>) {
    this.newMessage$.next(msg);
  }

  updateChat(chat: Chat) {
    this.chat$.next(chat);
  }

  updateNewChatMessage(chatmsg: WebSocketObject<Chat>) {
    this.newChatMessage$.next(chatmsg);
  }

  updateLastMsg(msg: WebSocketObject<Message>) {
    this.lastMsg$.next(msg);
  }
  constructor() { }
}
