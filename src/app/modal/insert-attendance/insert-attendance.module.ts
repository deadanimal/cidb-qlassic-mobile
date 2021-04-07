import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertAttendancePageRoutingModule } from './insert-attendance-routing.module';

import { InsertAttendancePage } from './insert-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertAttendancePageRoutingModule
  ],
  declarations: [InsertAttendancePage]
})
export class InsertAttendancePageModule {}
