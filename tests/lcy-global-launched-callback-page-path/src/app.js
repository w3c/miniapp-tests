/**
 * app.js 
 * This script contains the basic service logic of the MiniApp and 
 * includes the essential configuration and control of the MiniApp 
 * lifecycle, including the management of events for launching, 
 * showing, and hiding the MiniApp.
 */


const globalLaunchedCallback = function(inputObject) {
}

const globalShownCallback = function(inputObject) {
  console.log(`<${inputObject.pagePath}> must be equal to <pages/home/home>`);
  if (inputObject.pagePath === 'pages/home/home') {
    console.log('TEST PASSED')
  } else {
    console.warn('TEST FAILED')
  }
}

const globalHiddenCallback = function() {
}

const globalErrorCallback = function(lifecycleError) {
}

const state = global.getGlobalState (
  globalLaunchedCallback,
  globalShownCallback,
  globalHiddenCallback,
  globalErrorCallback
);

