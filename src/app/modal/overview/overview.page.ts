import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  projectId: string;
  projectCode: string;
  information: any;
  header: any;
  body:any;
  overviewData: any;
  totalSubtopic: number;
  projectId2: string;
  projectName: string;
  phase: string;
  startDate: string;

  constructor(
    public modalCtrl: ModalController,
    private storage: NativeStorage,
    ) { }

  ngOnInit() {
  }

  
  ionViewWillEnter() {
    this.initializeData();
  }

  async initializeData(){
    
    await this.storage.getItem('projectId').then(
      data =>{
        this.projectId = data;
      },
      error => console.error(error)
    );

    await this.storage.getItem(this.projectId+'_overview').then(
      data =>{
        this.overviewData = data;
      },
      error => console.error(error)
    );

    this.information = this.overviewData.information;
    this.projectId2 = this.information.projectID; 
    this.projectCode = this.information.projectCode; 
    this.projectName = this.information.projectName;
    this.phase = this.information.phase;
    this.startDate = this.information.startDate;
    
    this.header = this.overviewData.header;

    this.body = this.overviewData.body;
  }

  dismissModal() {  
    this.modalCtrl.dismiss();  
  }
  
}
