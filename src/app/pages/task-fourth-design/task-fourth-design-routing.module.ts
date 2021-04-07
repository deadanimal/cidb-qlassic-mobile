import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskFourthDesignPage } from './task-fourth-design.page';

const routes: Routes = [
  {
    path: '',
    component: TaskFourthDesignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskFourthDesignPageRoutingModule {}
