import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  hidePwd: boolean = true;
  submitted: boolean = false;
  message: string;
  fAction: string;

  constructor(
    private router: Router,
    public auth: AuthService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  set action(value: string) {
    this.fAction = value;

    const emailVal = this.fAction === 'changePwd' ? this.auth.email : null;

    this.form = new FormGroup({
      email: new FormControl(emailVal, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.message = '';
      if (params['action']) {
        this.action = params['action'];
      } else if (params['message']) {
        this.message = params['message'];
      } else {
        this.action = 'login';
      }
    });
  }

  getEmailErrorMessage() {
    if (this.form.get('email')!.hasError('required')) {
      return 'You must enter a value';
    }

    return this.form.get('email')!.hasError('email') ? 'Not a valid email' : '';
  }

  getPwdErrorMessage() {
    if (this.form.get('password')!.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.form.get('password')!.hasError('minlength')) {
      const error = this.form.get('password')!.errors?.minlength;

      return `Password length must be >= ${error.requiredLength} symbols. Actual ${error.actualLength} symbols`;
    }
    return '';
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    if (this.fAction === 'login') {
      this.auth.login(user).subscribe(
        () => {
          this.form.reset();
          this.router.navigate(['/']);
          this.submitted = false;
        },
        () => {
          this.submitted = false;
        }
      );
    } else if (this.fAction === 'create') {
      this.auth.signUp(user).subscribe(
        () => {
          this.form.reset();
          this.router.navigate(['/']);
          this.submitted = false;
          this._snackBar.open('Account Created', 'Close', { duration: 5000 });
        },
        () => {
          this.submitted = false;
        }
      );
    } else if (this.fAction === 'changePwd') {
      this.auth.changePassword(user.password).subscribe(
        () => {
          this.form.reset();
          this.router.navigate(['/']);
          this.submitted = false;
          this._snackBar.open('Password Changed', 'Close', { duration: 5000 });
        },
        () => {
          this.submitted = false;
        }
      );
    }
  }
}
