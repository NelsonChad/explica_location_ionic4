import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinalizePage } from './finalize.page';

describe('FinalizePage', () => {
  let component: FinalizePage;
  let fixture: ComponentFixture<FinalizePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
