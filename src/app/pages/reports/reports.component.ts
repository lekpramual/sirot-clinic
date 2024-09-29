import { Component, WritableSignal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportEmpFormSearchComponent } from './report-emp-form-search/report-emp-form-search.component';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-reports',
  standalone:true,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  imports:[
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    ReportEmpFormSearchComponent
  ]
})
export default class ReportsComponent {



}
