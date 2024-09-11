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
import { Subject } from 'rxjs';


import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { TUser } from '@core/interfaces/user.interfaces';


@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
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

export default class UserListComponent{

  data: any;

  sideCreate = signal(false);
  searchValue = "";
  searchTerm = new Subject<string>();

  @Input() set sideopen(val:boolean){
    this.sideCreate.set(val)
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

  displayedColumns = ['user_code','user_fullname','user_position',  'user_status','actions'];

  dataSource = new MatTableDataSource<TUser>();

  constructor() {
    // this.dataSource = new MatTableDataSource(users);


    this.fetchData();
    this.minimizeWindow();
  }


  async fetchData() {
    try {
      const result = await invoke('read_users');
      console.log('Data fetched from database:', result);
      this.data = result;
      // return this.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      console.log('Loading success....')
    }

    this.dataSource.data = this.data;
  }

  async minimizeWindow() {
    try {
      await appWindow.minimize();
    } catch (error) {
      console.error('Error minimizing window:', error);
    }
  }

  // async getApi(){
  //   invoke('greet', { name: 'World' })
  //   // `invoke` returns a Promise
  //   .then((response) => console.log(response))
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  clickedJob(row:any){
    console.log('Clicked Job', row.user_id);
    this.onMessageChange();
    this.formChange.emit(row.user_id);
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
