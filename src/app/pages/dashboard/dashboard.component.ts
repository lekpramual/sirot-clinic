import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports:[
    MatCardModule
  ]

})
export default  class DashboardComponent {


}
