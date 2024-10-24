import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { UserFormComponent } from './user-form/user-form-create.component';
import UserListComponent from './user-list/user-list.component';
import { single } from 'rxjs';

import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { TUser } from '@core/interfaces/user.interfaces';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services/user.service';


@Component({
  selector: 'app-users',
  standalone:true,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports:[
    UserListComponent,
    UserFormComponent,
    CommonModule
  ]
})
export default class UsersComponent implements OnInit{

  // defualt false
  isOpened = signal(false);
  userId = signal(0);
  data: TUser[] = [];

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  openSide(){
    this.isOpened.set(!this.isOpened)
  }

  onMessageChange($event:string){

    if($event === 'open'){
      this.isOpened.set(true);
      this.userId.set(0);
    }else if($event === 'close'){
      this.isOpened.set(false);
      this.userId.set(0);
      this.fetchData();
    }
  }

  onFormData($event:any){
    this.userId.set($event);
  }

  async fetchData() {
    try {
      const result:any = await this._userService.readUsers();
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      // console.log('Loading success....')
    }
  }

}
