import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class PatientServie {

  async createPatient(
    patientTitle:string,
    patientFname:string,
    patientLname:string,
    patientTel:string,
    patientCid:string,
    patientAddr:string,
    userId:number,
  ){
    try {
      return invoke('create_and_update_patient',{patientTitle,patientFname,patientLname,patientTel,patientCid,patientAddr,userId});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readPatients(){
    try {
      return await invoke('read_patients');
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readatientByHn(hn:string){
    try {
      return await invoke('read_patient_hn',{hn:hn});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async updatepatientByHn(
    patientTitle:string,
    patientFname:string,
    patientLname:string,
    patientTel:string,
    patientCid:string,
    patientAddr:string,
    userId:number,
    hn:string
  ): Promise<any> {
    try {
      return await invoke('update_patient_hn',{patientTitle,patientFname,patientLname,patientTel,patientCid,patientAddr,userId,hn});
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async readPatientSearchName(name:string){
    try {
      return await invoke('read_patient_search_name',{name:name});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readPatientSearchCid(cid:string){
    try {
      return await invoke('read_patient_search_cid',{cid:cid});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readPatientSearchDate(date:string){
    try {
      return await invoke('read_patient_search_date',{date:date});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }
}
