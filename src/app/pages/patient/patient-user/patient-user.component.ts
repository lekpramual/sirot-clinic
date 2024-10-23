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
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule, provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from '@core/services/auth.service';
import { PatientServie } from '@core/services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';


import { PhoneMaskDirective } from '@core/directives/phone-mask.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PhistoryServie } from '@core/services/phistory.service';
import moment from 'moment';
import 'moment/locale/th';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '@core/components/custom-date-format';

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
    NgxMaskDirective,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers:[
    provideNgxMask(),
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Provide custom date formats
    { provide: MAT_DATE_LOCALE, useValue: 'th' }, // Set the locale to Thai
  ]
})
export class PatientUserComponent implements OnInit{

  sideCreate = signal(false);
  _formId = signal('HN00000');
    _formPatient = signal({
      action:'create',
      patient_cid: "",
      patient_created: "",
      patient_fname: "",
      patient_id: "",
      patient_lname: "",
      patient_no: "",
      patient_tel: "",
      patient_title: ""
  })

  data:any;
  _data:any;

   // date max min
   maxDate!: Date;
   minDate!: Date;

  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }

  @Input() set formPatient(val:any){

    console.log('>>>> val',val)
    this._formPatient.set(val);

    this.initForm();
  }

  @Input() set formId(val:any){

    this._formId.set(val);

    // if(this._formId() != 'HN00000'){
    //   // ฟอร์มแก้ไข
    //   this.fetchData(val);
    //   this.fetchPhistoryData(val);
    // }

    // this.initForm();
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
        let patientDate = moment(this.formGroupData.value.patient_date).add('year',-543).format("YYYY-MM-DD");
        let patientNo = this.formGroupData.value.patient_no;

        const action = this._formPatient().action;
        console.log('action >>>',action);
        if(action == 'update'){
          const patientId = parseInt(this._formPatient().patient_id);

          const result = await this._patientServie.updatepatientById(patientTitle,patientFname,patientLname,patientTel,patientCid,patientDate,patientNo,patientId);

          if(result === 'ok'){
              this._snackBar.open(`บันทึกข้อมูลเรียบร้อย`, '', {
                duration:1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['success-snackbar']
              }).afterDismissed().subscribe(() => {
                this.onMessageChange('close');
                // this.initForm();
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
        }else{
          const result = await this._patientServie.createPatient(patientTitle,patientFname,patientLname,patientTel,patientCid,patientDate,patientNo);

          if(result === 'ok'){
              this._snackBar.open(`บันทึกข้อมูลเรียบร้อย`, '', {
                duration:1500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass:['success-snackbar']
              }).afterDismissed().subscribe(() => {
                this.onMessageChange('close');
                // this.initForm();
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
      }
    } else {
      // Handle form validation errors
    }
  }

  // ฟอร์มเพิ่ม
  initForm() {

    console.log('>>>> formPatient',this._formPatient())

    if(this._formPatient().action == 'create'){
      this.formGroupData = new FormGroup({
        patient_title: new FormControl(this._formPatient().patient_title, [Validators.required]),
        patient_firstname: new FormControl(this._formPatient().patient_fname, [Validators.required]),
        patient_surname: new FormControl(this._formPatient().patient_lname, [Validators.required]),
        patient_tel: new FormControl(this._formPatient().patient_tel,[Validators.pattern(/^[0-9]{10}$/)]),
        patient_cid: new FormControl(this._formPatient().patient_cid,[Validators.pattern(/^[0-9]{13}$/)]),
        patient_date: new FormControl(this._formPatient().patient_created, [Validators.required]),
        patient_no: new FormControl(this._formPatient().patient_no, [Validators.required]),
      });
    }else if(this._formPatient().action == 'update'){
      this.formGroupData = new FormGroup({
        patient_title: new FormControl(this._formPatient().patient_title, [Validators.required]),
        patient_firstname: new FormControl(this._formPatient().patient_fname, [Validators.required]),
        patient_surname: new FormControl(this._formPatient().patient_lname, [Validators.required]),
        patient_tel: new FormControl(this._formPatient().patient_tel,[Validators.pattern(/^[0-9]{10}$/)]),
        patient_cid: new FormControl(this._formPatient().patient_cid,[Validators.pattern(/^[0-9]{13}$/)]),
        patient_date: new FormControl(this._formPatient().patient_created, [Validators.required]),
        patient_no: new FormControl(this._formPatient().patient_no, [Validators.required]),
      });
    }else{
      this.formGroupData = new FormGroup({
        patient_title: new FormControl(this._formPatient().patient_title, [Validators.required]),
        patient_firstname: new FormControl(this._formPatient().patient_fname, [Validators.required]),
        patient_surname: new FormControl(this._formPatient().patient_lname, [Validators.required]),
        patient_tel: new FormControl(this._formPatient().patient_tel,[Validators.pattern(/^[0-9]{10}$/)]),
        patient_cid: new FormControl(this._formPatient().patient_cid,[Validators.pattern(/^[0-9]{13}$/)]),
        patient_date: new FormControl(new Date(), [Validators.required]),
        patient_no: new FormControl('', [Validators.required]),
      });
    }

  }


  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }


  onNoClick(): void {

  }






}
