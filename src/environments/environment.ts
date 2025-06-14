// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // GOOGLE MAP API KEY
  // LOADER_API_KEY: 'AIzaSyBMsWKVLawIc9JcDQBGZpdwGkIr2XXfmk8',
  api: 'http://localhost:3000/api',
  wsUrl: 'http://localhost:3000', // Updated WebSocket URL to match server port

  // Mercado Pago Configuration
  // MERCADOPAGO_PUBLIC_KEY: 'TEST-a363850c-18f9-4a25-8552-da8c34016b7d',
  // OUR_MP_CLIENT_ID: '444977579419473',
  // ACCESS_TOKEN: 'TEST-44497757941947-012917-5e99c6dc33b21b77449e3fc36f5378d-28493664',

  // URLs de redirección
  // MP_SUCCESS_URL: 'http://localhost:4200/admin/payments/success',
  // MP_FAILURE_URL: 'http://localhost:4200/admin/payments/failure',
  // MP_PENDING_URL: 'http://localhost:4200/admin/payments/pending',
  // MP_NOTIFICATION_URL: 'http://localhost:3000/api/mercado-pago/notifications',
  // MP_REDIRECT_URI: 'http://localhost:4200/admin/payments/callback',



  /* LUCA MP */
  mp: {
    OUR_MP_CLIENT_ID: '444977579419473',
    MP_URL: `https://auth.mercadopago.com.ar/authorization?client_id=OUR_MP_CLIENT_ID&response_type=code&platform_id=mp&state=RANDOM_ID&redirect_uri=http://localhost:4200/a/mp-oauth`,
    MP_URL_FRONT: 'https://api.mercadopago.com/oauth/token'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
