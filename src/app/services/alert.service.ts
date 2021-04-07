import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private loading:HTMLIonLoadingElement;
  constructor(
    private toastController: ToastController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    ) { }

    async presentToast(message: any) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        position: 'top',
        color: 'dark'
      });
      toast.present();
    }
  
  async alertStatus(status, message){
    const alert = await this.alertController.create({
      cssClass: 'my-alert-class',
      header: status + '!',
      message: message,
      buttons: [{
          text: 'Ok',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }
  
  async confirmToComplete(status, message,funct){
    const alert = await this.alertController.create({
      cssClass: 'my-alert-class',
      header: status + '!',
      message: message,
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler:()=>{
            funct(false)
          }
        },{
          text: 'Submit',
          role: 'confirm',
          handler:()=>{
            funct(true)
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }
  
  async startLoading(msg:string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: msg
    });
    await this.loading.present();
  }

  async stopLoading(){
    await this.loading.dismiss()
  }

  async promptUser(status, message,cb,instance){
    const alert = await this.alertController.create({
      cssClass: 'my-alert-class',
      header: status + '!',
      message: message,
      buttons: [{
          text: 'Ok',
          handler:()=>{
            cb(true,instance)
          }
        },
        {
          text: 'cancel',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

}
