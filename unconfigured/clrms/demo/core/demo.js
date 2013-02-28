
RemoteModule.prototype.Demo = function( clrmPackage, clrmAPI ){

    console.log('>> Declaring private variables...');
    // Private variables.
    var that = this,
        smallWindowSpecs = {
            width: 150,
            height: 150,
            location: 'no',
            status: 'no',
            toolbar: 'no',
            resizable: 'yes'
        },
        mediumWindowSpecs = {
            width: 300,
            height: 300,
            location: 'no',
            status: 'no',
            toolbar: 'no',
            resizable: 'yes'
        },
        elm,
        openWindows = {};


    console.log('>> Declaring private functions...');

    // Private function declarations.
    var initializeWindow, init, onWindowUnload, printToWindows, 
        addActivityListeners;

    console.log('>> Declaring public variables...');
    // Public variables.
    this.smallWindowID = 'smallDemo', this.mediumWindowID = 'mediumDemo';

    console.log('>> Declaring public functions...');
    // Public function declarations.
    this.init, this.launchMediumWindow, this.launchSmallWindow, this.unload;

    // Private function definitions.

    /**
     * Initializes a demo window, including giving it access to the current
     * demo instance.
     * 
     * @param {Window} win  A reference to the demo window.
     */
    initializeWindow = function(win){
        win.demoBackend = that;
        win.init();
        win.focus();
        openWindows[win.name] = win;
        win.addEventListener('unload', onWindowUnload);
    };

    /**
     * Removes a window's entry from the openWindows list.
     */
    onWindowUnload = function(event){
        console.log('>> in onWindowUnload');
        delete openWindows[event.currentTarget.name];
    }

    /**
     * Initializes things.
     */
    init = function(){
        // Add a new element to the current window. The demo windows, when they
        // come to life, can communicate with us through that element.
        elm = jQuery('<div id="demo"></div>').appendTo('body');
        elm.on('load.window.demo', function(event, win){
            initializeWindow(win);
        });
        addActivityListeners();
    };

    /**
     * Adds listeners for user activities. This will cause those events to be
     * printed to the body of any open Demo window.
     */
    addActivityListeners = function(){
        console.log('Adding activity listeners');
        var eventToMessage = function(eventName, eventData){
            console.log('Heard back!: '+ eventName +', '+ 
                JSON.stringify(eventData));
            printToWindows(eventName +': '+ JSON.stringify(eventData));
        };

        clrmAPI.user.realTime.addActivityListeners({
            'query-entered': eventToMessage,
            'page-loaded': eventToMessage,
            'link-clicked': eventToMessage,
            'page-focused': eventToMessage
        });
    }

    /**
     * Prints the given message to every open Demo window.
     *
     * @param {string} message  The message to display.
     */
    printToWindows = function(message){
        var winName;
        for(winName in openWindows){
            openWindows[winName].jQuery('#messages').
                append('<div>'+ message +'</div>');
        };
    };

    // Public function definitions.

    /**
     * Launches a medium Demo window. If the window already exists, then it is 
     * brought into focus.
     */
    this.launchMediumWindow = function(){ 
        clrmAPI.ui.openWindow({
            content: clrmPackage.html['demo.html'],
            resources: clrmPackage,
            name: that.mediumWindowID,
            specsMap: mediumWindowSpecs
        });
    };

    /**
     * Launches a small Demo window. If the window already exists, then it is 
     * brought into focus.
     */
    this.launchSmallWindow = function(){ 
        clrmAPI.ui.openWindow({
            content: clrmPackage.html['demo.html'],
            resources: clrmPackage,
            name: that.smallWindowID,
            specsMap: smallWindowSpecs
        });
    };

    /**
     * Removes all listeners and closes windows.
     */
    this.unload = function(oncomplete){
        var id;
        elm.off('load.demo');
        elm.remove();
        for( id in openWindows ){
            openWindows[id].close();
        }
        oncomplete();
    };



    // Initialize things.
    init();
};