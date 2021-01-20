import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
    test = '';
    userName = '';
    private _subscription = new Subscription();

    constructor(private _authService: AuthService) {
    }

    ngOnInit() {
        this._subscription.add(this._authService.user$.subscribe(user => this.userName = user?.displayName));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    logout() {
        this._authService.logout();
    }

}
