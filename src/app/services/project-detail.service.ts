import { Injectable } from '@angular/core';
import {Project,ProjectDetailObject,ApiService} from 'src/app/services/api.service'
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailService {

  public projectList:Project[];
  public projectDetailList:Object[];
  constructor(
    private api:ApiService,
    private nativeStorage:NativeStorage
  ) { }

  initProjectDetail(){
    console.log('project list', this.projectList)
    this.projectList.forEach(async element => {
      let formData = new FormData();
      formData.append("projectID",element.id)
      await this.api.getProjectData(formData).subscribe(
        data=>{
          this.nativeStorage.setItem(element.id+"_project_detail",data);
        },
        error=>{}
      )
      await this.api.getOverview(element.id).subscribe(
        data=>{
          this.nativeStorage.setItem(element.id+"_overview",data);
        },
        error=>{console.log(error);}
      )
      this.api.getApplicationNo(element.id).subscribe(data=>{
        this.nativeStorage.setItem(element.id+"_appNumber",data.applicationNo);
        console.log(data.applicationNo);
      },
        error=>{console.log(error);
      });
    });
  }
}
