import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { CameraPage } from 'src/app/modal/camera/camera.page';
import { ResultsService } from 'src/app/services/results.service'
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-task-third-design',
  templateUrl: './task-third-design.page.html',
  styleUrls: ['./task-third-design.page.scss'],
})
export class TaskThirdDesignPage implements OnInit {

  projectId: string;
  taskId: string;
  taskName: string;
  chooseSample: number = 0;
  tempData: any;
  data: any;
  resultsArray: any;
  totalSampling: number; samplingDone: number;
  pDone: number;
  sDone: number;
  cDone: number;
  pTotal: number;
  sTotal: number;
  cTotal: number;
  now: Date = new Date();

  numberOfTopics: number;
  checkTrue: any;
  checkYes: any;
  totalBox: number;

  blockValue: string;
  tempBlock: string;
  unitValue: string;
  selectionValues: any;
  selectionValue: string;
  periodStart: any;
  period: any;
  periodView: any;
  testType: string;
  totalBoxTrue: boolean;
  compareWith: any;
  photo:string;

  addPhotoButton: string;

  constructor(
    private storage: NativeStorage,
    private result: ResultsService,
    private alertService: AlertService,
    private modalCtrl: ModalController
    ) {
    }

  ngOnInit() {
    this.chooseSample = 1;
  }
  
  ionViewWillEnter() {
    this.chooseSample = 1;
    this.initializeData();
    setInterval(() => {
      this.period = Date.now() - this.periodStart;
      this.periodView = this.timeToString(this.period);
    }, 1); 
  }

  async initializeData(){
    await this.storage.getItem('projectId').then(
      data =>{
        this.projectId = data;
      },
      error => console.error(error)
    );
    
    await this.storage.getItem('temporary').then(
      async data =>{
        this.tempData = data;
        this.taskName = data.topic;
        this.pTotal = data.ptotal;
        this.sTotal = data.stotal;
        this.cTotal = data.ctotal;
        this.totalSampling = this.pTotal + this.sTotal + this.cTotal;

        let a = '';
        data.subtopics.forEach(element => {
          a += '+'+element.id;
        });
        this.taskId = a;
        this.getDataSample(1);
      },
      error => console.error(error)
    );
    
    
  }

  async getDataSample(sample){
    
    await this.result.getThirdResult(this.projectId,this.taskId,sample,this.tempData).then(
     async data=>{
        this.data=data;
        console.log("data", this.data);
    
        this.resultsArray = this.data.topics;
        if(this.data.block != ''){
          this.blockValue = this.data.block;
        }else{
          this.blockValue;
        }
        this.unitValue = this.data.unit;
        this.testType = this.data.testType;
        this.onChangeTestType(this.testType);
        this.selectionValue = this.data.selectionValue;
        this.compareWith = this.compareFn;
        let timePeriod = this.data.period;
        if(this.data.period = ""){
          this.periodStart = Date.now();
        }else{
          this.periodStart = Date.now() - timePeriod;
        }

        if(this.data.photo == undefined || this.data.photo == ""){
          this.photo = "assets/add.png";
          this.addPhotoButton = "";
        }else{
          this.photo = this.data.photo;
          this.addPhotoButton = "A photo captured"
        }

        console.log('this.data.photo', this.data.photo)
        console.log('this.photo', this.photo)
        
        await this.result.getPSC(this.projectId, this.taskId).then(
          data=>{
            this.pDone = data.p;
            this.sDone = data.s;
            this.cDone = data.c;
            console.log("lapar", this.pDone, this.sDone, this.cDone);

            this.samplingDone = this.pDone + this.sDone + this.cDone;
    
          },
          err=>{console.error(err);}
        );

      },
      err=>{console.error(err);}
    );

    this.numberOfTopics = this.resultsArray.length;

    this.checkYes = new Array<number>(this.numberOfTopics);
    this.checkYes.fill(0);
    this.checkTrue = new Array<number>(this.numberOfTopics);
    this.checkTrue.fill(0);

    this.initializeResult();
  }
  
  compareFn(e1, e2): boolean {
    return e1 === e2;
  }

  testTypeChange(type){
    this.testType = type;
    this.onChangeTestType(type);
  }

  onChangeTestType(type){
    if(type == 'P'){
      this.selectionValues = ["Bedroom 1", "Bedroom 2", "Bedroom 3", "Bedroom 4", "Bedroom 5", "Bedroom 6", "Dining", "Discussion Room", "Family Area", "Games Room", "Guest Room", "Hall", "Living", "Maid Room", "Master Room", "Meeting Room", "Study Room", "Treatment Room", "Utility", "Waiting Room", "Ward", "Others"];
    }else if(type == 'S'){
      this.selectionValues = ["Balcony", "Bathroom 1", "Bathroom 2", "Bathroom 3", "Bathroom 4", "Bathroom 5", "Bathroom 6", "Dry Kitchen", "Wet Kitchen", "Linen Room", "Master Bath", "Pantry", "Powder Room", "Toilet", "Yard", "Others"];
    }else if(type == 'C'){
      this.selectionValues = ["Lobby", "Corridor", "Staircase", "Entrance", "Passage Way", "Terrace", "Others"];
    }
  }

