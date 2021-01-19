import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

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

    constructor(private firestore: AngularFirestore) {
        firestore.collection('words').snapshotChanges()
            .pipe(
                tap(snapshot => {
                    const transformedData: any[] = snapshot.map(item => {
                        const data: any = item.payload.doc.data();
                        return {
                            id: item.payload.doc.id,
                            ...data
                        };
                    });

                    this._words.next(transformedData);
                })
            )

            .subscribe();

        firestore.collection('categories').snapshotChanges()
            .pipe(
                tap(snapshot => {
                    const transformedData: any[] = snapshot.map(item => {
                        const data: any = item.payload.doc.data();
                        return {
                            id: item.payload.doc.id,
                            ...data
                        };
                    });

                    this._categories.next(transformedData);
                })
            )

            .subscribe();

        firestore.collection('users').doc('ds').collection('categories').snapshotChanges().subscribe(snap => {
            console.log(snap, 'snap');
        });
    }

    public get words$() {
        return this._words.asObservable().pipe(
            map(list => {
                return list.map(item => {
                    return {...item};
                });
            }));
    }

    public get categories$() {
        return this._categories.asObservable().pipe(
            map(list => {
                return list.map(item => {
                    return {...item};
                });
            }));
    }

    public addCategory(category: Category) {
        return this.firestore.collection('categories').add(category);
    }

    public updateCategory(id: string, update: Category) {
        return this.firestore.collection('categories').doc(id).set(update);
    }

    public deleteCategory(id: string) {
        return this.firestore.collection('categories').doc(id).delete();
    }

    public addWord(word: Word) {
        return this.firestore.collection('words').add(word);
    }

    public deleteWord(id: string) {
        return this.firestore.collection('words').doc(id).delete();
    }

    public updateWord(id: string, update: Word) {
        return this.firestore.collection('words').doc(id).set(update);
    }
}
