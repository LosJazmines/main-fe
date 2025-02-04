  // This file can be replaced during build by using the `fileReplacements` array.
  // `ng build` replaces `environment.ts` with `environment.prod.ts`.
  // The list of file replacements can be found in `angular.json`.

  export const environment = {
    production: false,
    // GOOGLE MAP API KEY
    // LOADER_API_KEY: 'AIzaSyBMsWKVLawIc9JcDQBGZpdwGkIr2XXfmk8',
    api: 'http://localhost:3000/api',
    /* NAHUEL MP */
    // mp :{
    //   OUR_MP_CLIENT_ID: '3562869133871743',
    //   MP_URL: `https://auth.mercadopago.com.ar/authorization?client_id=OUR_MP_CLIENT_ID&response_type=code&platform_id=mp&state=RANDOM_ID&redirect_uri=https://titanesdelticket.com/o/mp-oauth`,
    //   MP_URL_FRONT: 'https://api.mercadopago.com/oauth/token'
    // }
  };

  /*
  * For easier debugging in development mode, you can import the following file
  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
  *
  * This import should be commented out in production mode because it will have a negative impact
  * on performance if an error is thrown.
  */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
