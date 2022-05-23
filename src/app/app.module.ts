import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { StoreModule } from '@ngrx/store';

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
import { BaggageComponent } from './game/baggage/baggage.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { HeroAttributesComponent } from './game/hero/hero-attributes/hero-attributes.component';
import { CommonModule } from '@angular/common';
import { MapProductionLocationComponent } from './game/map/map-production-location/map-production-location.component';
import { ProductionLinesComponent } from './game/map/map-production-location/production-lines/production-lines.component';
import { ProductionLineComponent } from './game/map/map-production-location/production-lines/production-line/production-line.component';

//import { productionLocationReducer } from './game/map/map-production-location/store/production-location.reducer';
import { ProductionQueueComponent } from './game/map/map-production-location/production-queue/production-queue.component';
import { ProductionQueueItemComponent }
  from './game/map/map-production-location/production-queue/production-queue-item/production-queue-item.component';
import { JourneyComponent } from './game/journey/journey.component';
import { BaggageItemComponent } from './game/baggage/baggage-item/baggage-item.component';
import { ShopComponent } from './game/map/shop/shop.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeroComponent } from './game/hero/hero.component';
import { HeroActiveElixirsComponent } from './game/hero/hero-active-elixirs/hero-active-elixirs.component';
import { HeroOccupationsComponent } from './game/hero/hero-occupations/hero-occupations.component';
import { HeroSkillsComponent } from './game/hero/hero-skills/hero-skills.component';



@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MapComponent,
    MapLocationComponent,
    MapProductionLocationComponent,
    ProductionLinesComponent,
    ProductionLineComponent,
    ProductionQueueComponent,
    ProductionQueueItemComponent,
    MenuComponent,
    AuthComponent,
    MailboxComponent,
    InboxComponent,
    MsgThreadComponent,
    CreateMsgComponent,
    BaggageComponent,
    BaggageItemComponent,
    LoadingSpinnerComponent,
    HeroComponent,
    HeroActiveElixirsComponent,
    HeroAttributesComponent,
    HeroOccupationsComponent,
    HeroSkillsComponent,
    JourneyComponent,
    ShopComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
//    StoreModule.forRoot({productionLocation: productionLocationReducer}),
    HttpClientModule,
    FormsModule,
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
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
