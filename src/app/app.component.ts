import { Component } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { AlertService } from 'src/app/services/alert.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public counter=0;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidFullScreen: AndroidFullScreen,
    private alertService: AlertService,
    private screenOrientation: ScreenOrientation,
    private router:  Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
    
    this.androidFullScreen.isImmersiveModeSupported()
      .then(() => console.log('Immersive mode supported'))
        .catch(err => console.log(err));
    this.statusBar.hide();
    this.platform.backButton.subscribeWithPriority(10, () => {
        if(this.router.url.includes("/login")){
            if (this.counter == 0) {
                this.counter++;
                this.alertService.presentToast("Press again to exit");
                setTimeout(() => { this.counter = 0 }, 2000)
            } else {
                navigator['app'].exitApp();
            }
        }else if(this.router.url.includes("/tab/dashboard")){
            if (this.counter == 0) {
              this.counter++;
              this.alertService.presentToast("Press again to exit");
              setTimeout(() => { this.counter = 0 }, 2000)
            } else {
              navigator['app'].exitApp();
            }
        }else if(this.router.url.includes("/tab/")){
            this.router.navigateByUrl('');
        }
    });
    this.router.events.subscribe(
        (val) =>{
            if(val instanceof NavigationEnd){
                if(["/app/tab/task-third-design","/app/tab/task-fourth-design","/app/tab/task-second-design","/app/overview"].includes(val.urlAfterRedirects)){
                    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
                }else{
                    this.screenOrientation.unlock()
                }
            }
        },
        error=>{console.log(error)}
    )
  }
}
