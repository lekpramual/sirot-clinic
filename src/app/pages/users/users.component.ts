import { Component, WritableSignal, signal } from '@angular/core';
import { UserFormComponent } from './user-form/user-form-create.component';
import UserListComponent from './user-list/user-list.component';
import { TUser } from '@core/interfaces/user.interfaces';
import { single } from 'rxjs';


@Component({
  selector: 'app-users',
  standalone:true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports:[
    UserListComponent,
    UserFormComponent
  ]
})
export default class UsersComponent {

  // defualt false
  isOpened = signal(true);
  userId = signal(0);


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
    console.log($event)
    this.userId.set($event);
  }

  resetEmployeeData() {
    this.userId.set(0);
  }

}
