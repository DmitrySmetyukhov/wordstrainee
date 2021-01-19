import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    constructor(private _authService: AuthService) {
    }

    ngOnInit() {
    }

    fbLogin() {
        this._authService.facebookAuth();
    }

}
