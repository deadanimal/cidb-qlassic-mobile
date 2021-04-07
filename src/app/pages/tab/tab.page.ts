import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.authService.getToken();
    this.authService.user().subscribe(
      user => {
        this.user = user[0].first_name;
      }
    );
  }

  logoutCallback(ok,instance){
    if(ok == true){
      instance.authService.logout().subscribe(
        data => {
          instance.alertService.presentToast("Logged Out");        
        },
        error => {
          console.log(error);
        },
        () => {
          instance.navCtrl.navigateRoot('login');
        }
      );
    }
  }

  async logout() {
    await this.alertService.promptUser("Logging Out", "Are you sure to logout?",this.logoutCallback,this);
  }

}
