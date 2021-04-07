import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  @Input() photo: string;

  tempPhoto: string;

  constructor(
    private camera: CameraService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tempPhoto = this.photo;
  }

  dismissModal() {  
    const photo = this.tempPhoto;
    this.modalCtrl.dismiss(photo); 
  }

  async takePic(){
    await this.camera.takePicture()
    .then(
      data=>{
        this.photo = data;
      },
      error=>{}
    );
  }

  addPhotos() {  
    const photo = this.photo;
    this.modalCtrl.dismiss(photo);  
  }

}
