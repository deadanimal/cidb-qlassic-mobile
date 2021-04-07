import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { OverviewPage } from 'src/app/modal/overview/overview.page';
import { TaskFirstDesignPage } from 'src/app/modal/task-first-design/task-first-design.page';
import { InformationService } from 'src/app/services/information.service';
import { ProjectDetailService } from 'src/app/services/project-detail.service';
import { UserDetailService } from 'src/app/services/user-detail.service';
import { Project,Assessor, ApiService } from 'src/app/services/api.service';
import { SyncService } from 'src/app/services/sync.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  connectionStr: string;
  connection: boolean;
  projects: Project[];
  projectId: string;
  selectProjectValue:string;
  userName: string;
  userNric: string;
  userRole: string;
  partners: Assessor[];
  assessors: Assessor[];
  partnerNric: string;
  selectPartnerValue:string;
  jobStatus: string;
  projectName: string;
  projectPhase: string;
  projectLocation: string;
  projectSample: string;
  projectDays: string;
  projectDate: string;
  tasks: any;
  toDisabled: boolean;

  constructor(
    private storage: NativeStorage,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public informationService:InformationService,
    private router: Router,
    private project: ProjectDetailService,
    private user: UserDetailService,
    private api:ApiService,
    private sync:SyncService,
    private alert:AlertService,
    private alertController:AlertController,
  ) { }

  ngOnInit() {
    this.initializedData();
    this.onChangeProject('');
    this.toDisabled = true;    
    setInterval(() => {    
      this.api.isServerConnected()
        .subscribe(
          data => {    
            if(data.status == 'OK'){
              this.connectionStr = 'Online';    
              this.connection = true;
            }else{
              this.connectionStr = 'Offline';  
              this.connection = false;  
            }
          },
          error => {
            this.connectionStr = 'Offline';  
            this.connection = false;    
            console.log(error)
          }
        )
    }, 5000);

  }

  ionViewWillEnter() {
    
  }

  async initializedData(){
    this.connection = true;
    this.connectionStr = 'Online';
    
    this.projects = this.project.projectList;
    await this.projects.forEach(async e=>{
      this.api.getDocuments(e.id).subscribe(data=>{

        if (localStorage.getItem(e.id+'_documents') === null) {
          this.storage.setItem(e.id+'_documents', data);
        }

      },err=>{console.error(err)});
    });
    
    this.userName = this.user.name;
    this.userNric = this.user.id;
  }

  onChangeProject(selectProject){

    if(selectProject == ''){
      this.toDisabled = true; 
      this.storage.remove('projectId');
    }else{
      this.toDisabled = false;  
  
      let i = 0;
      let index = -1;
      while(i < this.projects.length){
        if(this.projects[i].name == selectProject){
          index = i
        }
        i++;
      }

      
      console.log(this.projects[index]);
      console.log("this id:"+this.projects[index].id);
      
      this.projectId = this.projects[index].id;
      this.storage.setItem('projectId', this.projectId);
      
      let partnerInformation = {
        'name': '',
        'nric': ''
      }
      this.storage.setItem(this.projectId + '_partner', partnerInformation);

      this.partners = [];
      this.projects[index].assessors.forEach(element => {
        console.log(element.nric + " " + this.userNric)
        if(element.nric != this.userNric){
          this.partners.push(element);
        }
      });
      
      if(this.userNric == this.projects[index].leadNric){
        this.userRole = "leader";
      }else{
        this.userRole = "";
      }
      this.assessors =  this.projects[index].assessors
      this.jobStatus = this.projects[index].status
      this.projectName = this.projects[index].name
      this.projectPhase = this.projects[index].phase
      this.projectLocation = this.projects[index].location
      this.projectSample = this.projects[index].sample
      this.projectDays = this.projects[index].days
      this.projectDate = this.projects[index].date
      this.storage.setItem(this.projectId+"_project_information_detail",this.projects[index]);
      this.storage.getItem(this.projectId+"_project_detail").then(
        data=>{
          this.tasks = data;
          this.storage.setItem('tasks', this.tasks);
        }
      );
    };
  }

  onChangePartner(selectPartner){

    if(selectPartner !=''){
      let i = 0;
      let index = -1;
      while(i < this.partners.length){
        if(this.partners[i].name == selectPartner){
          index = i
        }
        i++;
      }
      this.partnerNric = this.partners[index].nric;
      this.storage.remove(this.projectId + '_partner');
      let partnerInformation = {
        'name': selectPartner,
        'nric': this.partnerNric
      }
      this.storage.setItem(this.projectId + '_partner', partnerInformation);
    }

  }
  
  async chooseByCategory(category, type) {
    
    if(type == '1'){
      const modal = await this.modalCtrl.create({  
        component: TaskFirstDesignPage,
        showBackdrop: true,
        cssClass: 'modal-choose',
        componentProps: {
          'category': category,
        }
      });
      return await modal.present();  
    }else if(type == '2'){
      let i = 0; let index = -1;
      while(i < this.tasks.length){
        if(this.tasks[i].category == category){
          index = i;
        }
        i++;
      }
      let data = this.tasks[index];
      this.storage.setItem('temporary', data);
      this.router.navigate(['/app/tab/task-second-design']);
    }
  }

  async completeCB(reply){
    await this.alert.alertStatus("Task Completion","Fill in the Work Completion Form and submit");
    if(reply){
      await this.syncData();
    }
    this.router.navigate(['/app/tab/complete']);
  }
  
  async completedForm(){
    if(this.projectId != undefined){
      this.storage.getItem(this.projectId+'_attendance').then(
      async data=>{
        const alert = await this.alertController.create({
          cssClass: 'my-alert-class',
          header: 'Task Completion',
          message: 'Do you want to sync your data first?',
          buttons: [{
              text: 'Yes',
              handler:()=>{
                this.completeCB(true);
                }
          },
          {
            text: 'No',
            handler:()=>{
              this.completeCB(false);
            }
          },
          {
            text: 'cancel',
          }
          ]
        });
        await alert.present();
      },
        async error=>{
          await this.alert.alertStatus("Warning","Please fill in attendance first");
        }
      );
    }else{
      await this.alert.alertStatus("Warning","Please select a project to complete");
    }
  }

  async overview(){
    const modal = await this.modalCtrl.create({  
      component: OverviewPage,
      showBackdrop: true,
      cssClass: 'modal-overview',
      componentProps: {
      }
    });
    return await modal.present();  
  }

  async syncData(){
    if(this.projectId != undefined){
      await this.alert.promptUser("Warning","You are about to synchronize your data, do you want to continue?",async(button)=>{
        if(button == true){
          await this.alert.startLoading("Please wait while we synchronize your data");
          await this.sync.syncNow(this.projectId).then(
            async data=>{
              this.alert.stopLoading();
              this.alert.alertStatus("Success","Your assessment data has been successfully synchronized");
            },async err=>{
              await this.alert.stopLoading();
              await this.alert.alertStatus("Failure","There is an error while synchronizing, please try again: "+err);
            }
          );
        }
      },this);
      
    }else{
      await this.alert.alertStatus("Warning","Please select a project to synchronize");
    }
  }
  
}
