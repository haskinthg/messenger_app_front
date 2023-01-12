import { SendDataService } from 'src/app/services/send-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {Credential} from './../../models/credential'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private sendData: SendDataService) { }

  errorAuth: boolean;
  credential: Credential;

  ngOnInit(): void {
    this.authService.clearLoginData();
    this.credential = new Credential();
    this.authService.logout();
  }

  login() {
    this.authService.authenticate(this.credential, () => {
      this.errorAuth = true;
      return;
    });
    this.sendData.updateUsername(this.credential.username);
  }

  toreg() {
    this.router.navigate(['register']);
  }

}
