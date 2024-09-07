import { Component, WritableSignal, signal } from '@angular/core';
import { DashboardFormComponent } from './dashboard-form/dashboard-form-create.component';
import DashboardListComponent from './dashboard-list/dashboard-list.component';
import { DashboardUserComponent } from "./dashboard-user/dashboard-user.component";


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
    DashboardFormComponent,
    DashboardUserComponent
]
})
export default class DashboardComponent {

  // defualt false
  isOpened = signal(true);

  formData:WritableSignal<Employee> = signal({
    emp_id: 0,
    emp_code: '',
    emp_name: '',
    emp_tel:'',
    emp_role_id:''
  })

  openSide(){
    this.isOpened.set(!this.isOpened)
  }

  onMessageChange($event:string){

    if($event === 'open'){
      this.isOpened.set(true);
      this.resetEmployeeData();
    }else if($event === 'close'){
      this.isOpened.set(false);
      this.resetEmployeeData();
    }
  }

  onFormData($event:any){
    this.formData.update(emp => ({
      ...emp,
      emp_id: $event.emp_id,
      emp_code: $event.emp_code,
      emp_name:$event.emp_name,
      emp_tel:$event.emp_tel,
      emp_role_id:$event.emp_role_id,
    }));
  }

  resetEmployeeData() {
    this.formData.set({
      emp_id: 0,
      emp_code: '',
      emp_name: '',
      emp_tel:'',
      emp_role_id:'',
    });
  }

}
