import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaskFourthDesignPage } from './task-fourth-design.page';

describe('TaskFourthDesignPage', () => {
  let component: TaskFourthDesignPage;
  let fixture: ComponentFixture<TaskFourthDesignPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskFourthDesignPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFourthDesignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
