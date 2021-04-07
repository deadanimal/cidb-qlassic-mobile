import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InsertAttendancePage } from './insert-attendance.page';

describe('InsertAttendancePage', () => {
  let component: InsertAttendancePage;
  let fixture: ComponentFixture<InsertAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertAttendancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InsertAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
