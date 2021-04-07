import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { InsertAttendancePage } from 'src/app/modal/insert-attendance/insert-attendance.page';
import { AlertService } from 'src/app/services/alert.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  attendances: any;
  projectId: string;
  projectCode: string;
  today: any;
  applicationNumber: string;

  constructor(
    private storage: NativeStorage,
    public modalCtrl: ModalController,
    private attendanceService: AttendanceService,
    private alertService: AlertService,
    public datepipe: DatePipe
    ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.initializeData();
    this.today =this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  }

  async initializeData(){
    await this.storage.getItem('projectId').then(
      data=>{
        this.projectId = data;
      }
    );
    await this.attendanceService.get(this.projectId)
      .then(
        data =>{
          if( data == undefined ||data===null){
            this.attendances = [{
              "name": "",
              "position": "",
              "company": "",
              "signature": "",
            }]
          }else{
            this.attendances = data.att;
          }
          this.storage.setItem('attendances', this.attendances);
        },
        error => {
          console.error('error',error)
        }
      )
      await this.storage.getItem(this.projectId+"_appNumber").then(
        data=>{
          this.applicationNumber = data;
        }
      );

  }

  async editAttendance(id){
    
    const modal = await this.modalCtrl.create({  
      component: InsertAttendancePage,
      showBackdrop: true,
      cssClass: 'modal-attendance',
      componentProps: {
        'id': id
      }  
    });
    modal.onDidDismiss().then(data => {
      this.storage.getItem('attendances').then(
        data =>{
          this.attendances = data;
        },
        error => console.error(error)
      );
    });
    return await modal.present();  
  }

  async saveAttendance(dateAttendance, applicationNo){
    await this.attendanceService.save(this.projectId, dateAttendance, applicationNo,this.attendances)
      .then(
        data =>{
          this.storage.remove('attendances');
          if(data == true){
            this.alertService.alertStatus("Successfull","Attendance saved locally");
          }else{
            this.alertService.alertStatus("Failed","Error while saving");
          }
        },
        error => {
          console.error(error)
          this.alertService.alertStatus("Failed","Error while saving");
        }
      )
  }

}
