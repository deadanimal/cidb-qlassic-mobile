import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  // internal finishes
  externalTotal: number;
  externalWork: number;
  externalDone: number;

  pDone: number;
  sDone: number;
  cDone: number;

  pTotal: number;
  sTotal: number;
  cTotal: number;
  totalSampling: number;

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
    this.initializeData2();
  }

  async initializeData2() {
    await this.storage.getItem('tasks').then(
      async data =>{
        console.log(data);
        this.pTotal = data[0].items[0].ptotal;
        this.sTotal = data[0].items[0].stotal;
        this.cTotal = data[0].items[0].ctotal;

        this.externalTotal = 0;
        data[0].items[1].items[0].subtopics.forEach(e => {
          this.externalTotal = this.externalTotal + e.sample;
        });
        
      },
      error => console.error(error)
    );
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
    console.log("header", this.header);

    this.body = this.overviewData.body;
    console.log("body", this.body)
    this.computeData(this.body)

    

  }

  computeData(body) {
    this.pDone = 0;
    this.sDone = 0;
    this.cDone = 0;
    this.externalDone = 0;
    this.externalWork = 0;
    body.forEach(e=> {
      this.pDone = this.pDone + e.resultTable[0];
      this.sDone = this.sDone + e.resultTable[1];
      this.cDone = this.cDone + e.resultTable[2];
      this.externalDone = this.externalDone + e.resultTable[3] + e.resultTable[4] + e.resultTable[5] + e.resultTable[6];
      this.externalWork = this.externalWork + e.resultTable[7] //+ e.resultTable[4] + e.resultTable[5] + e.resultTable[6];
    });
  }

  dismissModal() {  
    this.modalCtrl.dismiss();  
  }
  
}
