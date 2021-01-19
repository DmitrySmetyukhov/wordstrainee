import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _user: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private _afAuth: AngularFireAuth,
        private router: Router
    ) {
    }

    facebookAuth() {
        return this.authLogin(new auth.FacebookAuthProvider());
    }

    authLogin(provider) {
        return this._afAuth
            .signInWithPopup(provider)
            .then((result) => {
                console.log(result, 'res');
                this.router.navigateByUrl('');
            })
            .catch((error) => {
                console.log(error, 'err**');
            });
    }
}
