import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router) { }

  check: boolean = false;
  user: User =  new User();;

  ngOnInit(): void {
  }

  a() {
    console.log(this.check)
  }

  tolog() {
    this.router.navigate(['login']);
  }

}

export class User {
  login:string;
  password:string;
}
