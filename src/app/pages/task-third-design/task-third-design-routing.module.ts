import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskThirdDesignPage } from './task-third-design.page';

const routes: Routes = [
  {
    path: '',
    component: TaskThirdDesignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskThirdDesignPageRoutingModule {}
