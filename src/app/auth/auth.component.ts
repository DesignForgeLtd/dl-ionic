import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  SocialUser,
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

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

  socialUser!: SocialUser;

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  registrationSuccessful = false;
  registrationUnsuccessful = false;

  private googleAccessToken = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit() {
    if (this.authService.user.value){
      this.router.navigate(['/game']);
    }

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      //this.isLoggedin = user != null;
      console.log(this.socialUser);

      if (this.socialUser !== null){
        this.socialAuth();
      }
    });
  }

  socialAuth(): void{
    this.authService.socialAuth(this.socialUser).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/game']);
      },
      error => {
        console.log(error);
        this.error = error;
      }
    );
  }

  getGoogleAccessToken(): void {
    this.socialAuthService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.googleAccessToken = accessToken);
  }
  
  refreshGoogleToken(): void {
    this.socialAuthService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
  }
  
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }


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
        } else {
          if (response.error){
            this.error = response.error.email;
          }
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
