import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ResultsService } from 'src/app/services/results.service';
import { CameraService } from '../../services/camera.service';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-task-second-design',
  templateUrl: './task-second-design.page.html',
  styleUrls: ['./task-second-design.page.scss'],
})
export class TaskSecondDesignPage implements OnInit {

  projectId: string;
  taskId: any;
  tasks: any;
  topics: string;
  topicsTotal: number;
  samplePerSample: any;
  checkbox:any;
  samplePerTask: any;
  resultRemark: any;
  resultTable: any;
  resultArrays: any;
  sampleRan: any;
  checkTrue: number;
  checkYes: number;
  chooseSample: number;
  totalBoxTrue: boolean;
  totalCheckedBox: number;
  sampleRanTotal: number;
  photos:string[] = ["assets/add.png","assets/add.png","assets/add.png","assets/add.png"];
  photoKey:string;
  totalSample: any = {};

  constructor(
    private storage: NativeStorage,
    private resultsService: ResultsService,
    private camera: CameraService,
    public alertService: AlertService
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.initializeData();
  }  

  initializeSample() {
  }
  
  selectTask(id,topic,subtopic){
    this.taskId = id;
    this.taskId = this.tasks.items[topic].subtopics[subtopic].id;
    this.checkbox = this.tasks.items[topic].subtopics[subtopic].checkbox;
    this.samplePerTask = this.tasks.items[topic].subtopics[subtopic].sample;
    //this.getDataSample(1);

    // get infra len
    let templen = this.totalSample[id];
    this.chooseSample = templen + 1;
    this.getDataSample(this.chooseSample);
  }

  async recalculateSamples(topics){
    
    await this.resultsService.getsampleDoneCount(this.projectId).then(
      async data=>{
        this.totalSample = data;
        await this.tasks.items.forEach(async element => {
          await element.subtopics.forEach(e => {
            if(this.totalSample[e.id] == undefined || this.totalSample[e.id] == null){
              this.totalSample[e.id] = 0;
            }
          });
        });
      }
    );
  }

  async initializeData(){
    await this.storage.getItem('projectId').then(
      data =>{
        this.projectId = data;
      },
      error => console.error('error projectId', error)
    );
    await this.storage.getItem('temporary').then(
      async data =>{
        this.tasks = data;
        this.storage.remove('temporary');
        this.topics = this.tasks.items;
        this.topicsTotal = this.topics.length;

        //this.taskId = this.tasks.items[0].subtopics[0].id;
        this.checkbox = this.tasks.items[0].subtopics[0].checkbox;
        this.samplePerTask = this.tasks.items[0].subtopics[0].sample;
        this.photoKey = this.projectId + '_' + this.taskId + '_' + this.chooseSample + '_photos';
        await this.tasks.items.forEach(async element => {
          await element.subtopics.forEach(e => {
            this.totalSample[e.id] = 0;
          });
        });
        this.getDataSample(this.chooseSample);

      },
      error => console.error('error temporary', error)
    );
  }

  async getDataSample(sample){
    await this.recalculateSamples(this.topics);
    this.photoKey = this.projectId + '_' + this.taskId + '_' + sample + '_photos';
    await this.resultsService.get(this.projectId, this.taskId, sample, this.checkbox, this.samplePerTask)
      .then(
        data =>{
          this.resultArrays = data;
          if(this.resultArrays.pic == ''){
            this.photoKey = this.projectId + '_' + this.taskId + '_' + sample + '_photos';
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
    console.log("sample", sample);
  }

  nextSample(){
    // if(this.chooseSample<this.sampleRanTotal){
    //   this.chooseSample++;
    //   this.getDataSample(this.chooseSample);
    // }
    this.chooseSample++;
    this.getDataSample(this.chooseSample);
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

    await this.resultsService.save(this.projectId,  this.taskId, this.chooseSample, this.resultArrays)
      .then(
        data =>{
          if(data==true){
            this.resultsService.saveImages(this.projectId,this.photoKey,this.photos)
            .then(
              async data =>{
                if(data==true){
                  await this.getDataSample(this.chooseSample);
                  this.alertService.alertStatus('Success', 'Data saved locally.');
                  this.nextSample();
                }
              },
              error => {
                console.error(error);
                this.alertService.alertStatus('Error', 'Error while saving');
              }
            )
          }
        },
        error => {
          console.error(error);
          this.alertService.alertStatus('Error', 'Error while saving');
        }
    )

  }



}
