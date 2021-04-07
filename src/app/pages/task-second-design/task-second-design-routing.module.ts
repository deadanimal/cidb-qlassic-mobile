import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskSecondDesignPage } from './task-second-design.page';

const routes: Routes = [
  {
    path: '',
    component: TaskSecondDesignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskSecondDesignPageRoutingModule {}
