# jasmine-slow.js
jasmine-slow.js is a utility library to help track down long running jasmine specs. The library works by taking a snapshot of the current time a test starts and when it ends. If the interval is higher than the threshold, you will see a message in the console describing the test and how long it took.

##Usage
To begin using jasmine-slow, you need to copy the source file to your jasmine helpers folder.

Use the following to enable jasmine-slow:

    jasmine.slow.enable(); // uses default time threshold
    
By default jasmine-slow will notify you of any spec that takes longer than 75ms, but you can configure this by passing an integer to the enable method.

    jasmine.slow.enable(150); // sets the threshold to 150ms
    
You can also programmatically disable logging using the disable method

    jasmine.slow.disable(); // No more slow logging
    
It's as simple as that. Now get busy speeding up your test suite!

##Output
    spec #385 took 61ms: when the popup is visible when clicking outside the view it should remove the view
    spec #386 took 64ms: when clicking outside the view when a onHide callback is passed in the options it should call the onHide callback
	spec #387 took 62ms: when the popup is visible when clicking a close button it should remove the view
	spec #388 took 59ms: when clicking a close button when a onHide callback is passed in the options it should call the onHide callback
	spec #389 took 74ms: when the popup is visible when closing and re-opening the popup it should render a new instance of the view