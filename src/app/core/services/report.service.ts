import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class ReportServie {
  async readReportByDate(begin:string,end:string){
    try {
      return await invoke('read_report_date',{begin,end});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }


}
