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
}
