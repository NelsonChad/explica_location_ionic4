import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExplainerPage } from './explainer.page';

describe('ExplainerPage', () => {
  let component: ExplainerPage;
  let fixture: ComponentFixture<ExplainerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplainerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplainerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
