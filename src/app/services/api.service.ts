import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {EnvService} from 'src/app/services/env.service'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private env: EnvService,
    ) { }

  isServerConnected(){
    return this.http.get<isAliveObject>(this.env.API_URL+'/isAlive')
  }

  login(formData:FormData){
    // return this.http.post<loginObject>(this.env.API_URL+'/login/',formData)
    return this.http.post<loginObject>(this.env.API_URL+'/auth/obtain',formData)
  }
  
  getProjectData(formData:FormData){
    return this.http.post<ProjectDetailObject>(this.env.API_URL+'/getProjectData',formData)
  }

  isSyncReady(projectId:string){
    return this.http.get<readySyncObject>(this.env.API_URL+'/readySync/'+projectId)
  }

  isCompleteReady(projectId:string){
    return this.http.get<readyCompleteObject>(this.env.API_URL+'/readyComplete/'+projectId)
  }

  getDocuments(projectId:string){
    return this.http.get<DocumentObject>(this.env.API_URL+'/getDocument/'+projectId)
  }

  syncNow(formData:FormData){
    return this.http.post<ProjectDetailObject>(this.env.API_URL+'/sync',formData)
  }

  getOverview(projectId:string){
    return this.http.get<OverviewObject>(this.env.API_URL+'/overview/'+projectId);
  }

  completeTask(completionForm:FormData){
    return this.http.post<CompletionObject>(this.env.API_URL+'/complete',completionForm)
  }

  getAgreement(projectId:string){
    return this.http.get<AgreementObject>(this.env.API_URL+'/getAgreement/'+projectId);
  }

  getApplicationNo(projectId:string){
    return this.http.get<ApplicationNoObject>(this.env.API_URL+'/appNo/'+projectId);
  }

}

export interface isAliveObject{
  status:string;
}

export interface Assessor {
  name: string;
  nric: string;
}

export interface Project {
  name: string;
  id: string;
  code: string;
  status: string;
  phase: string;
  location: string;
  sample: string;
  days: string;
  date: string;
  leadName: string;
  leadNric: string;
  assessors: Assessor[];
}

export interface loginObject {
  name: string;
  email: string;
  nric: string;
  role: string;
  token: string;
  status: string;
  project: Project[];
}

export interface readySyncObject{
  readySync:string
}

export interface readyCompleteObject{
  readyComplete:string
}

export interface Subtopic {
  subtopic: string;
  id: number;
  checkbox: string[];
  sample: number;
}

export interface Item {
  topic: string;
  type: number;
  subtopics: Subtopic[];
  id?: number;
  ptotal?:number;
  stotal?:number;
  ctotal?:number;
  checkbox: string[];
  sample?: number;
}

export interface ProjectDetailObject {
  category: string;
  type: number;
  items: Item[];
}

export interface DocumentObject {
  id: string;
  name: string;
  link: string;
}

export interface Information {
  projectID: string;
  projectName: string;
  phase: string;
  startDate: string;
}

export interface Header {
  topic: string;
  type: string;
  subtopictotal: string;
  subtopic: string[];
  complete: string;
  total: string;
}

export interface Body {
  jobStatus: string;
  syncID: string;
  syncTime: string;
  resultTable: string[];
}

export interface OverviewObject {
  information: Information;
  header: Header[];
  body: Body[];
}

export interface AgreementObject{
  projectId:string;
  agreement:string;
}

export interface CompletionObject{
  projectId:string;
  message:string;
  result:boolean;
}

export interface ApplicationNoObject{
  projectId:string;
  applicationNo:string;
}
