import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskFirstDesignPageRoutingModule } from './task-first-design-routing.module';

import { TaskFirstDesignPage } from './task-first-design.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskFirstDesignPageRoutingModule
  ],
  declarations: [TaskFirstDesignPage]
})
export class TaskFirstDesignPageModule {}
