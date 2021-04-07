import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskSecondDesignPageRoutingModule } from './task-second-design-routing.module';

import { TaskSecondDesignPage } from './task-second-design.page';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskSecondDesignPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [TaskSecondDesignPage]
})
export class TaskSecondDesignPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
