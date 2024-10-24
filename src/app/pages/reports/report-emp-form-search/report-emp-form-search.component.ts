import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  WritableSignal,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { Observable, map, startWith } from 'rxjs';

import {
  MatDatepickerInputEvent,
  MatDatepickerIntl,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatMomentDateModule,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';


import moment from 'moment';
import 'moment/locale/th'; // Import Thai locale

import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpFormSearch } from '@core/interfaces/reports.interface';
import { MY_FORMATS } from '@core/components/custom-date-format';
import { ReportServie } from '@core/services/report.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


// Set locale globally
moment.locale('th');

@Component({
  selector: 'app-report-emp-form-search',
  standalone: true,
  templateUrl: './report-emp-form-search.component.html',
  styleUrl: './report-emp-form-search.component.scss',
  imports: [
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
    MatDatepickerModule,
    MatMomentDateModule,
    MatTableModule
  ],
  // providers: [provideNativeDateAdapter(),{ provide: MAT_DATE_LOCALE, useValue: "th-TH" },provideMomentDateAdapter(MY_DATE_FORMATS)],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, // Provide custom date formats
    { provide: MAT_DATE_LOCALE, useValue: 'th' }, // Set the locale to Thai
  ],
})
export class ReportEmpFormSearchComponent implements OnInit {
  report:any;
  formDataSignal: WritableSignal<EmpFormSearch> = signal({
    emp_start: '',
    emp_end: ''
  });

  accessibleId: string = '';
  currentDate = new Date();
  formGroupData!: FormGroup;

  filteredOptions!: Observable<any[]>;

  displayedColumns: string[] = ['name','tel','date','time'];
  dataSource:any = [];

  // date max min
  maxDate!: Date;
  minDate!: Date;

  constructor(private _snackBar: MatSnackBar,private reportServie: ReportServie) {
    // moment.locale('th');

    // Override the Thai locale to display Buddhist Era year (Thai year)
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

  ngOnInit(): void {
    // this.accessibleId = '';
    this.initForm();
  }

  async onSubmit() {

    if (this.formGroupData.valid) {
      // Handle form submission
      try {
        let emp_start = moment(this.formGroupData.value.emp_start).add(-543, "year").format('YYYY-MM-DD');
        let emp_end = moment(this.formGroupData.value.emp_end).add(-543, "year").format('YYYY-MM-DD');


        const response = await this.reportServie.readReportByDate(emp_start,emp_end);

        this.dataSource = response;

      } catch (error: any) {
        // Handle error during form submission
        console.error(error);


        this._snackBar.open('มีข้อผิดพลาด...', 'ลองอีกครั้ง', {
          duration:3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['error-snackbar']
        });
      }
    }
  }


  initForm() {
    // choice_depart choice_stamp
    this.formGroupData = new FormGroup({
      emp_start: new FormControl(this.currentDate, [Validators.required]),
      emp_end: new FormControl(this.currentDate, [Validators.required])
    });
  }

  async fetchPhistoryData(begin:string, end:string) {

    let response: any;
    try {
      response = await this.reportServie.readReportByDate(begin,end);

      // this.dataSource.data = response.result;
      this.report = response;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      // console.log('Loading success....');
    }

    this.dataSource = response;
  }

   //ฟังก์ชั่น: ปีภาษาไทย
   formatDate(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }
}
