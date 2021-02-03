import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: FormGroup;

    constructor(private _authService: AuthService, private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this._fb.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(20)]],
            password: ['', [Validators.required]]
        });
    }

    get pending() {
        return this._authService.pending;
    }

    fbLogin() {
        this._authService.facebookAuth();
    }

    login() {
        if (!this.form.valid || this.pending) {
            return;
        }
        this._authService.loginManually(this.form.value);
    }
}
