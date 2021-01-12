import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private firestore: AngularFirestore) {
        firestore.collection('words').snapshotChanges().subscribe(test => {
            console.log(test, 'test');
        });
    }
}
