import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  check: boolean = false;
  user: User =  new User();;

  ngOnInit(): void {
  }

  a() {
    console.log(this.check)
  }

  toreg() {
    this.router.navigate(['register']);
  }

}

export class User {
  login:string;
  password:string;
}
