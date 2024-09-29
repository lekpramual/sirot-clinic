import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
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
import { Subject } from 'rxjs';
import { MatPaginator, MatPaginatorModule,MatPaginatorIntl } from "@angular/material/paginator";
import { getThaiPaginatorIntl } from '@core/components/thai-paginator-intl';
import { PhistoryServie } from '@core/services/phistory.service';
import { AuthService } from '@core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import 'moment/locale/th';

export interface PeriodicElement {
  name: string;
  type:string;
  type_id:number;
  equipment: string;
  in: string;
  out: string;
  date:string;
  time:string;
}

export interface UserList {
  emp_id:number;
  emp_code:string;
  emp_name:string;
  emp_tel:string;
  emp_date:string;

}

const users:UserList[] = [
  {emp_id:1,emp_code:'HN00001',emp_name:'นายทดสอบ ทดสอบ',emp_tel:'0832549551',emp_date:'23 ส.ค. 2567'},
  {emp_id:2,emp_code:'HN00002',emp_name:'นายทดสอบ2 ทดสอบ2',emp_tel:'0832512345',emp_date:'23 ส.ค. 2567'}
]


@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss',
  imports: [
    FormsModule,
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
    CommonModule
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getThaiPaginatorIntl() },
  ]

})

export default class DashboardListComponent{

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  _data: any;
  sideCreate = signal(false);
  searchValue = "";
  userId: any = "";
  searchTerm = new Subject<string>();

  @Input() set sideopen(val:boolean){
    this.sideCreate.set(val)
  }

  @Input() set tbData(val:any){
    // this._data = val;
    this.dataSource.data = val;
  }

   // Output property to send data back to the parent
   @Output() messageChange = new EventEmitter<string>();

   @Output() formChange = new EventEmitter<[]>();


   // Method to handle changes and emit the new value
   onMessageChange() {

     this.messageChange.emit('open');
    //  this.sideCreate.set(true)
   }

  displayedColumns = ['hn','name','tel','last_date','actions'];

  // dataSource = UserData;
  dataSource = new MatTableDataSource<TPatient>();
  // dataSource!: MatTableDataSource<UserList>;

  constructor(private _authService:AuthService,private _phistoryServie: PhistoryServie,private _snackBar: MatSnackBar) {
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
  }

  async ngOnInit() {
    // this.initForm();
    this.userId = await this._authService.getUserId();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async fetchData() {
    this.dataSource.data = this._data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  clickedJob(row:any){
    this.onMessageChange();
    this.formChange.emit(row.hn);
  }

  async btnPhistory(hn:string) {
    try {

      let _userId:number = parseInt(this.userId);


      if(_userId > 0){
        const result = await this._phistoryServie.createPhistory(hn,_userId);
          if(result === 'ok'){
            this._snackBar.open(`ส่งตรวจข้อมูลเรียบร้อย`, '', {
              duration:1500,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass:['success-snackbar']
            }).afterDismissed().subscribe(() => {
              this.messageChange.emit('reset');
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

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
  }

  openSide(){
    this.sideCreate.set(true);
  }


  clearSearch() {
    this.searchValue = "";
    this.searchTerm.next("");

    this.dataSource.filter = '';

  }
  //ฟังก์ชั่น: ปีภาษาไทย
  formatDateThai(date: Date): string {
    // return moment(date).format("LL"); // Customize the format as needed
    return moment(date).format("ll"); // Customize the format as needed
  }


}
