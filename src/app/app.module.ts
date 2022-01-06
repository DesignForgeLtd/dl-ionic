import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './game/game.component';
import { MapComponent } from './game/map/map.component';
import { MenuComponent } from './game/menu/menu.component';
import { AuthComponent } from './auth/auth.component';
import { MailboxComponent } from './game/mailbox/mailbox.component';
import { InboxComponent } from './game/mailbox/inbox/inbox.component';
import { OutboxComponent } from './game/mailbox/outbox/outbox.component';
import { CreateMsgComponent } from './game/mailbox/create-msg/create-msg.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MapComponent,
    MenuComponent,
    AuthComponent,
    MailboxComponent,
    InboxComponent,
    OutboxComponent,
    CreateMsgComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
