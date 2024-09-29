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
import { AuthService } from '@core/services/auth.service';

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

  constructor(private _snackBar: MatSnackBar, private router: Router,private _authService:AuthService ) {}

  ngOnInit(): void {
    this.initForm();
  }

  async onSubmit() {
    if (this.formInitial.valid) {
      // Handle form submission
      try {
        const username = this.formInitial.controls['username'].value;
        const password = this.formInitial.controls['password'].value;

        const result = await this._authService.loginUser(username,password);

        if (typeof result === 'number') {
          let _userId = String(result);
          sessionStorage.setItem('authToken', _userId);
          this._snackBar.open(`ยินดีต้อนรับเข้าสู่ระบบ`, '', {
            duration:1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['success-snackbar']
          }).afterDismissed().subscribe(() => {
            this.router.navigate(['dashboard']);
          });
        } else {
          this._snackBar.open('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง', 'ลองอีกครั้ง', {
            duration:3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass:['error-snackbar']
          }).onAction().subscribe(() => {
            // Handle the action button click here
            this.initForm();
          });
        }
      } catch (error: any) {
        console.error(error);
        this._snackBar.open('การเข้าสู่ระบบผิดพลาด', 'ลองอีกครั้ง', {
          duration:3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass:['error-snackbar']
        }).onAction().subscribe(() => {
          // Handle the action button click here
          this.initForm();
        });
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

}
