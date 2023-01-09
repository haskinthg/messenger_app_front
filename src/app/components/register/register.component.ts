import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { REG_MAPPER } from 'src/app/models/registerstatus';
import { Credential } from './../../models/credential'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  contain: boolean;
  error: boolean;
  success: boolean;
  credential: Credential;

  ngOnInit(): void {
    this.authService.clearLoginData();
    this.credential = new Credential();
  }

  register() {
    this.authService.register(this.credential, (i: number) => {
      if (i === 1) this.contain = true;
      if (i === 2) this.error = true;
      if (i === 3) {
        this.success = true;
        setTimeout(() => {
          this.tolog();
        }, 3000);
      }
    })
  }

  tolog() {
    this.router.navigate(['login']);
  }

}
