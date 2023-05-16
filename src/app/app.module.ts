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
import { MapGfxComponent } from './game/map/map-gfx/map-gfx.component';
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
import { HeroComponent } from './game/hero/hero.component';
import { HeroActiveElixirsComponent } from './game/hero/hero-active-elixirs/hero-active-elixirs.component';
import { HeroOccupationsComponent } from './game/hero/hero-occupations/hero-occupations.component';
import { HeroSkillsComponent } from './game/hero/hero-skills/hero-skills.component';
import { BadgesComponent } from './game/hero/badges/badges.component';
import { BaggagePopoverComponent } from './game/baggage/baggage-popover/baggage-popover.component';
import { MonsterComponent } from './game/map/monster/monster.component';
import { BankComponent } from './game/map/bank/bank.component';
import { WitchComponent } from './game/map/witch/witch.component';
import { WeaponFixComponent } from './game/map/weapon-fix/weapon-fix.component';
import { ReceivedBadgeComponent } from './game/received-badge/received-badge.component';
import { MiningComponent } from './game/mining/mining.component';
import { MinePortalComponent } from './game/mining/mine-portal/mine-portal.component';
import { QuestsComponent } from './game/quests/quests.component';
import { QuestModalComponent } from './game/quest-modal/quest-modal.component';
import { DailyQuestsComponent } from './game/quests/daily-quests/daily-quests.component';
import { RegularQuestsComponent } from './game/quests/regular-quests/regular-quests.component';
import { QuickUseBeltComponent } from './game/quick-use-belt/quick-use-belt.component';
import { MarketplaceComponent } from './game/baggage/marketplace/marketplace.component';
import { MarketplaceNavigationComponent } from './game/baggage/marketplace/marketplace-navigation/marketplace-navigation.component';
import { WarehouseComponent } from './game/baggage/warehouse/warehouse.component';
import { WarehouseNavigationComponent } from './game/baggage/warehouse/warehouse-navigation/warehouse-navigation.component';
import { FindComponent } from './game/map/stroll-event/find/find.component';
import { FightComponent } from './game/map/stroll-event/fight/fight.component';
import { LevelUpHeroComponent } from './game/level-up-hero/level-up-hero.component';
import { LevelUpOccupationComponent } from './game/level-up-occupation/level-up-occupation.component';
import { HeroEquipmentComponent } from './game/hero/hero-equipment/hero-equipment.component';
import { BeltItemComponent } from './game/hero/belt-item/belt-item.component';
import { World } from './game/map/map-scripts/World';
import { Player } from './game/map/map-scripts/Player';

import { ReactiveFormsModule } from '@angular/forms';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

import {
  googleOAuth,
  facebookOAuth
} from '../environments/environment';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { WS } from './websockets/WS';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MapComponent,
    MapGfxComponent,
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
    BadgesComponent,
    JourneyComponent,
    ShopComponent,
    BankComponent,
    WitchComponent,
    WeaponFixComponent,
    BaggagePopoverComponent,
    MonsterComponent,
    MiningComponent,
    MinePortalComponent,
    ReceivedBadgeComponent,
    QuestsComponent,
    QuestModalComponent,
    DailyQuestsComponent,
    RegularQuestsComponent,
    QuickUseBeltComponent,
    MarketplaceComponent,
    MarketplaceNavigationComponent,
    WarehouseComponent,
    WarehouseNavigationComponent,
    FindComponent,
    FightComponent,
    LevelUpHeroComponent,
    LevelUpOccupationComponent,
    HeroEquipmentComponent,
    BeltItemComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    SocialLoginModule,
    IonicModule.forRoot(),
    AppRoutingModule,
//    StoreModule.forRoot({productionLocation: productionLocationReducer}),
    HttpClientModule,
    FormsModule,
    CommonModule,
    SocketIoModule.forRoot(config),
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
    },
    {
        provide: 'SocialAuthServiceConfig',
        useValue: {
            autoLogin: false,
            providers: [
                {
                    id: GoogleLoginProvider.PROVIDER_ID,
                    provider: new GoogleLoginProvider(googleOAuth.clientId)
                },
                {
                    id: FacebookLoginProvider.PROVIDER_ID,
                    provider: new FacebookLoginProvider(facebookOAuth.appId)
                }
            ],
            onError: (err) => {
                console.error(err);
            }
        } as SocialAuthServiceConfig,
    },
    World,
    Player,
    WS
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
