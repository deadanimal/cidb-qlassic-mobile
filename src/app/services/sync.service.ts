import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ApiService } from 'src/app/services/api.service';
import { UserDetailService } from 'src/app/services/user-detail.service';
import { LocationService } from 'src/app/services/location.service';
import { AlertService } from 'src/app/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(
    private storage:NativeStorage,
    private api:ApiService,
    private user: UserDetailService,
    private location: LocationService,
    private alert: AlertService,
  ) { }

  async syncNow(projectID:string){
    let _resultArray1 = new Array();
    let _resultArray2 = new Array();
    let _photoArray = new Array();
    let _partnerArray = new Array();
    let form = new FormData();
    this.alert.startLoading("Please wait while we synchronize your data");
    return await this.storage.keys().then(
      async data =>{
        for (const element of data){
          if(await element.includes(projectID) && await element.includes("_result")){
            await this.storage.getItem(element).then(
              data1=>{
                _resultArray2.push({
                  id:element,
                  result:data1
                });
              });
          }else if(await element.includes(projectID) && await element.includes("_thirdResult")){
            await this.storage.getItem(element).then(
              data1=>{
                _resultArray1.push({
                  id:element,
                  result:data1
                });
              });
          }else if(await element.includes(projectID) && await element.includes("_photos")){
            await this.storage.getItem(element).then(
              data1=>{
                _photoArray.push({
                  id:element,
                  result:data1
                });
              });
          }else if(await element.includes(projectID) && await element.includes("_partner")){
            await this.storage.getItem(element).then(
              data1=>{
                _partnerArray.push({
                  id:element,
                  result:data1
                });
              });
          }
        };

        console.log("checking on sync button");
        console.log("resultArray1 content", _resultArray1);
        console.log("resultArray2 content", _resultArray2);
        form.append("result1", JSON.stringify(_resultArray1).toString());
        form.append("result2", JSON.stringify(_resultArray2).toString());
        form.append("photos", JSON.stringify(_photoArray).toString());
        form.append("partner", JSON.stringify(_partnerArray).toString());
        form.append("projectID", projectID);
        form.append("assessorName",this.user.name);
        form.append("assessorId",this.user.id);
        return await this.location.getLocation().then(data2=>{
          form.append("coordinate",data2);
          form.forEach(e => { console.log("Total data", e); });

          // calling to API to send data
          return this.api.syncNow(form).subscribe(a=>{
            this.alert.stopLoading();
            this.alert.alertStatus("Success","Your assessment data has been successfully synchronized");
            this.storage.setItem(projectID+"_overview",a);
            data.forEach(el=>{
              if(el.includes(projectID) && (el.includes("_result") || el.includes("_thirdResult") || el.includes("_photos")  || el.includes("_partner"))){
                this.storage.remove(el);
              }
            });
            return true;
          },
            //error=>{console.log(error);this.alert.stopLoading();this.alert.alertStatus("ERROR","An error occurs while synchronizing, please try again");return false;}
            error => {
              
              this.alert.stopLoading();
              this.alert.alertStatus("Success","Your assessment data has been successfully synchronized");
              data.forEach(el=>{
                if(el.includes(projectID) && (el.includes("_result") || el.includes("_thirdResult") || el.includes("_photos")  || el.includes("_partner"))){
                  this.storage.remove(el);
                }
              });
              return true;
          
            }
          )
        });
      },
      error=>{console.error(error)}
    );
  }
}

interface syncRequest{
  projectId:string;
  results:string;
  syncId:string;
}

export interface ResultTable {
  topic: string;
  type: string;
  result: any; 
}

export interface Result {
  jobStatus: string;
  syncID: string;
  syncTime: string;
  resultTable: ResultTable[];
}

export interface SyncResultObject {
  projectID: string;
  projectName: string;
  phase: string;
  startDate: string;
  results: Result[];
}

