import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {ScrollingModule} from '@angular/cdk/scrolling';


import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatsComponent } from './components/user/chats/chats.component';
import { MessangesComponent } from './components/user/messanges/messanges.component'
import { UserComponent } from './components/user/user.component';
import { SessionStorageService } from 'angular-web-storage';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    ChatsComponent,
    MessangesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    MatDividerModule,
    ScrollingModule
  ],
  providers: [ SessionStorageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
