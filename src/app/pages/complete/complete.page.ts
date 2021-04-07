import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { ConfirmationPage } from 'src/app/modal/confirmation/confirmation.page';
import { ApiService,Project } from 'src/app/services/api.service';
import { LocationService } from 'src/app/services/location.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.page.html',
  styleUrls: ['./complete.page.scss'],
})
export class CompletePage implements OnInit {

  applicantNumber:string;
  projectLocation:string;
  projectId:string;
  assessmentDate:string;
  leadAssessor:string;
  numberOfSample:number;
  attendance:any;

  constructor(
    public modalCtrl: ModalController,
    private storage:NativeStorage,
    private api:ApiService,
    private alert:AlertService,
    private location:LocationService
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.getItem("projectId").then(
      data=>{
        this.storage.getItem(data+"_project_information_detail").then(
          item=>{
            let _data:Project = item;
            this.projectLocation = _data.location;
            this.assessmentDate = _data.date;
            this.leadAssessor = _data.leadName;
            this.projectId = _data.id;
            this.numberOfSample = +_data.sample;
            this.storage.getItem("attendances").then(data2=>{
              this.attendance = data2;
            })
          },
          error=>{console.error(error)}
        );
      },
      err=>{console.error(err)}
    );
    this.api.getApplicationNo(this.projectId).subscribe(data1=>{
      this.applicantNumber = data1.applicationNo;
      console.log(this.applicantNumber);
    });
  }

  async submitForm(name,nric,company,position,contactNumber,email,weather){
    const formData = new FormData();
    await this.alert.startLoading("Please wait while we get your location data");
    await this.location.getLocation().then(async data=>{
      await this.alert.stopLoading();
      formData.append("coordinate",data);formData.append('name', name);
      formData.append('nric', nric);
      formData.append('company', company);
      formData.append('position', position);
      formData.append('contactNumber', contactNumber);
      formData.append('email', email);
      formData.append('weather', weather);
      formData.append('attendance', JSON.stringify(this.attendance));
  
      const modal = await this.modalCtrl.create({  
        component: ConfirmationPage,
        showBackdrop: true,
        cssClass: 'modal-comfirmation',
        componentProps: {
          'formData': formData,
        }
      });
      return await modal.present();
    }).catch((error) => {
      this.alert.stopLoading();
      this.alert.alertStatus("ERROR","Please enable location access in setting");
      console.error('Error getting location', error);
    });
    
  }

}