  async alertReset(){
    await this.alertService.confirmToComplete("Reset all data", "You want to proceed?",(data)=>this.resetAssessment(data));

  }

  resetAssessment(bool){
    if(bool == true){
      this.blockValue = '';
      this.unitValue = '';
      this.testType = 'P';
      this.onChangeTestType(this.testType);
      this.selectionValue = '';
      this.periodStart = Date.now();
      
      for(let i=0; i<this.resultsArray.length; i++){
        for(let j=0; j<this.resultsArray[i].subtopics.length; j++){
          for(let k=0; k<this.resultsArray[i].subtopics[j].result.length; k++){
            this.resultsArray[i].subtopics[j].result[k] = "None";
          }
        }
      }

      this.addPhotoButton = "";
      this.photo = "assets/add.png";
    }else{

    }
  }

  async saveAssessment(){

    this.data.block = this.blockValue;
    this.data.unit = this.unitValue;
    this.data.period = this.period;
    this.data.testType = this.testType;
    this.data.selectionValue = this.selectionValue;
    this.data.photo = this.photo;
    
    await this.result.saveThird(this.projectId,this.taskId,this.chooseSample,this.data).then(
      async data=>{
        if(data==true){
          await this.getDataSample(this.chooseSample);
          this.alertService.alertStatus('Success', 'Data saved locally.');
          this.changePage('next');
        }
      },
      err=>{console.error(err);}
    );

  }
  
  saveDisabled(){
    this.alertService.alertStatus("Warning!!","Complete all check list before save.");
  }
  
  changePage(type){
    if(type == 'previous' && this.chooseSample > 1){
      this.chooseSample--;
      this.getDataSample(this.chooseSample);
    }else if(type == 'next' && this.chooseSample < this.samplingDone + 1){
      this.chooseSample++;
      this.getDataSample(this.chooseSample);
    }
  }

  initializeResult(){
    
    let totalCheckedBox = 0;
    this.totalBox = 0;
    
    for(let i=0; i<this.resultsArray.length; i++){
      let yesResult = 0;
      let trueResult = 0;
      for(let j=0; j<this.resultsArray[i].subtopics.length; j++){
        for(let k=0; k<this.resultsArray[i].subtopics[j].result.length; k++){
          let result = this.resultsArray[i].subtopics[j].result[k];
          if( result == 'Yes' ||  result == 'No' ||  result == 'NA'){
            totalCheckedBox++;
          }
          if( result == 'Yes' ||  result == 'No'){
            trueResult++;
          }
          if( result == 'Yes'){
            yesResult++;
          }
          this.totalBox++;
        }
      }
      this.checkYes[i] = yesResult;
      this.checkTrue[i] = trueResult;
    }

    if(totalCheckedBox==this.totalBox && this.blockValue !='' && this.unitValue!='' && this.selectionValue!=undefined){
      this.totalBoxTrue = true;
    }else{
      this.totalBoxTrue = false;
    }
  }

  changeResult(variable,topic,subtopic,result){
    if(variable=='Yes'){
      this.resultsArray[topic].subtopics[subtopic]. result[result] = 'No';
    }else if(variable=='No'){
      this.resultsArray[topic].subtopics[subtopic]. result[result] = 'NA';
    }else if(variable=='NA'){
      this.resultsArray[topic].subtopics[subtopic]. result[result] = 'None';
    }else if(variable=='None'){
      this.resultsArray[topic].subtopics[subtopic]. result[result] = 'Yes';
    }else{
      this.resultsArray[topic].subtopics[subtopic]. result[result] = 'Yes';
    }
    this.initializeResult();
  }

  timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
  
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
  
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
  
    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
  
    return `${formattedHH}:${formattedMM}:${formattedSS}`;
  }

  async addPhoto(){
    let temp = this.photo;
    const modal = await this.modalCtrl.create({  
      component: CameraPage,
      showBackdrop: true,
      cssClass: 'modal-signature',
      componentProps: {
        "photo": this.photo
      }
    });
    
    modal.onDidDismiss()
      .then((data) => {
        this.photo = data['data'];
        if(temp != this.photo){
          this.addPhotoButton = "A photo captured" 
        }
    });
    return await modal.present();  
  }

}
