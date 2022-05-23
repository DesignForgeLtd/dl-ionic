import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeroActiveElixirsComponent } from './hero-active-elixirs.component';

describe('HeroActiveElixirsComponent', () => {
  let component: HeroActiveElixirsComponent;
  let fixture: ComponentFixture<HeroActiveElixirsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroActiveElixirsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroActiveElixirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
