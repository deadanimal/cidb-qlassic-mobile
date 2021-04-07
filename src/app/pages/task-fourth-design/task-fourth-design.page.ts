import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ResultsService } from 'src/app/services/results.service';
import { CameraService } from '../../services/camera.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-task-fourth-design',
  templateUrl: './task-fourth-design.page.html',
  styleUrls: ['./task-fourth-design.page.scss'],
})
export class TaskFourthDesignPage implements OnInit {

  projectId: string;
  tasks: any;
  topic: string;
  samplePerSample: any;
  resultRemark: any;
  resultTable: any;
  resultArrays: any;
  sampleRan: any;
  checkTrue: number;
  checkYes: number;
  chooseSample: number;
  sampleRanTotal: number;
  totalBoxTrue: boolean;
  totalCheckedBox: number;
  photos:string[] = ["assets/add.png","assets/add.png","assets/add.png","assets/add.png"];
  photoKey:string;

  constructor(
    private storage: NativeStorage,
    private resultsService: ResultsService,
    private camera: CameraService,
    public alertService: AlertService
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.chooseSample = 1;
    this.initializeData();
  }

  async initializeData(){
    await this.storage.getItem('projectId').then(
      data =>{
        this.projectId = data;
      },
      error => console.error(error)
    );
    await this.storage.getItem('temporary').then(
      data =>{
        this.tasks = data;
        this.storage.remove('temporary');
        this.topic = this.tasks.topic;
        this.getDataSample(this.chooseSample);
      },
      error => console.error(error)
    );
  }

  async getDataSample(sample){
    this.photoKey = this.projectId + '_' + this.tasks.id + '_' + sample + '_photos';
    await this.resultsService.get(this.projectId, this.tasks.id, sample, this.tasks.checkbox, this.tasks.sample)
      .then(
        data =>{
          this.resultArrays = data;
          if(this.resultArrays.pic == ''){
            this.photoKey = this.projectId + '_' + this.tasks.id + '_' + sample + '_photos';
            this.resultArrays.pic = this.photoKey;
            this.photos = ["assets/add.png","assets/add.png","assets/add.png","assets/add.png"];
          }else{
            this.photoKey = this.resultArrays.pic;
            this.resultsService.getImages(this.photoKey)
              .then(
                data =>{
                  if(data ==  undefined || data === null){
                    this.photos = ["assets/add.png","assets/add.png","assets/add.png","assets/add.png"];
                  }else{
                    this.photos = data;
                  }
                },
                error => {
                  this.photos = ["assets/add.png","assets/add.png","assets/add.png","assets/add.png"];
                  console.error(error)
                }
              )
          }

        },
        error => {
          console.error(error)
        }
    )
    this.initializeResult(this.resultArrays);
    
  }

  initializeResult(resultArrays){
    this.samplePerSample = resultArrays.variable[0].result;
    this.resultTable = resultArrays.variable;
    this.resultRemark = resultArrays.remark;
    this.sampleRan = resultArrays.sampleRun;
    this.sampleRanTotal = this.sampleRan.length;
    
    if(this.sampleRanTotal <= 3){
      this.sampleRan = resultArrays.sampleRun;
    }else if(this.sampleRanTotal > 3 && this.chooseSample == 1){
      this.sampleRan = [this.chooseSample,this.chooseSample+1,this.chooseSample+2];
    }else if(this.sampleRanTotal > 3 && this.chooseSample == this.sampleRanTotal){
      this.sampleRan = [this.chooseSample-2,this.chooseSample-1,this.chooseSample];
    }else if(this.sampleRanTotal > 3 && this.chooseSample < this.sampleRanTotal){
      this.sampleRan = [this.chooseSample-1,this.chooseSample,this.chooseSample+1];
    }

    let variableTotal = resultArrays.variable.length;
    let sampleTotal = this.samplePerSample.length;
    let totalBox = parseInt(variableTotal) * parseInt(sampleTotal);
    this.totalCheckedBox = 0;
    this.checkYes = 0;
    this.checkTrue = 0;
    for(let i=0; i<variableTotal; i++){
      for(let j=0; j<sampleTotal; j++){
        let value = resultArrays.variable[i].result[j];
        if( value == 'Yes' ||  value == 'No' ||  value == 'NA'){
          this.totalCheckedBox++;
        }
        if( value == 'Yes' ||  value == 'No'){
          this.checkTrue++;
        }
        if( value == 'Yes'){
          this.checkYes++;
        }
      }
    }
    if(totalBox==this.totalCheckedBox){
      this.totalBoxTrue = true;
    }else{
      this.totalBoxTrue = false;
    }
  }

  changeResult(old, variable:number, sample){
    if(old=='Yes'){
      this.resultArrays.variable[variable].result[sample] = 'No';
    }else if(old=='No'){
      this.resultArrays.variable[variable].result[sample] = 'NA';
    }else if(old=='NA'){
      this.resultArrays.variable[variable].result[sample] = 'None';
    }else if(old=='None'){
      this.resultArrays.variable[variable].result[sample] = 'Yes';
    }else{
      this.resultArrays.variable[variable].result[sample] = 'Yes';
    }
    this.initializeResult(this.resultArrays);
  }

  previousSample(){
    if(this.chooseSample>1){
      this.chooseSample--;
      this.getDataSample(this.chooseSample);
    }
  }

  goToSample(sample){
    this.chooseSample = sample;
    this.getDataSample(sample);
  }

  nextSample(){
    if(this.chooseSample<this.sampleRanTotal){
      this.chooseSample++;
      this.getDataSample(this.chooseSample);
    }
  } 
  
  async takePic(id){
    await this.camera.takePicture()
    .then(
      data=>{
        this.photos[id] = data;
      },
      error=>{}
    );
  }

  async saveResult(remarkInput){

    this.resultArrays.remark = remarkInput;

    await this.resultsService.save(this.projectId,  this.tasks.id, this.chooseSample, this.resultArrays)
      .then(
        data =>{
          if(data==true){
            this.resultsService.saveImages(this.projectId,this.photoKey,this.photos)
            .then(
              async data =>{
                if(data==true){
                  await this.getDataSample(this.chooseSample);
                  this.nextSample();
                  this.alertService.alertStatus('Success', 'Data saved locally.');
                }
              },
              error => {
                console.error(error)
                this.alertService.alertStatus('Error', 'Error while saving');
              }
            )
          }
        },
        error => {
          console.error(error)
          this.alertService.alertStatus('Error', 'Error while saving');
        }
    )

  }



}
