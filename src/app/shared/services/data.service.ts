import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export interface Category {
    id?: string;
    name: string;
}

export interface Word {
    id: string;
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

    public deleteCategory(id: string) {
        return this.firestore.collection('categories').doc(id).delete();
    }
}
