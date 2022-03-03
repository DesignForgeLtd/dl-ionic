import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './game/game.component';
import { MapComponent } from './game/map/map.component';
import { MapLocationComponent } from './game/map/map-location/map-location.component';
import { MenuComponent } from './game/menu/menu.component';
import { AuthComponent } from './auth/auth.component';
import { MailboxComponent } from './game/mailbox/mailbox.component';
import { InboxComponent } from './game/mailbox/inbox/inbox.component';
import { MsgThreadComponent } from './game/mailbox/msg-thread/msg-thread.component';
import { CreateMsgComponent } from './game/mailbox/create-msg/create-msg.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { HeroAttributesComponent } from './game/hero/hero-attributes/hero-attributes.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MapComponent,
    MapLocationComponent,
    MenuComponent,
    AuthComponent,
    MailboxComponent,
    InboxComponent,
    MsgThreadComponent,
    CreateMsgComponent,
    LoadingSpinnerComponent,
    HeroAttributesComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
