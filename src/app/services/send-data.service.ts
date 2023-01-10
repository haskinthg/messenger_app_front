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

  updateChat(chat: Chat) {
    this.chat$.next(chat);
  }

  updateLastMsg(msg:WebSocketObject<Message>) {
    this.lastMsg$.next(msg);
  }
  constructor() { }
}
