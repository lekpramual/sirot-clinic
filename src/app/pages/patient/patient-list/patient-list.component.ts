import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TPatient } from '@core/interfaces/patient.interfaces';
import { single, Subject, timeout } from 'rxjs';
import { MatPaginator, MatPaginatorModule,MatPaginatorIntl } from "@angular/material/paginator";
import { getThaiPaginatorIntl } from '@core/components/thai-paginator-intl';
import { PhistoryServie } from '@core/services/phistory.service';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import 'moment/locale/th';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '@core/components/custom-date-format';
import { PatientServie } from '@core/services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getThaiPaginatorIntl() },
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Provide custom date formats
    { provide: MAT_DATE_LOCALE, useValue: 'th' },
  ]

})

export default class PatientListComponent implements OnInit{

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  _data: any;
  sideCreate = signal(false);
  searchValue = "";
  userId: any = "";
  // searchTerm = new Subject<string>();
  currentDate = new Date();

  searchTerm = signal("");
  isLoading  = true;

  // date max min
  maxDate!: Date;
  minDate!: Date;

  // ฟอร์มเริ่มต้น
  formPatient = signal({
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

  _searchPatient = signal({
    searchOption:'name',
    searchValue:'',
  })

  @Input() set sideopen(val:boolean){
    this.sideCreate.set(val)
  }

  @Input() set tbData(val:any){
    this._data = val;
    // console.log('tbData >>>',val);
    this.isLoading = true;
    // console.log('loading true..')
    setTimeout(() => {
      // console.log('loading false..')
      this.isLoading = false;
      // Example data. If empty, "No Data" message will be displayed.
      this.dataSource.data = val; // Change to some data array to display data in the table.
    }, 2000); // Simulate a 3-second data load delay


  }

  @Input() set searchPatient(val:any){
    // this._data = val;
    // this.dataSource.data = val;
    // console.log('>>>>',val);
    this._searchPatient.update((result) => ({
      ...result,
      searchOption:val.searchOption,
      searchValue:val.searchValue
    }));

    this.initForm();
  }

   // Output property to send data back to the parent
   @Output() messageChange = new EventEmitter<string>();

   @Output() formChangeSearch = new EventEmitter<string>();


   @Output() formChange = new EventEmitter<[]>();

   searchForm!: FormGroup;

   searchOptions = [
     {value: 'name', label: 'ชื่อ-สกุล'},
     {value: 'cid', label: 'เลขบัตรประชาชน'},
     {value: 'date', label  : 'วันที่ส่งตรวจ'}
   ];

   // Method to handle changes and emit the new value
   onMessageChange() {

    this.formPatient.update((_patient) => ({
      ..._patient,
      action:'create',
      patient_cid: "",
      patient_created: "",
      patient_fname: "",
      patient_id: "",
      patient_lname: "",
      patient_no: "",
      patient_tel: "",
      patient_title: ""
    }))



    this.messageChange.emit('open');
    // console.log('create >>>', this.formPatient())
    const rowPatient:any = this.formPatient();
    this.formChange.emit(rowPatient);
    //  this.sideCreate.set(true)
   }

  displayedColumns = ['name','patient_created','patient_no','patient_tel','patient_cid','actions'];

  // dataSource = UserData;
  dataSource = new MatTableDataSource<TPatient>();
  // dataSource!: MatTableDataSource<UserList>;

  constructor(private _authService:AuthService,private _patientServie: PatientServie,private _snackBar: MatSnackBar) {
    // this.dataSource = new MatTableDataSource(users);

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



     // Set the max and min date based on the current year
     const currentYear = new Date().getFullYear();
     this.maxDate = new Date(currentYear + 1, 11, 31); // December 31 of next year
     this.minDate = new Date(currentYear - 1, 0, 1); // January 1 of the current year
  }

  // ฟอร์มเพิ่ม
  initForm() {
    // console.log(this._searchPatient().searchOption);

    const _option = this._searchPatient().searchOption;
    if(_option == 'name'){
      this.searchForm = new FormGroup({
        searchOption: new FormControl(_option,[Validators.required]),
        searchText: new FormControl(this._searchPatient().searchValue, [Validators.required]),
        searchCid: new FormControl(''),
        searchDate: new FormControl('')
      });
    }else if(_option == 'date'){
      this.searchForm = new FormGroup({
        searchOption: new FormControl(_option,[Validators.required]),
        searchText: new FormControl(''),
        searchCid: new FormControl(''),
        searchDate: new FormControl(this._searchPatient().searchValue, [Validators.required])
      });
    }else{
      this.searchForm = new FormGroup({
        searchOption: new FormControl(_option,[Validators.required]),
        searchText: new FormControl(''),
        searchCid: new FormControl(this._searchPatient().searchValue, [Validators.required]),
        searchDate: new FormControl('')
      });
    }

  }

  async ngOnInit()  {
    // this.initForm();
    this.userId = await this._authService.getUserId();
    setTimeout(() => {
      // console.log('isloading false ...')
      // console.log('isloading false ...')
      this.isLoading = false;
    },2000)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updatePatient(row:any){
    this.onMessageChange();
    // const _patient = this.formPatient();

    this.formPatient.update((_patient) => ({
      ..._patient,
      action:"update",
      patient_cid: row.patient_cid,
      patient_created: row.patient_created,
      patient_fname: row.patient_fname,
      patient_id: row.patient_id,
      patient_lname: row.patient_lname,
      patient_no: row.patient_no,
      patient_tel: row.patient_tel,
      patient_title: row.patient_title
    }))

    // console.log('update >>>', this.formPatient())
    const rowPatient:any = this.formPatient();
    this.formChange.emit(rowPatient);
  }

  copyPatient(row:any){
    this.onMessageChange();

    this.formPatient.set({
      ...this.formPatient,
      action:"copy",
      patient_cid: row.patient_cid,
      patient_created: row.patient_created,
      patient_fname: row.patient_fname,
      patient_id: row.patient_id,
      patient_lname: row.patient_lname,
      patient_no: row.patient_no,
      patient_tel: row.patient_tel,
      patient_title: row.patient_title
    })

    // console.log('copy >>>', this.formPatient());
    const rowPatient:any = this.formPatient();
    this.formChange.emit(rowPatient);
  }


  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
  }

  openSide(){
    this.sideCreate.set(true);
  }



  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }

  onSearch() {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      // console.log('Search triggered with:', formValue);
      let _searchOption =this.searchForm.value.searchOption;
      let _searchText =this.searchForm.value.searchText;
      let _searchCid =this.searchForm.value.searchCid;
      let _searchDate = this.searchForm.value.searchDate != ''? moment(this.searchForm.value.searchDate).add('year', (-543)).format("YYYY-MM-DD") : '';

      if(_searchOption == 'name'){
        // console.log(_searchOption)
        // this._patientServie.readPatientSearchName(_searchText);
        const _formSearch:any = {
          searchOption:_searchOption,
          searchValue:_searchText
        }
        this.formChangeSearch.emit(_formSearch);
        // this.fetchDataSearchName(_searchText);
      }else if(_searchOption == 'cid'){
        // this.fetchDataSearchCid(_searchCid);
        const _formSearch:any = {
          searchOption:_searchOption,
          searchValue:_searchCid
        }
        this.formChangeSearch.emit(_formSearch)
      }else{
        // this.fetchDataSearchDate(_searchDate);
        const _formSearch:any = {
          searchOption:_searchOption,
          searchValue:_searchDate
        }
        this.formChangeSearch.emit(_formSearch)
      }
    }
  }

