import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

export interface Category {
    id?: string;
    name: string;
}

export interface Word {
    id?: string;
    categoryId: string;
    origin: string;
    translation: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _words: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    private _categories: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    private _user;

    constructor(
        private firestore: AngularFirestore,
        private _authService: AuthService
    ) {
        this._authService.user$.pipe(
            tap(userInfo => {
                this._user = userInfo;
                if (!userInfo) {
                    this._categories.next([]);
                    this._words.next([]);
                }
            }),
            filter(x => !!x),
            switchMap(() => firestore.collection('users').doc(this._user.uid).collection('categories').snapshotChanges()),
            tap(snapshot => this._categories.next(snapshot)),
            switchMap(() => firestore.collection('users').doc(this._user.uid).collection('words').snapshotChanges()),
            tap((snap) => this._words.next(snap))
        ).subscribe();
    }

    public get words$() {
        return this._words.asObservable().pipe(
            map((snapshot) => {
                return snapshot.map(item => {
                    const data: any = item.payload.doc.data();
                    return {
                        id: item.payload.doc.id,
                        ...data
                    };
                });
            }),
            map(list => {
                return list.map(item => {
                    return {...item};
                });
            }));
    }

    public get categories$() {
        return this._categories.asObservable().pipe(
            map((snapshot) => {
                return snapshot.map(item => {
                    const data: any = item.payload.doc.data();
                    return {
                        id: item.payload.doc.id,
                        ...data
                    };
                });
            }),
            map(list => {
                return list.map(item => {
                    return {...item};
                });
            }));
    }

    public addCategory(category: Category) {
        return this.firestore.collection('users').doc(this._user.uid).collection('categories').add(category);
    }

    public updateCategory(id: string, update: Category) {
        return this.firestore.collection('users').doc(this._user.uid).collection('categories').doc(id).set(update);
    }

    public deleteCategory(id: string) {
        return this.firestore.collection('users').doc(this._user.uid).collection('categories').doc(id).delete();
    }

    public addWord(word: Word) {
        return this.firestore.collection('users').doc(this._user.uid).collection('words').add(word);
    }

    public deleteWord(id: string) {
        return this.firestore.collection('users').doc(this._user.uid).collection('words').doc(id).delete();
    }

    public updateWord(id: string, update: Word) {
        return this.firestore.collection('users').doc(this._user.uid).collection('words').doc(id).set(update);
    }
}
