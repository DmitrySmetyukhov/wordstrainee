import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

export interface Category {
    id?: string;
    name: string;
    createdAt?: Date;
}

export interface Word {
    id?: string;
    categoryId: string;
    origin: string;
    translation: string;
    createdAt?: Date;
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
        private _afAuth: AngularFireAuth,
    ) {
        _afAuth.authState.pipe(
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
            map((snapshot) => this._transform(snapshot)),
            map(list => {
                return list.map(item => {
                    return {...item};
                });
            }));
    }

    public get categories$() {
        return this._categories.asObservable().pipe(
            map((snapshot) => this._transform(snapshot)),
            map(list => {
                return list.map(item => {
                    return {...item};
                });
            }),
            map(list => this._sortItemsByDate(list))
        );
    }

    public addCategory(category: Category) {
        category.createdAt = new Date();
        return this.firestore.collection('users').doc(this._user.uid).collection('categories').add(category);
    }

    public updateCategory(id: string, update: Category) {
        return this.firestore.collection('users').doc(this._user.uid).collection('categories').doc(id).set(update);
    }

    public deleteCategory(id: string) {
        return this.firestore.collection('users').doc(this._user.uid).collection('categories').doc(id).delete();
    }

    public addWord(word: Word) {
        word.createdAt = new Date();
        return this.firestore.collection('users').doc(this._user.uid).collection('words').add(word);
    }

    public deleteWord(id: string) {
        return this.firestore.collection('users').doc(this._user.uid).collection('words').doc(id).delete();
    }

    public updateWord(id: string, update: Word) {
        return this.firestore.collection('users').doc(this._user.uid).collection('words').doc(id).set(update);
    }

    private _transform(snapshot) {
        return snapshot.map(item => {
            const data: any = item.payload.doc.data();
            return {
                id: item.payload.doc.id,
                ...data
            };
        });
    }

    private _sortItemsByDate(list: Category[]) {
        return list.sort((a, b) =>
            a.createdAt < b.createdAt ? 1 : -1
        );
    }
}
