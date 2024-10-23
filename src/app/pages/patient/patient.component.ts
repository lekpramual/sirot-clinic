import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { PatientUserComponent } from "./patient-user/patient-user.component";
import { TPatient } from '@core/interfaces/patient.interfaces';
import { PatientServie } from '@core/services/patient.service';
import PatientListComponent from './patient-list/patient-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';


interface Employee {
  emp_id: number;
  emp_code: string;
  emp_name: string;
  emp_tel: string;
  emp_role_id: string;
}

@Component({
  selector: 'app-patient',
  standalone:true,
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
  imports: [
    PatientListComponent,
    PatientUserComponent
]
})
export default class PatientComponent  implements OnInit {

  // defualt false
  isOpened = signal(false);
  formId = signal('HN00000');

   // ฟอร์มเริ่มต้น
   formPatient = signal({
    action:'create',
    patient_cid: "",
    patient_created: new Date(),
    patient_fname: "",
    patient_id: "",
    patient_lname: "",
    patient_no: "",
    patient_tel: "",
    patient_title: ""
  })

  searchPatient = signal({
    searchOption:'name',
    searchValue:'',
  })

  data: any[] = [];

  constructor(private _patientServie: PatientServie,private _snackBar: MatSnackBar) {}


  ngOnInit(): void {

  }



  openSide(){
    this.isOpened.set(!this.isOpened)
  }

  onMessageChange($event:any){
    console.log($event);
    if($event === 'open'){
      this.isOpened.set(true);
    }else if($event === 'close'){
      this.isOpened.set(false);

      this.formChangeSearch(this.searchPatient())
    }else if($event === 'reset'){
      this.searchPatient.update((result) => ({
        ...result,
        searchOption:'name',
        searchValue:''
      }));

      this.data = [];

      this.isOpened.set(false);
    }
  }

  formChangeSearch($event:any){
    console.log('>>> event change Search',$event);
    const _option = $event.searchOption;
    const _value = $event.searchValue;
    this.searchPatient.update((result) => ({
      ...result,
      searchOption:_option,
      searchValue:_value
    }));

    if(_option == 'name' && _value != ''){
      this.fetchDataSearchName(_value);
    }else if(_option == 'date'  && _value != ''){
      this.fetchDataSearchDate(_value)
    }else if(_option == 'cid'  && _value != ''){
      this.fetchDataSearchCid(_value)
    }


  }

  onFormData($event:any){
    console.log('>>> event',$event);
    this.formPatient.update((result) => ({
      ...result,
      action:$event.action,
      patient_cid: $event.patient_cid,
      patient_created: $event.patient_created,
      patient_fname: $event.patient_fname,
      patient_id: $event.patient_id,
      patient_lname: $event.patient_lname,
      patient_no: $event.patient_no,
      patient_tel: $event.patient_tel,
      patient_title: $event.patient_title
    }));
    console.log($event);
  }


  async fetchDataSearchName(name:string) {
    try {
      const result:any = await this._patientServie.readPatientSearchName(name);
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      console.log('Loading success....');


    }
  }


  async fetchDataSearchCid(cid:string) {
    try {
      const result:any = await this._patientServie.readPatientSearchCid(cid);
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);

      throw error;
    } finally {
      console.log('Loading success....');
      setTimeout(() => {
      }, 3000);

    }
  }

  async fetchDataSearchDate(date:string) {
    try {
      const result:any = await this._patientServie.readPatientSearchDate(date);
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);

      throw error;
    } finally {
      console.log('Loading success....');
      setTimeout(() => {
      }, 3000);

    }
  }

}
