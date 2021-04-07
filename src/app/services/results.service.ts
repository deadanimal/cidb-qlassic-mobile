import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})

export class ResultsService {

  constructor(
    private nativeStorage: NativeStorage
  ) { }

  async save(projectId:string, testId:string, index:number, result:any){
    index = index -1;
    return this.nativeStorage.getItem(projectId+'_'+testId+'_result')
    .then(
      data => {
          data[index] = result;
          return this.nativeStorage.setItem(projectId+'_'+testId+'_result',data)
          .then(
              () => {
                return true
              },
              error => {
                return false
              }
            );
      },
      error =>{
        return this.nativeStorage.setItem(projectId+'_'+testId+'_result',[result,])
          .then(
              () => {
                return true
              },
              error => {
                return false
              }
            );
      }
    );
  }

  async remove(){
    this.nativeStorage.clear()
  }

  async get(projectId:string, testId:string, index:number, variables:string[], sample:number){
    index = index-1;
    return this.nativeStorage.getItem(projectId+'_'+testId+'_result')
    .then(
      data => {
        if (data[index] != undefined){
          let _tempArray =[]
          let i = 0
          for(i=0;i<data.length;i++){
            _tempArray.push(i+1)
          }
          _tempArray.push(i+1)
          data[index].sampleRun = _tempArray
          return data[index];
        }else{
          let _tempObject = []
          let _tempArray =[]
          let i = 0
          for(i=0;i<data.length;i++){
            _tempArray.push(i+1)
          }
          _tempArray.push(i+1)
          let _sample = new Array<string>(sample)
          _sample.fill("None")
          variables.forEach(element => {
            _tempObject.push({
              name:element,
              result:Object.assign([], _sample)
            })
         });
          return {
            sampleRun:_tempArray,
            remark:'',
            pic:'',
            variable:_tempObject
          }
        }
      },
      error => {
        let _tempObject = []
        let _sample = new Array<string>(sample)
        _sample.fill("None")
        variables.forEach(element => {
          _tempObject.push({
            name:element,
            result:Object.assign([], _sample)
          })
        });
        return {
            sampleRun:[1],
            remark:'',
            pic:'',
            variable:_tempObject
          }
      }
    );
  }

  async saveImages(projectId:string,imageKey:string,images:string[]){
    let _proceed = false;
    for(let i=0;i<images.length;i++){
      if(images[i]!="assets/add.png"){
        _proceed = true;
        break;
      }
    }
    if(_proceed == true){
      
      return this.nativeStorage.setItem(imageKey,images)
      .then(
          () => {
            return this.recordImage(projectId, imageKey).then(
              data =>{
                if (data == true){
                  return true
                }else{
                  console.error(1)
                  return true
                }
              },
              error => {
                console.error(error)
                return false
              }
            )
          },
          error => {
            console.error(error)
            return false
          }
      );
    }else{
      return true
    }
  }

  async getImages(imageKey:string){
    return this.nativeStorage.getItem(imageKey)
    .then(
      data => {
        return data
      }
    )
  }

  private async recordImage(projectId:string, imageKey:string){
    return this.nativeStorage.getItem(projectId+'_images')
    .then(
      data => {
        let _index = data.findIndex((element) => element == imageKey)
        if(_index <= -1){
          data.push(imageKey)
          return this.nativeStorage.setItem(projectId+'_images',data)
          .then(
            data=>{return true},
            error=>{return false}
          )
        }
      },
      error =>{ 
        return this.nativeStorage.setItem(projectId+'_images',[imageKey,])
        .then(
          data=>{return true},
          error=>{return false}
        )
      }
    )
  }

  generateThirdResultObject(thirdObject:ThirdObject){
    let _topicArray:Topic[] = new Array();
    thirdObject.subtopics.forEach(el=>{
      let _subtopicArray:Subtopic[] = new Array();
      el.checkbox.forEach(checkbox => {
        let _tempResultArray = new Array(el.sample);
        _tempResultArray.fill("None");
        _subtopicArray.push({
          subtopic:checkbox,
          result:Object.assign([], _tempResultArray)
        });
      });
      _topicArray.push({
        topic:el.subtopic,
        subtopics:Object.assign([], _subtopicArray)
      });
    });
    return({
      block: "",
      unit: "",
      period: "",
      testType: 'P',
      selectionValue: 'Options2',
      sampleid: 1,
      topics: Object.assign([], _topicArray)
    });
  }

  async getThirdResult(projectId:string, testId:string, index:number, thirdObject:ThirdObject){
    index = index-1;
    return this.nativeStorage.getItem(projectId+'_'+testId+'_thirdResult')
    .then(
      data => {
        if (data[index] != undefined){
          return data[index];
        }else{
          return this.generateThirdResultObject(thirdObject);
        }
      },
      error=>{
        return this.generateThirdResultObject(thirdObject);
      }
    );
  }

  async saveThird(projectId:string, testId:string, index:number, result:any){
    index = index -1;
    return this.nativeStorage.getItem(projectId+'_'+testId+'_thirdResult')
    .then(
      data => {
          data[index] = result;
          return this.nativeStorage.setItem(projectId+'_'+testId+'_thirdResult',data)
          .then(
              () => {
                return true
              },
              error => {
                return false
              }
            );
      },
      error =>{
        return this.nativeStorage.setItem(projectId+'_'+testId+'_thirdResult',[result,])
          .then(
              () => {
                return true
              },
              error => {
                return false
              }
            );
      }
    );
  }

  async getPSC(projectId:string, testId:string){
    let _p = 0;
    let _s = 0;
    let _c = 0;
    return this.nativeStorage.getItem(projectId+'_'+testId+'_thirdResult')
    .then(
      data => {
        data.forEach(element => {
          if(element.testType == 'P'){
            _p=_p+1;
          }else if(element.testType == 'S'){
            _s=_s+1;
          }else if(element.testType == 'C'){
            _c=_c+1;
          }
        });
        return({
          p:_p,
          s:_s,
          c:_c
        });
      },err=>{
        return({
          p:0,
          s:0,
          c:0
        });
      }
      );
  }

  async getsampleDoneCount(projectId:string){
    let _tempObject = {}
    return await this.nativeStorage.keys().then(
      async data=>{
        await data.forEach(async element => {
          if(element.includes("_result") && element.includes(projectId)){
            let _testNo:string = element;
            _testNo = _testNo.replace(projectId+"_",'');
            _testNo = _testNo.replace("_result",'');
            await this.nativeStorage.getItem(element).then(data1=>{
              _tempObject[_testNo]=data1.length;
            });
          }
        });
        return _tempObject
      }
    );
  }

}

export interface Subtopic {
  subtopic: string;
  result: string[];
}

export interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

export interface ThirdResultObject {
  block: string;
  unit: string;
  period: string;
  sampleid: number;
  testType: string;
  selectionValue: string;
  topics: Topic[];
  photo: string;
}

export interface Subtopic1 {
  subtopic: string;
  id: number;
  checkbox: string[];
  sample: number;
}

export interface ThirdObject {
  topic: string;
  type: number;
  subtopics: Subtopic1[];
}