  async fetchDataSearchName(name:string) {
    try {
      this.isLoading = true;
      const result:any = await this._patientServie.readPatientSearchName(name);
      this.dataSource.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.isLoading = false;
      throw error;
    } finally {
      // console.log('Loading success....');
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);

    }
  }


  async fetchDataSearchCid(cid:string) {
    try {
      this.isLoading = true;
      const result:any = await this._patientServie.readPatientSearchCid(cid);
      this.dataSource.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.isLoading = false;
      throw error;
    } finally {
      // console.log('Loading success....');
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);

    }
  }

  async fetchDataSearchDate(date:string) {
    try {
      this.isLoading = true;
      const result:any = await this._patientServie.readPatientSearchDate(date);
      this.dataSource.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.isLoading = false;
      throw error;
    } finally {
      // console.log('Loading success....');
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);

    }
  }

  onClear() {
    // this.searchForm.reset();

    this.initForm();
    this.dataSource.data = [];
    // this.isLoading = false;
    this.messageChange.emit('reset');
  }

   // Method to handle the selection change event
   onSelectionChange(event: MatSelectChange) {
    const _selectValue = event.value;
    // console.log('Selected value:', _selectValue);
    // You can add more logic here if needed
    if(_selectValue == 'cid'){

      this.searchForm.controls["searchCid"].setValidators([Validators.pattern(/^[0-9]{13}$/)]);
      this.searchForm.get('searchText')?.setValue('');
      this.searchForm.controls["searchText"].clearValidators();
      this.searchForm.get('searchDate')?.setValue('');
      this.searchForm.controls["searchDate"].clearValidators();
      // searchCid: new FormControl('',[Validators.pattern(/^[0-9]{13}$/)]),
    }else if(_selectValue == 'date'){
      this.searchForm.controls["searchDate"].setValidators([
        Validators.required,
      ]);
      this.searchForm.get('searchCid')?.setValue('');
      this.searchForm.controls["searchCid"].clearValidators();
      this.searchForm.get('searchText')?.setValue('');
      this.searchForm.controls["searchText"].clearValidators();

    }else{
      this.searchForm.controls["searchText"].setValidators([
        Validators.required,
      ]);

      this.searchForm.get('searchCid')?.setValue('');
      this.searchForm.controls["searchCid"].clearValidators();
      this.searchForm.get('searchDate')?.setValue('');
      this.searchForm.controls["searchDate"].clearValidators();
    }

    this.searchForm.controls["searchText"].updateValueAndValidity();
    this.searchForm.controls["searchCid"].updateValueAndValidity();
    this.searchForm.controls["searchDate"].updateValueAndValidity();

  }
}
