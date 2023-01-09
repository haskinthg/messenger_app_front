import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Chat } from '../models/chat/chat';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {

  public chat$ = new Subject<Chat>();

  updateChat(chat: Chat) {
    this.chat$.next(chat);
  }
  constructor() { }
}
