import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class PhistoryServie {

  async createPhistory(
    phistoryHn:string,
    userId:number,
  ){
    try {
      return invoke('create_phistory',{phistoryHn,userId});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readPhistoryByHn(hn:string){
    try {
      return await invoke('read_phistory_hn',{hn:hn});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }


}
