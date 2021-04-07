import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guard/auth.guard';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: 'tab',
    component: TabPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule), canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'attendance',
        children: [
          {
            path: '',
            loadChildren: () => import('../attendance/attendance.module').then( m => m.AttendancePageModule), canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'document',
        children: [
          {
            path: '',
            loadChildren: () => import('../document/document.module').then( m => m.DocumentPageModule), canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'task-third-design',
        children: [
          {
            path: '',
            loadChildren: () => import('../task-third-design/task-third-design.module').then( m => m.TaskThirdDesignPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'task-fourth-design',
        children: [
          {
            path: '',
            loadChildren: () => import('../task-fourth-design/task-fourth-design.module').then( m => m.TaskFourthDesignPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'task-second-design',
        children: [
          {
            path: '',
            loadChildren: () => import('../task-second-design/task-second-design.module').then( m => m.TaskSecondDesignPageModule), 
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'complete',
        children: [
          {
            path: '',
            loadChildren: () => import('../complete/complete.module').then( m => m.CompletePageModule), 
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: 'app/tab/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
