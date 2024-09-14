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

import { invoke } from '@tauri-apps/api/tauri';

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
    MatCardModule
  ]
})
export class UserFormComponent implements OnInit{

  sideCreate = signal(false);
  idUser = signal(0);
  data:any;

  formDataSignal:WritableSignal<any> = signal({
    user_id: 0,
    user_fullname: '',
    user_name: '',
    user_tel: '',
    user_role_id:''
  })



  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }
  @Input() set userId(val:any){
    console.log(val);
    this.idUser.set(val);

    this.fetchData(val);
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


  constructor() {}

  ngOnInit(): void {
    // this.accessibleId = '';
    // this.initForm();


  }

  async onSubmit() {
    console.log(this.formGroupData.valid);
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        console.log(this.formGroupData.value);

        let userTitle = this.formGroupData.value.user_title;
        let userFname = this.formGroupData.value.user_fname;
        let userLname = this.formGroupData.value.user_lname;
        let userPosition = this.formGroupData.value.user_position;
        let userUsername = this.formGroupData.value.user_username;
        let userPassword = this.formGroupData.value.user_password;

        const result = await invoke('create_and_update_item',{userTitle,userFname,userLname,userPosition,userUsername,userPassword});
        console.log(result);
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
    console.log('Loadding ...')
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

  onNoClick(): void {

  }


  async fetchData(userId:number) {
    try {
      const result = await invoke('read_user_id',{userId:userId});
      console.log('Data fetched from database:', result);
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      console.log('Loading success....')
    }
  }




}
