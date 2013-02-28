/**
 * @fileOverview <p>Provides the base CrowdLogger Remote Modules (CRMs)-side 
 * interface (CRMI) for CRMs.</p>
 *
 * %%VERSION%%
 * 
 * @author hfeild
 * @version %%VERSION%%
 */

/**
 * Provides the base CrowdLogger Remote Modules (CRMs)-side interface (CRMI) for
 * CRMs. This includes sending messages to the CrowdLogger-side Interface (CLI).
 */
var CLRMIBaseAPI = function(api) { 
    // Private variables.
    var that = this,
        messageHandlers = {
            //alert: function(data){ alert(data.message); }
            clrmiCallback: invokeCLRMICallback
        },
        modules = {},
        useSandbox = false,
        functionMap = {},
        nextFunctionID = 0;
        
    // Private function declarations.
    var init, extractData, onMessage, setExtensionPath, loadCLRM, 
        invokeCLRMICallback;

    // Public function declarations.
    this.postMessage, this.log, this.invokeCLIFunction;

    // Private function definitions.
    /**
     * Initializes things, including placing listeners to communicate with
     * the CLI.
     */
    init = function(){
        console.log('Initializing CLRMIBaseAPI.\n');
        messageHandlers.loadCLRM = loadCLRM;
        messageHandlers.setExtensionPath = setExtensionPath;
        jQuery(window).bind( 'message', onMessage );

        // Ask CLI for the extension path so we can open CrowdLogger pages.
        that.sendMessage({command:'getExtensionPath'})
    };

    /**
     * Extracts data from a message event.
     *
     * @param {DOMEvent} The postMessage event.
     * @return The data passed via postMessage.
     */
    extractData = function(event){ 
        if( event.data ){
            return event.data;
        } else {
            return event.originalEvent.data; 
        }
    };

    /**
     * Called via the CLRMI; At a minimum, the event object must consist of
     * a command field.
     *
     * @param {object} event An event. Should have a data field. Within the data
     *                       object, there must be a command field.
     */
    onMessage = function(event){
        var data = extractData(event);
        // if( !data.from || data.from !== 'CLRMI' ){
        //     //that.log('CLRMI received a message: '+ JSON.stringify(data));
        // }
        //alert('CLRMI received a message: '+ JSON.stringify(data));
        var command = data.command;
        if( data.from === 'CLI' && messageHandlers[command] ){
            setTimeout(function(){messageHandlers[command](data);}, 2);
        }
    };

    /**
     * Sets the path of the extension so we can load any local files when
     * necessary. This is called from the CLI, so the path is wrapped up in
     * a data object.
     * 
     * @param {object} data  An object that should contain the key 
     *                       'extensionPath' with a string value.
     */
    setExtensionPath = function(data){
        if( data.extensionPath ){
            api.extensionPath = data.extensionPath;
        }
    }

    /**
     * Loads a CrowdLogger Remote Module. 
     *
     * @param {string} script   The JavaScript module.
     */
    loadCLRM = function(data){
        console.log('Loading CLRM');
        var clrm = new CLRM(JSON.parse(data.package), api.API);

        // Wrapping this in a function in case we need to unload an existing
        // version of the module, and therefore need to call load after the
        // unloading has occurred.
        var load = function(){
            modules[clrm.module.id] = clrm.module;
            clrm.module.init();
            that.log('Module '+ clrm.module.id +' loaded!');
        };

        // Check if it already exists. If so, unload the previous version.
        if( modules[clrm.module.id] ){
            try{
                that.log('Unloading module '+ clrm.module.id);
                modules[clrm.module.id].unload(load);
            } catch(e){
                load();
            }
        } else {
            load();
        }
    };

    /**
     * Invokes a CLRMI callback function. Invocations of this should stem from a
     * call to sendMessage from the CLI side. The function will be passed the
     * given parameters in addition to the id of the callback so that the
     * callback can unregister it if needbe.
     *
     * @param {object} params      A map of options:
     * REQUIRED:
     * <ul>
     *    <li>{int} callbackID     The id of the callback to invoke.
     * </ul>
     * OPTIONAL:
     * <ul>
     *    <li>{anything} options       The options to send to the function.
     * </ul>
     */
    invokeCLRMICallback = function(params){
        if( !params || params.callbackID === undefined ){
            throw new Exception('clrmi.invokeCLRMICallback requires at least '+
                'a callback field in the parameters map.');
            return false;
        }

        if( !functionMap[params.callbackID] ){
            throw new Exception('clrmi.invokeCLRMICallback cannot find a '+
                'callback function with the id "'+ params.callbackID +'"!');
            return false;
        }

        setTimeout(function(){ 
            functionMap[params.callbackID](params.options, params.callbackID);
        }, 20);

        return true;
    };

    // Public function definitions.

    /**
     * Sends a message to the CLI.
     */
    this.sendMessage = function(message){
        console.log('CLRMI sending a message: '+ JSON.stringify(message) +'\n');

        message.from = 'CLRMI';
        parent.postMessage(message, '*');
    };

    /**
     * Logs a message (should spit out in the console).
     * 
     * @param {string} message  The message to log.
     */
    this.log = function(message){
        that.sendMessage({
            command: 'log', 
            message: message
        });
    }

    /**
     * Invokes a CLI function. Since functions can't cross the postMessage
     * divide, the given callback is saved in a map.
     *
     * @param {object} params     A map of parameters:
     * REQUIRED:
     * <ul>
     *    <li>{string} apiName         The name of the CLI API to access.
     *    <li>{string} functionName    The name of the function whtin apiName
     *                                 to invoke.
     * </ul>
     * OPTIONAL:
     * <ul>
     *    <li>{anything} options       The options to send to the function.
     *    <li>{function} callback      The function the CLI API should callback.
     * </ul>
     */
    this.invokeCLIFunction = function(params){
        //apiName, functionName, options, callback
        if( !params || !params.apiName || !params.functionName ){ 
            throw new Exception('clrmi.invokeCLIFunction requires at least '+
                'the apiName and functionName fields to be specified in the '+
                'parameter object');
            return false; 
        }
        var callbackID = null;
        var options = params.options || {};

        // Register the callback (if there is one).
        if( params.callback ){
            callbackID = that.registerCallback(params.callback);
        }

        that.sendMessage({
            command: 'cliRequest', 
            apiName: params.apiName,
            functionName: params.functionName,
            options: options,
            callbackID: callbackID
        })

        return callbackID;
    };

    /**
     * Messages the CLI to invoke a callback function.
     *
     * @param {object} params      A map of options:
     * REQUIRED:
     * <ul>
     *    <li>{int} callbackID     The id of the callback to invoke.
     * </ul>
     * OPTIONAL:
     * <ul>
     *    <li>{anything} options       The options to send to the function.
     * </ul>
     */
    this.invokeCLICallback = function(params){
        if( !params || params.callbackID === undefined ){
            throw new Exception('clrmi.invokeCLICallback requires at least a '+
                'callback field in the parameters map.');
            return false;
        }

        // Pack up the message.
        var message = {
            callbackID: params.callbackID,
            options: params.options,
            command: 'cliCallback'
        };

        // Send to the CLRMI.
        that.sendMessage(message);

        return true;
    };


    /**
     * Registers a callback. The resulting id can then be sent to the CLRMI
     * via the this.sendMessage.
     *
     * @param {function} callback     The callback to register.
     * @return {int} The callback id assigned to the given callback.
     */
    this.registerCallback = function(callback){
        var callbackID = nextFunctionID++;
        functionMap[callbackID] = callback;
        return callbackID;
    };

    /**
     * If the given callbackID exists in the registry, it is removed.
     *
     * @param {int} callbackID     The id of the function to unregister.
     */
    this.unregisterCallback = function(callbackID){
        if( functionMap[callbackID] ){
            delete functionMap[callbackID];
        }
    };

    init();
};

/**
 * A wrapper for a CLRM. Should be invoked with 'new'.
 *
 * @param {object} clrmPackage   The CLRM Package -- should contain subfields
 *                               such as 'module', 'html', 'js', 'css', and
 *                               'misc'.
 * @param {function} CrowdLoggerAPI  A reference to the CrowdLogger API -- this
 *                                   is how the CLRM will access the CLRMI.
 */
var CLRM = function(clrmPackage, CrowdLoggerAPI){
    console.log('clrmPackage.module: '+ clrmPackage.module);
    eval(clrmPackage.module);
    console.log('Evaluated the CLRM; RemoteModule: '+ RemoteModule);
    console.log(RemoteModule);
    // Every module should have a Module function defined.
    this.module = new RemoteModule(clrmPackage, new CrowdLoggerAPI());
    // Clear it out so no one else has access to it.
    RemoteModule = undefined;
};


