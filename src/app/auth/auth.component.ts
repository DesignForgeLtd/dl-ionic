import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  isLoginMode = true;

  constructor() { }

  ngOnInit() {}

  onSubmit(form: NgForm){
    console.log(form.value);
  }

  onSwitchMode(){
    this.isLoginMode = ! this.isLoginMode;
  }

}
