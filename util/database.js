import * as SQLite from 'expo-sqlite';
import { Place } from '../components/models/Place';

const database = SQLite.openDatabaseAsync('places.db');

export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL
                )`,
                (_, result) => {
                    console.log(result);
                    resolve(result);
                },
                (_, error) => {
                    reject(error)
                },
                [],
                () => {
                    resolve();
                },
                (_, error) => {
                    reject(error);
                }
            )
        });
    })
    return promise;
}

export function insertPlace(place) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`INSERT INTO places (title, imageUri, address, lat, lng) VALUES(?, ?, ?, ?, ?)`, 
                [place.title, place.imageUri, place.address, place.location.lat, place.location.lng]
            );
        })
    });
    return promise
}

export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places', 
                [],
                (_, result) => {
                    const places = []

                    for (const dp of result.rows._array) {
                        places.push(
                            new Place(
                                dp.title, 
                                dp.imageUri, 
                                {
                                    address: dp.address, 
                                    lat: dp.lat, 
                                    lng: dp.lng
                        }));
                    }
                    resolve(places);
                }, 
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchPlaceDetails(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.exeuteSql('SELECT * FROM places WHERE id = ?', 
                [id], 
                (_, result) => {
                    const dbPlace = result.rows._array[0];
                    const place = new Place(
                        dbPlace.title, 
                        dbPlace.imageUri, 
                        { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address}, 
                        dbPlace.id);
                    resolve(result.rows._array[0]);
                }, 
                (_, error) => {
                    reject(error);
                }
            )
        })
    });

    return promise
}