import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
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
    CommonModule
  ],

})

export default class DashboardListComponent{

  _data: any;
  sideCreate = signal(false);
  searchValue = "";
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
    // console.log(newMessage)
     this.messageChange.emit('open');
    //  this.sideCreate.set(true)
   }

  displayedColumns = ['hn','name','tel','last_date','actions'];

  // dataSource = UserData;
  dataSource = new MatTableDataSource<TPatient>();
  // dataSource!: MatTableDataSource<UserList>;

  constructor() {
    // this.dataSource = new MatTableDataSource(users);
  }

  async fetchData() {
    this.dataSource.data = this._data;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  clickedJob(row:any){
    console.log('Clicked Job', row.hn);
    this.onMessageChange();
    this.formChange.emit(row.hn);
  }

  onButtonClick(row: any, event: Event) {
    event.stopPropagation();
    // console.log('Button clicked: ', row);
  }

  openSide(){
    this.sideCreate.set(true);
  }


  clearSearch() {
    this.searchValue = "";
    this.searchTerm.next("");

    this.dataSource.filter = '';

  }


}
