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
import { Observable, map, startWith } from 'rxjs';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '@core/services/auth.service';
import { PatientServie } from '@core/services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';


import { PhoneMaskDirective } from '@core/directives/phone-mask.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PhistoryServie } from '@core/services/phistory.service';
import moment from 'moment';
import 'moment/locale/th';

interface Employee {
  patient_id: number;
  patient_code: string;
  patient_name: string;
  patient_tel: string;
  patient_role_id: '';
}

@Component({
  selector: 'app-patient-user',
  standalone: true,
  templateUrl: './patient-user.component.html',
  styleUrl: './patient-user.component.scss',
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
    MatTabsModule,
    MatTableModule,
    MatRippleModule,
    NgxMaskDirective
  ],
  providers:[
    provideNgxMask()
  ]
})
export class PatientUserComponent implements OnInit{

  sideCreate = signal(false);
  _formId = signal('HN00000');
  data:any;
  _data:any;


  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }

  @Input() set formId(val:any){

    this._formId.set(val);

    if(this._formId() != 'HN00000'){
      // ฟอร์มแก้ไข
      this.fetchData(val);
      this.fetchPhistoryData(val);
    }

    this.initForm();
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();


  // Method to handle changes and emit the new value
  onMessageChange(newMessage: string) {
    this.messageChange.emit(newMessage);
    this.formGroupData.reset();
  }

  userId: any = "";
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();


  displayedColumns: string[] = ['phistory_date','phistory_time','phistory_name'];
  dataSource:any = [];

  constructor(private _authService:AuthService,private  _patientServie: PatientServie,private _phistoryServie: PhistoryServie,private _snackBar: MatSnackBar) {

    moment.updateLocale('th', {
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY เวลา HH:mm',
        LLLL: 'วันddddที่ D MMMM YYYY เวลา HH:mm',
      },
      // Function to add 543 years to the Gregorian year
      postformat: (str: any) =>
        str.replace(/(\d{4})/g, (year: any) =>
          (parseInt(year, 10) + 543).toString()
        ),
    });
  }

  async ngOnInit() {
    // this.initForm();
    this.userId = await this._authService.getUserId();

  }

  async onSubmit() {
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        let patientTitle = this.formGroupData.value.patient_title;
        let patientFname = this.formGroupData.value.patient_firstname;
        let patientLname = this.formGroupData.value.patient_surname;
        let patientTel = this.formGroupData.value.patient_tel;
        let patientCid = this.formGroupData.value.patient_cid;
        let patientAddr = this.formGroupData.value.patient_addr;
        let _userId:number = parseInt(this.userId);
        let hn:string = this._formId();

        if(hn != 'HN00000'){
          const result = await this._patientServie.updatepatientByHn(patientTitle,patientFname,patientLname,patientTel,patientCid,patientAddr,_userId,hn);

            if(result === 'ok'){
              this._snackBar.open(`ปรับปรุงข้อมูลเรียบร้อย`, '', {
                duration:1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['success-snackbar']
              }).afterDismissed().subscribe(() => {
                this.onMessageChange('close');
              });
              }else{
                this._snackBar.open('บันทึกข้อมูลผิดพลาด', '', {
                  duration:3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass:['error-snackbar']
                }).afterDismissed().subscribe(() => {
                  // this.onMessageChange('close');
                  this.initForm();
                });
              }
        }else{

          const result = await this._patientServie.createPatient(patientTitle,patientFname,patientLname,patientTel,patientCid,patientAddr,_userId);

            if(result === 'ok'){
                this._snackBar.open(`บันทึกข้อมูลเรียบร้อย`, '', {
                  duration:1500,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass:['success-snackbar']
                }).afterDismissed().subscribe(() => {
                  this.onMessageChange('close');
                  this.initForm();
                });
              }else{
                this._snackBar.open('บันทึกข้อมูลผิดพลาด', '', {
                  duration:3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass:['error-snackbar']
                }).afterDismissed().subscribe(() => {
                  // this.onMessageChange('close');
                  this.initForm();
                });
              }
        }

      } catch (error: any) {
        // Handle error during form submission
        console.error(error);
      }
    } else {
      // Handle form validation errors
    }
  }

  async btnPhistory() {
    try {

      let _userId:number = parseInt(this.userId);
      let hn:string = this._formId();

      if(hn != 'HN00000'){
        const result = await this._phistoryServie.createPhistory(hn,_userId);
          if(result === 'ok'){
            this._snackBar.open(`ส่งตรวจข้อมูลเรียบร้อย`, '', {
              duration:1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass:['success-snackbar']
            }).afterDismissed().subscribe(() => {
              // this.onMessageChange('close');
              this.fetchPhistoryData(hn);
              this.onMessageChange('close');
            });
            }else{
              this._snackBar.open('บันทึกข้อมูลผิดพลาด', '', {
                duration:3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['error-snackbar']
              }).afterDismissed().subscribe(() => {
                // this.onMessageChange('close');
                // this.initForm();
              });
            }
      }

    } catch (error: any) {
      // Handle error during form submission
      console.error(error);
      this._snackBar.open('บันทึกข้อมูลผิดพลาด', '', {
        duration:3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass:['error-snackbar']
      }).afterDismissed().subscribe(() => {
        // this.onMessageChange('close');
        // this.initForm();
      });
    }
  }

  // ฟอร์มเพิ่ม
  initForm() {
    this.formGroupData = new FormGroup({
      patient_title: new FormControl('', [Validators.required]),
      patient_firstname: new FormControl('', [Validators.required]),
      patient_surname: new FormControl('', [Validators.required]),
      patient_tel: new FormControl('',[Validators.pattern(/^[0-9]{10}$/)]),
      patient_cid: new FormControl('',[Validators.pattern(/^[0-9]{13}$/)]),
      patient_addr: new FormControl(''),
    });
  }

  // ฟอร์มแก้ไข
  updateForm(data:any) {
    // this.codeUser.set(data.user_code);
    this.formGroupData.patchValue({
      patient_title:data.patient_title,
      patient_firstname:data.patient_fname,
      patient_surname:data.patient_lname,
      patient_tel:data.patient_tel,
      patient_cid:data.patient_cid,
      patient_addr:data.patient_addr
    });

    // this.formGroupData.controls["user_password"].clearValidators();
    // this.formGroupData.controls["user_password"].updateValueAndValidity();

  }


  async fetchData(hn:string) {

    try {
      const result = await this._patientServie.readatientByHn(hn);

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

  async fetchPhistoryData(hn:string) {

    let response: any;
    try {
      response = await this._phistoryServie.readPhistoryByHn(hn);

      // this.dataSource.data = response.result;
      this._data = response;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      console.log('Loading success....')
    }

    this.dataSource = response;
  }

  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }


  onNoClick(): void {

  }






}
