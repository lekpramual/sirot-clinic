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

interface Employee {
  patient_id: number;
  patient_code: string;
  patient_name: string;
  patient_tel: string;
  patient_role_id: '';
}

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  templateUrl: './dashboard-user.component.html',
  styleUrl: './dashboard-user.component.scss',
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
    MatRippleModule
  ]
})
export class DashboardUserComponent implements OnInit{

  sideCreate = signal(false);

  formDataSignal:WritableSignal<Employee> = signal({
    patient_id: 0,
    patient_code: '',
    patient_name: '',
    patient_tel: '',
    patient_role_id:''
  })





  @Input() set sideopen(val:boolean){

    this.sideCreate.set(val)
  }
  @Input() set formdata(val:any){
    console.log(val);

    this.formDataSignal.update(emp => ({
      ...emp,
      patient_id: val.patient_id,
      patient_code: val.patient_code,
      patient_name:val.patient_name,
      patient_tel:val.patient_tel,
      patient_role_id:val.patient_role_id
    }));

    // this.formData.set({
    //   data: {
    //     patient_id: val.data.patient_id
    //   }
    // })
    this.initForm();
  }

  // Output property to send data back to the parent
  @Output() messageChange = new EventEmitter<string>();


  departments = [
    { id: 2, name: 'เจ้าหน้าที่ IPD' },
    { id: 3, name: 'เจ้าหน้าที่ OPD' },
    { id: 4, name: 'ศูนย์ OPD' },
    { id: 5, name: 'ศูนย์ IPD' },
  ];

  options: any[] = [
    {name: 'หน่วยงาน 1', id: 1},
    {name: 'หน่วยงาน 2', id: 2},
    {name: 'หน่วยงาน 3', id: 3},
    {name: 'หน่วยงาน 4', id: 4},
    {name: 'หน่วยงาน 5', id: 5}

  ];

  ELEMENT_DATA = [
    {date: '20 กันยายน 2567'},
    {date: '10 เมษายน 2567'},
    {date: '2 มีนาคม 2567'},
    {date: '1 กุมภาพันธ์ 2567'},
    {date: '1 มกราคม 2567'}
  ];

  // Method to handle changes and emit the new value
  onMessageChange(newMessage: string) {
    this.messageChange.emit(newMessage);
    this.formGroupData.reset();
  }

  accessibleId: string = "";
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;
  searchControl: FormControl = new FormControl();


  displayedColumns: string[] = ['date'];
  dataSource = this.ELEMENT_DATA;

  constructor() {}

  ngOnInit(): void {
    // this.accessibleId = '';
    // this.initForm();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );



  }

  async onSubmit() {
    console.log(this.formGroupData.valid);
    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        const data: any = {};
        data.name = this.formGroupData.value.patient_name;
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
    console.log('Loadding ...',this.formDataSignal()?.patient_name)
    // choice_depart choice_stamp
    this.formGroupData = new FormGroup({
      patient_title: new FormControl(this.formDataSignal()?.patient_name, [Validators.required]),
      patient_firstname: new FormControl(this.formDataSignal()?.patient_name, [Validators.required]),
      patient_surname: new FormControl(this.formDataSignal()?.patient_name, [Validators.required]),
      patient_name: new FormControl(this.formDataSignal()?.patient_name, [Validators.required]),
      patient_tel: new FormControl(this.formDataSignal()?.patient_tel,[]),
      patient_depart: new FormControl(null,[Validators.required]),
      patient_cid: new FormControl(''),
      patient_addr: new FormControl(''),
      patient_role_id: new FormControl(this.formDataSignal()?.patient_role_id,[Validators.required]),
      patient_status: new FormControl(false,[Validators.required]),
      patient_user: new FormControl('',[Validators.required]),
      patient_pass: new FormControl('',[Validators.required]),
    });
  }

  onNoClick(): void {

  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }




}
