import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertAttendancePage } from './insert-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: InsertAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertAttendancePageRoutingModule {}
