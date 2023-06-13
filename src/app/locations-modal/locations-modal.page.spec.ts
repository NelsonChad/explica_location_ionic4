import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationsModalPage } from './locations-modal.page';

describe('LocationsModalPage', () => {
  let component: LocationsModalPage;
  let fixture: ComponentFixture<LocationsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
