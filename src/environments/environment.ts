// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    foodOrderingBaseApiUrl: 'http://localhost:8080/api',
    firebaseConfig: {
        apiKey: 'AIzaSyAZFFIuXkbgdp2F-Em4CK2z8kVJ2L4p_UU',
        authDomain: 'foodify-55954.firebaseapp.com',
        databaseURL: 'https://foodify-55954-default-rtdb.firebaseio.com/',
        projectId: 'foodify-55954',
        storageBucket: 'foodify-55954.appspot.com',
        messagingSenderId: '213676556381',
        appId: '1:213676556381:web:865bb2e949d708cae88db4',
        measurementId: 'G-TV0D4CW51W'
    },
    adminImg: 'https://firebasestorage.googleapis.com/v0/b/foodify-55954.appspot.com/o/Admin%2Ffooder.png?alt=media&token=2e24c25a-bbfb-4ceb-9e9b-bb47e348b6cf',
    userDefaultImg: 'https://firebasestorage.googleapis.com/v0/b/foodify-55954.appspot.com/o/Admin%2Fdefault-ava-01.png?alt=media&token=90202711-4b1a-4665-a941-a65bf6c2002e',
    shopDefaultImg: 'https://firebasestorage.googleapis.com/v0/b/foodify-55954.appspot.com/o/Admin%2Fdefault-shop-01.png?alt=media&token=2eb5629a-730b-4611-a564-05deb29c9217'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
