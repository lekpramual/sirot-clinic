import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  async loginUser(userUsername:string,userPassword:string){
    try {
      return await invoke('login_user',{userUsername,userPassword});
    } catch (error) {
      console.error("Error read users:", error);
      throw error;
    }
  }
}
