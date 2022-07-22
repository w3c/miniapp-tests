/**
 * app.js 
 * This script contains the basic service logic of the MiniApp and 
 * includes the essential configuration and control of the MiniApp 
 * lifecycle, including the management of events for launching, 
 * showing, and hiding the MiniApp.
 */


const globalLaunchedCallback = function(inputObject) {
  console.log(`<${inputObject.pagePath}> must be equal to <pages/home/home>`);
  console.log(`<${globalState}> must be equal to launched`);
  if (inputObject.pagePath === 'pages/home/home' && globalState === 'launched') {
    console.log('TEST PASSED')
  } else {
    console.warn('TEST FAILED')
  }
}

const globalShownCallback = function(inputObject) {
}

const globalHiddenCallback = function() {
}

const globalErrorCallback = function(lifecycleError) {
}

const globalState = global.getGlobalState (
  globalLaunchedCallback,
  globalShownCallback,
  globalHiddenCallback,
  globalErrorCallback
);



