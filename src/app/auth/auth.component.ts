import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthStateService } from './auth-state.service';
import { Router } from '@angular/router';

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
  isLoading = false;
  error: string = null;

  registrationSuccessful = false;
  registrationUnsuccessful = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
    private router: Router
  ) { }

  ngOnInit() {}

  onSubmit(form: NgForm){
    if ( ! form.valid){
      return;
    }

    this.isLoading = true;
    if (this.isLoginMode){
      this.login(form);
    } else {
      this.register(form);
    }
  }

  login(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/game']);
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
      }
    );
  }

  register(form: NgForm){
    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    this.authService.register(name, email, password).subscribe(
      response => {
        console.log(response);
        if (response.status === 'success'){
          this.isLoginMode = true;
          this.registrationSuccessful = true;
          form.reset();
        }
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
      }
    );
  }


  onSwitchMode(){
    this.isLoginMode = ! this.isLoginMode;
  }

}
