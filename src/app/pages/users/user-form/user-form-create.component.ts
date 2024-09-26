import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule } from '@angular/material/slide-toggle';
import { TUser } from '@core/interfaces/user.interfaces';
import { Observable, map, startWith } from 'rxjs';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { invoke } from '@tauri-apps/api/tauri';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-form-create',
  standalone: true,
  templateUrl: './user-form-create.component.html',
  styleUrl: './user-form-create.component.scss',
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class UserFormComponent implements OnInit{

  sideCreate = signal(false);
  idUser = signal(0);
  codeUser = signal('');
  data:any;


  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }
  @Input() set userId(val:any){

    console.log(val);
    this.idUser.set(val);

    if(this.idUser() != 0){
      console.log('is not 0');
      this.fetchData(val);
      // this.updateForm(result);
    }
    // this.fetchData(val);
    this.initForm();
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();
  // Method to handle changes and emit the new value
  onMessageChange(newMessage: string) {
    this.messageChange.emit(newMessage);
    this.formGroupData.reset();
  }

  accessibleId: string = "";
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();


  constructor(private _snackBar: MatSnackBar,private _userService: UserService) {}

  async ngOnInit() {

  }

  async onSubmit() {
    console.log(this.formGroupData.valid);
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        console.log(this.formGroupData.value);
        let userId = this.idUser();
        let userTitle = this.formGroupData.value.user_title;
        let userFname = this.formGroupData.value.user_fname;
        let userLname = this.formGroupData.value.user_lname;
        let userPosition = this.formGroupData.value.user_position;
        let userUsername = this.formGroupData.value.user_username;
        let userPassword = this.formGroupData.value.user_password;

        try {
          if(userId != 0){
            const result = await this._userService.updateUserById(userId,userTitle,userFname,userLname,userPosition,userUsername,userPassword);
            if(result === 'ok'){
              this._snackBar.open(`ปรับปรุงข้อมูลเรียบร้อย`, '', {
                duration:1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['success-snackbar']
              }).afterDismissed().subscribe(() => {
                this.onMessageChange('close');
              });
            }
          }else{
            const result = await this._userService.createUser(userTitle,userFname,userLname,userPosition,userUsername,userPassword);
            if(result === 'ok'){
              this._snackBar.open(`บันทึกข้อมูลเรียบร้อย`, '', {
                duration:1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['success-snackbar']
              }).afterDismissed().subscribe(() => {
                this.onMessageChange('close');
              });
            }
          }

        } catch (error) {
          this._snackBar.open('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง', '', {
            duration:3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['error-snackbar']
          }).afterDismissed().subscribe(() => {
            this.initForm();
          });
        }

      } catch (error: any) {
        // Handle error during form submission
        console.error(error);
      }
    } else {
      // Handle form validation errors
      console.log("form validation error..");
    }
  }

  initForm() {
    // choice_depart choice_stamp
    this.formGroupData = new FormGroup({
      user_title: new FormControl('', [Validators.required]),
      user_fname: new FormControl('', [Validators.required]),
      user_lname: new FormControl('', [Validators.required]),
      user_position: new FormControl(''),
      user_username: new FormControl('',[Validators.required]),
      user_password: new FormControl('',[Validators.required]),
    });
  }

  updateForm(data:any) {
    console.log(data);
    this.codeUser.set(data.user_code);
    this.formGroupData.patchValue({
      user_title:data.user_title,
      user_fname:data.user_fname,
      user_lname:data.user_lname,
      user_position:data.user_position,
      user_username:data.user_username,
      user_password:""
    });

    this.formGroupData.controls["user_password"].clearValidators();
    this.formGroupData.controls["user_password"].updateValueAndValidity();

  }


  async fetchData(userId:number) {
    try {
      const result = await this._userService.readUserById(userId);
      this.data = result;
      this.updateForm(result);
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      console.log('Loading success....')
    }
  }

}
