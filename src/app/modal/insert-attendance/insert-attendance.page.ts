import { Component, Input, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { SignaturePage } from '../signature/signature.page';
import { AlertService } from 'src/app/services/alert.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-insert-attendance',
  templateUrl: './insert-attendance.page.html',
  styleUrls: ['./insert-attendance.page.scss'],
})
export class InsertAttendancePage implements OnInit {
  projectId: string;
  applicationNumber: string;
  today: any;

  @Input() id: string;
  attendanceNameValue: string;
  attendancePositionValue: string;
  attendanceCompanyValue: string;
  attendanceContactValue: string;
  attendanceSignatureValue: any;
  i: number;

  constructor(
    public modalCtrl: ModalController,
    private storage: NativeStorage,
    public attendanceService: AttendanceService, 
    public alertService: AlertService,
    public datepipe: DatePipe
    ) { }

  async ngOnInit() {
    await this.initializeData();

    await this.storage.getItem('projectId').then(
      data=>{
        this.projectId = data;
      }
    );

    await this.storage.getItem(this.projectId+"_appNumber").then(
      data=>{
        this.applicationNumber = data;
      }
    );


  }
  
  initializeData(){

    this.storage.getItem('attendances').then(
      data =>{
        this.attendanceNameValue = data[this.id].name;
        this.attendancePositionValue = data[this.id].position;
        this.attendanceCompanyValue = data[this.id].company;
        this.attendanceContactValue = data[this.id].contact;
        this.attendanceSignatureValue = data[this.id].signature;
      },
      error => console.error(error)
    );

  }

  dismissModal() {  
    this.modalCtrl.dismiss();  
  } 

  deleteAttendance(){

    this.storage.getItem('attendances').then(
      data =>{
        if(data[this.id].name != ''){
          data.splice(this.id,1);
          this.storage.setItem('attendances', data);
        }
        this.modalCtrl.dismiss();  
      },
      error => console.error(error)
    );

  }

  async saveAttendance(attendanceName,attendancePosition,attendanceCompany,attendanceContact){
    
    await this.storage.getItem('attendances').then(
      data =>{
        data[this.id].name = attendanceName;
        data[this.id].position = attendancePosition;
        data[this.id].company = attendanceCompany;
        data[this.id].contact = attendanceContact;
        data[this.id].signature = this.attendanceSignatureValue;
        let i = 0;
        let noAdd = 0;
        while(i < data.length){
          if(data[i].name == ''){
            noAdd = 1;
          }
          i++;
        }

        if(noAdd != 1){
          let add = {
            "name": '',
            "position": '',
            "company": '',
            "contact": '',
            "signature": '',
          };
          data.push(add);
        }

        this.today =this.datepipe.transform(new Date(), 'yyyy-MM-dd');

        this.storage.setItem('attendances', data);
        console.log("data", data, "PID", this.projectId, "today", this.today, "appNo", this.applicationNumber);

        this.attendanceService.save(this.projectId, this.today, this.applicationNumber, data)
            .then(
              data =>{
                console.log("goes here");
              },
              error => {
                console.error(error)
                console.log("sampai sini");
              }
            )


          

      },
      error => console.error(error)
    );
    await this.modalCtrl.dismiss();  
  }

  //saveAttendance(attendanceName,attendancePosition,attendanceCompany,attendanceContact){

  //}

  async signature(){
    const modal = await this.modalCtrl.create({  
      component: SignaturePage,
      showBackdrop: true,
      cssClass: 'modal-signature',
      componentProps: {
      }
    });
    
    modal.onDidDismiss()
      .then((data) => {
        this.attendanceSignatureValue = data['data'];
    });
    return await modal.present();  
  }

}
