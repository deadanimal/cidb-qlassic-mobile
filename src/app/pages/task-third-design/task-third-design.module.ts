import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskThirdDesignPageRoutingModule } from './task-third-design-routing.module';

import { TaskThirdDesignPage } from './task-third-design.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskThirdDesignPageRoutingModule
  ],
  declarations: [TaskThirdDesignPage]
})
export class TaskThirdDesignPageModule {}
