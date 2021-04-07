import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/tab/dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tab/tab.module').then( m => m.TabPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'insert-attendance',
    loadChildren: () => import('./modal/insert-attendance/insert-attendance.module').then( m => m.InsertAttendancePageModule)
  },
  {
    path: 'task-first-design',
    loadChildren: () => import('./modal/task-first-design/task-first-design.module').then( m => m.TaskFirstDesignPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./modal/overview/overview.module').then( m => m.OverviewPageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./modal/signature/signature.module').then( m => m.SignaturePageModule)
  },  {
    path: 'camera',
    loadChildren: () => import('./modal/camera/camera.module').then( m => m.CameraPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
