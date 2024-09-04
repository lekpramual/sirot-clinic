import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    RouterModule,
    MatSnackBarModule,
  ],
})
export class LoginComponent implements OnInit {
  hide = true;
  error: string | null = null;

  formInitial!: FormGroup;

  constructor(private _snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  async onSubmit() {
    if (this.formInitial.valid) {
      // Handle form submission
      try {
        const username = this.formInitial.controls['username'].value;
        const password = this.formInitial.controls['password'].value;
        if (username === 'admin' && password === 'abc123==') {
          localStorage.setItem('authToken', username);
          this.openSuccessSnackBar('ยินดีต้อนรับเข้าสู่ระบบ');
          this.router.navigate(['dashboard']);
        } else {
          this.openFailureSnackBar('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง');
        }
      } catch (error: any) {
        console.error(error);
        this.openFailureSnackBar('การเข้าสู่ระบบผิดพลาด');
      }
    }
  }

  initForm() {
    // choice_depart choice_stamp
    this.formInitial = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      app: new FormControl('123', [Validators.required]),
    });
  }

  onClickRegister() {
    this.router.navigate(['auth/register']);
  }

  // Snackbar that opens with success background
  openSuccessSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 1500,
      panelClass: ['success-snackbar'],
    });
  }
  //Snackbar that opens with failure background
  openFailureSnackBar(message: string) {
    this._snackBar.open(message, 'ลองเข้าระบบอีกครั้ง!', {
      duration: 10*6000,
      panelClass: ['error-snackbar'],
    }).onAction().subscribe(() => {
      // Handle the action button click here
      console.log('Snackbar action button clicked!');
      this.initForm();
    });
  }
}
