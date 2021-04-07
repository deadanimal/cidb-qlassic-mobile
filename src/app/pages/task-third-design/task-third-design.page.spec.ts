import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskThirdDesignPage } from './task-third-design.page';

describe('TaskThirdDesignPage', () => {
  let component: TaskThirdDesignPage;
  let fixture: ComponentFixture<TaskThirdDesignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskThirdDesignPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskThirdDesignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
