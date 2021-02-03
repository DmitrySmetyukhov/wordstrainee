import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private _pending = false;

    constructor(
        private _afAuth: AngularFireAuth,
        private router: Router,
        private _toastCtrl: ToastController
    ) {
        _afAuth.authState.subscribe(userInfo => {
            this._user.next(userInfo);
        });
    }

    get user$() {
        return this._user.asObservable();
    }

    get pending() {
        return this._pending;
    }

    facebookAuth() {
        return this.authLogin(new auth.FacebookAuthProvider());
    }

    authLogin(provider) {
        this._pending = true;
        this._afAuth
            .signInWithPopup(provider)
            .then(() => {
                this.router.navigateByUrl('');
            })
            .catch((error) => {
            }).finally(() => this._pending = false);
    }

    public loginManually(dto: { email: string, password: string }) {
        this._pending = true;
        this._afAuth
            .signInWithEmailAndPassword(dto.email, dto.password)
            .then(() => {
                this.router.navigateByUrl('');
            })
            .catch((e) => {
                this._presentToast(e.message);
            }).finally(() => this._pending = false);
    }

    async logout() {
        await this._afAuth.signOut();
        this.router.navigateByUrl('login');
    }

    private async _presentToast(message) {
        const toast = await this._toastCtrl.create({
            message,
            position: 'top',
            color: 'danger',
            duration: 4000
        });

        toast.present();
    }
}
