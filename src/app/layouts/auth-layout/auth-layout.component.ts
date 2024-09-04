import { Component, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone:true,
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  imports:[
    RouterModule,
    
  ]

})
export class AuthLayoutComponent {}
