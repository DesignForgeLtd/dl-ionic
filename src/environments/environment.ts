// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseURL: 'http://dl-api.devel',
  webSocketURL: 'ws://localhost:443/'
};

export const googleOAuth = {
  clientId: '1053696124194-9le4tbck8ka8ahhuokt84431u7hi48dd.apps.googleusercontent.com',
  clientSecret: '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'
};

export const facebookOAuth = {
  appId: '5857097207741607',
  appSecret: 'd29abd9f64f66794849982ecb54680dd'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
