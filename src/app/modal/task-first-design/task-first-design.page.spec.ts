import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskFirstDesignPage } from './task-first-design.page';

describe('TaskFirstDesignPage', () => {
  let component: TaskFirstDesignPage;
  let fixture: ComponentFixture<TaskFirstDesignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskFirstDesignPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFirstDesignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
