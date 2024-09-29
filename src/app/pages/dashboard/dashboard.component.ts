import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import DashboardListComponent from './dashboard-list/dashboard-list.component';
import { DashboardUserComponent } from "./dashboard-user/dashboard-user.component";
import { TPatient } from '@core/interfaces/patient.interfaces';
import { PatientServie } from '@core/services/patient.service';


interface Employee {
  emp_id: number;
  emp_code: string;
  emp_name: string;
  emp_tel: string;
  emp_role_id: string;
}

@Component({
  selector: 'app-dashboard',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    DashboardListComponent,
    DashboardUserComponent
]
})
export default class DashboardComponent  implements OnInit {

  // defualt false
  isOpened = signal(false);
  formId = signal('HN00000');

  data: TPatient[] = [];

  constructor(private _patientServie: PatientServie) {}


  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData() {
    try {
      const result:any = await this._patientServie.readPatients();
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      console.log('Loading success....')
    }
  }

  openSide(){
    this.isOpened.set(!this.isOpened)
  }

  onMessageChange($event:string){
    if($event === 'open'){
      this.isOpened.set(true);
      this.formId.set('HN00000');
    }else if($event === 'close'){
      this.isOpened.set(false);

      this.formId.set('HN00000');
      this.fetchData();
    }else if($event === 'reset'){
      this.fetchData();
    }
  }

  onFormData($event:any){

    this.formId.set($event);
  }

}
