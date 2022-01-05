import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  public name;
  public email;
  public password;
  public confirmPassword;

  constructor() { }

  ngOnInit() {}

  register(form){
    console.log('registration data: ');
    console.log(form);
  }

  onSubmit(){

  }

}
