import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  async createUser(
    userTitle:string,
    userFname:string,
    userLname:string,
    userPosition:string,
    userUsername:string,
    userPassword:string
  ){
    try {
      return invoke('create_and_update_item',{userTitle,userFname,userLname,userPosition,userUsername,userPassword});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readUsers(){
    try {
      return await invoke('read_users');
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async readUserById(userId:number){
    try {
      return await invoke('read_user_id',{userId:userId});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }

  async updateUserById(
    userId:number,
    userTitle:string,
    userFname:string,
    userLname:string,
    userPosition:string,
    userUsername:string,
    userPassword:string
  ): Promise<any> {
    try {
      return await invoke('update_user_id',{userId,userTitle,userFname,userLname,userPosition,userUsername,userPassword});
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
