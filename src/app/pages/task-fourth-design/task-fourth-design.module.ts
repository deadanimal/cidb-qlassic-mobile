import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskFourthDesignPageRoutingModule } from './task-fourth-design-routing.module';

import { TaskFourthDesignPage } from './task-fourth-design.page';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskFourthDesignPageRoutingModule,
    FontAwesomeModule,
  ],
  declarations: [TaskFourthDesignPage]
})
export class TaskFourthDesignPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
