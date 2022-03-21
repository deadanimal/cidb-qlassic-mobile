import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  returnUrl: string;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private s: NativeStorage,
    private router:  Router) { }

  ngOnInit() {
    this.authService.continue().then(data=>{
      if(data == true){
        this.alertService.presentToast("Logged In");
          this.router.navigateByUrl(this.returnUrl);
      }
    })
  }

  // maybe remove from here
  login(form: NgForm) {
    if(form.value.email == "" || form.value.password == ""){
      this.alertService.presentToast("Please enter Email and Password");
      return
    }
    this.alertService.startLoading("Please wait");
    this.authService.login(form.value.email, form.value.password).subscribe(
      (data) => {
        this.alertService.stopLoading();
        if(data.status == "success"){
          this.alertService.presentToast("Logged In");
          this.router.navigateByUrl(this.returnUrl);
          
        }else{
          this.alertService.presentToast("Your password or id is not valid");
        }
      },
      (err) => {
        this.alertService.stopLoading();
        this.alertService.presentToast("Please Check your internet connection");
        console.log('err', err)
      },
      () => {}
    );
  }

}
