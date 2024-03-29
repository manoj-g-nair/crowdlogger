/**
 * @fileOverview Handles setting preference defaults. This includes resetting
 * preferences whose default value has changed because of an update and is 
 * specifically listed as a preference that should be overwritten.<p>
 * 
 * See the  CROWDLOGGER.preferences.defaults namespace.<p>
 * 
 * %%LICENSE%%
 * 
 * @author hfeild
 * @version %%VERSION%%
 */



if( CROWDLOGGER.preferences.defaults === undefined ){

/**
 * @namespace Contains  a function that sets preference defaults. 
 * This includes resetting
 * preferences whose default value has changed because of an update and is 
 * specifically listed as a preference that should be overwritten.
 */
CROWDLOGGER.preferences.defaults = {
    server_base_url: '%%SERVER_BASE_URL%%',
    PREF_VAL : 0, // The index of the pref. value (see default_prefs below).
    VERSION  : 1  // The index of the version.
};


/**
 * This object contains all of the default preferences. New preferences should
 * be manually added to this list. In addition to the preference value, we
 * also include a version number. If the previously installed version of the
 * extension is at or below the indicated version number, than the corresponding
 * preference should be overwritten.
 */
CROWDLOGGER.preferences.defaults.default_prefs = {
    // char preferences.
    server_base_url: [CROWDLOGGER.preferences.defaults.server_base_url,
         '%%VERSION%%'],
    ping_server_url: ['%%PING_SERVER_BASE_URL%%', '%%VERSION%%'],
    pass_phrase: ['', '1.4.2'],
    experiment_list: ['{}' , '1.4.2'],
    ran_experiments: ['{}' , '1.4.2'],
    current_running_experiment: ['', '1.4.7'],
    last_ran_experiment_id: ['', '1.4.7'],
    last_experiment_order_number: ['0' , '1.4.2'],
    id_code: ['' , '1.4.2'],
    registration_id: ['' , '1.4.2'],
    most_recent_message_id: ['0', '1.4.2'],

    // Server-side pages.
    whatsnew_url : ['/updates/whatsnew.php', '1.7.4'],
    email_url : ['/messages/email.php', '1.7.4'],
    experiment_update_url: ['/experiments/experiments.php', '1.7.4'],
    registration_id_url: ['/register/getId.php', '1.7.4'],
    registration_url: ['/register/register.php', '1.7.4'],
    job_completion_url: ['/register/jobRan.php', '1.7.4'],
    id_code_url: ['/register/getReferralId.php', '1.7.4'],
    extension_version_url: ['/updates/checkForUpdate.php', '1.7.4'],
    how_to_update_url: ['/updates/howToUpdate.html', '1.7.4'],
    help_url: ['/help.html', '1.7.4'],
    update_welcome_url: ['welcome.html', '1.4.2'],
    server_status_url: ['/experiments/serverStatus', '1.7.4'],
    error_server_url: ['/errors/logError.php', '1.7.4'],
    show_messages_url: ['/messages/messages.php', '1.7.4'],
    check_messages_url: ['/messages/newMessages.php', '1.7.4'],
    check_status_url: ['/checkStatus/checkStatus.php' , '1.7.4'],
    redeem_url: ['/checkStatus/redeem.php' , '1.7.4'],
    registration_id_verification_url: ['/register/verifyId.php', '1.7.4'],
    clrm_listing_url: ['/clrms/clrms.php', '%%VERSION%%'],
    clrm_repositories: ['[]', '2.0.2'],

    // Client-side pages.
    registration_dialog_url: ['registration.html', '1.4.2'],
    refer_a_friend_dialog_url: ['refer_a_friend.html', '1.4.2'],
    search_histogram_dialog_url: ['search_histogram.html', '1.4.2'],
    export_dialog_url: ['export.html', '1.7.0'],
    search_trails_dialog_url: ['search_trails.html', '1.6.0'],
    status_page_url: ['status.html', '1.4.2'],
    notification_url: ['notification.html', '1.4.2'],
    uninstall_dialog_url: ['uninstall.html', '1.4.2'],
    firefox_3_update_help_url: ['firefox_3_update_help.html', '1.4.2'],
    firefox_4_update_help_url: ['firefox_4_update_help.html', '1.4.2'],
    chrome_update_help_url: ['chrome_update_help.html', '1.4.2'],
    dev_tools_url: ['dev_tools.html', '1.7.3'],
    clrm_library_url: ['clrm-library.html', '1.7.4'],
    
    version: ['', '0'],
    'crowdlogger-logging-off-icon': 
        ['crowdlogger-logo.001.not-logging.48x48.png', '1.7.4'],
    'crowdlogger-logging-off_low_alert-button': 
        ['crowdlogger-logo.001.not-logging.alert-low.48x48.png', '1.7.4'],
    'crowdlogger-logging-off_high_alert-button': 
        ['crowdlogger-logo.001.not-logging.alert-high.48x48.png', '1.7.4'],
    'crowdlogger-logging-on-icon': 
        ['crowdlogger-logo.001.logging.48x48.png', '1.7.4'],
    'crowdlogger-logging-on_low_alert-button': 
        ['crowdlogger-logo.001.logging.alert-low.48x48.png', '1.7.4'],
    'crowdlogger-logging-on_high_alert-button': 
        ['crowdlogger-logo.001.logging.alert-high.48x48.png', '1.7.4'],
    extension_directory_name: ['crowdlogger', '1.4.2'],
    error_log_name: ['errors_log', '1.4.2'],
    activity_log_name: ['activity_log', '1.4.2'],
    log_encoding: ['UTF-8', '1.4.2'],
    preference_dialog_url: ['preferences.html', '1.4.2'],
    // int preferences.
    extension_version_check_interval: [1000*60*60*2, '1.4.2'], // 2 hours.
    check_message_interval:           [1000*60*6, '1.4.2'],     // 6 minutes.
    notification_check_interval:      [1000*60*20, '1.4.2'],    // 20 minutes.
    total_experiments_run:            [0, '1.4.7'],

    // bool preferences.
    logging_enabled:                 [true, '1.4.2'],
    added_logging_button_to_nav_bar: [false, '1.4.2'],
    registered:                      [false, '1.4.2'],
    run_experiments_automatically:   [false, '1.4.2'],
    first_load:                      [true, '1.4.2'],
    dev_mode:                        [false, '1.7.3']
};


/**
 * This contains code that is executed when the file is loaded. It sets and
 * updates preferences. 
 */
CROWDLOGGER.preferences.defaults.set_defaults = function(){
    // The last version; needed so we know which preferences to update.
    var last_version = CROWDLOGGER.preferences.get_char_pref( "version",
        "0" );    

    // Short cuts to some of the CROWDLOGGER.preference.defaults values and
    // structures defined above.
    var PREF_VAL = CROWDLOGGER.preferences.defaults.PREF_VAL;
    var VERSION  = CROWDLOGGER.preferences.defaults.VERSION;
    var default_prefs = CROWDLOGGER.preferences.defaults.default_prefs;

 
    // Is this the first start after an update? If so, wipe out the overrides
    // object.
    if( !CROWDLOGGER.version.util.is_first_start() ){
        //B_DEBUG
        CROWDLOGGER.debug.log( 'This IS NOT the first load after an update.' );
        //E_DEBUG
    } else {
        //B_DEBUG
        CROWDLOGGER.debug.log( 'This IS the first load after an update.' );
        CROWDLOGGER.debug.log( '\tcurrent version: ' + 
            CROWDLOGGER.version.info.get_extension_version() + '\n' );
        CROWDLOGGER.debug.log( '\tstored version:  ' + 
            CROWDLOGGER.preferences.get_char_pref( 
                'version', '----not set----' ) + '\n');
        //E_DEBUG
    }

    // Checks if a preference is set. The value is required in order to 
    // determine which getter to use (get_char, get_int, or get_bool).
    var pref_is_set = function( key, value ){
        var get_function;
        if( typeof value === 'string' ) {
            get_function = CROWDLOGGER.preferences.get_char_pref;
        } else if( typeof value === 'number' ) {
            get_function = CROWDLOGGER.preferences.get_int_pref;
        } else if( typeof value === 'boolean' ) {
            get_function = CROWDLOGGER.preferences.get_bool_pref;
        } else {
            return null;
        }

        if( get_function( key, undefined ) === undefined ){
            return false;
        } else {
            return true;
        }
    };

    // Sets the preference key to the given value.
    var set_pref = function( key, value ){
        var set_function;
        if( typeof value === 'string' ) {
            set_function = CROWDLOGGER.preferences.set_char_pref;
        } else if( typeof value === 'number' ) {
            set_function = CROWDLOGGER.preferences.set_int_pref;
        } else if( typeof value === 'boolean' ) {
            set_function = CROWDLOGGER.preferences.set_bool_pref;
        } else {
            return null;
        }

        set_function( key, value );
    };



    // Iterate through all of the preferences and set the necessary ones.
    // For a preference to be set, one of the following needs to be true:
    //    1. The particular preference has been slated for updating.
    //    2. The preference has not been set before.
    for( var x in default_prefs ){
        //B_DEBUG
        //CROWDLOGGER.debug.log( "---\nLooking at " + x + "; Comparing: [" + 
        //     last_version + "] vs. [" +
        //     default_prefs[x][VERSION] + "]: " );
        //CROWDLOGGER.debug.log( CROWDLOGGER.util.compare_version_numbers(
        //            last_version, default_prefs[x][VERSION] ) + "; is_set?: " +
        //     pref_is_set( x, default_prefs[x][PREF_VAL] ) + "\n" );
        //
        //E_DEBUG

        if( !pref_is_set( x, default_prefs[x][PREF_VAL] ) ||
                CROWDLOGGER.util.compare_version_numbers(
                    last_version, default_prefs[x][VERSION] ) < 0 ){

            CROWDLOGGER.debug.log( 'Setting preference for ' + x + '\n');
            set_pref( x, default_prefs[x][PREF_VAL] );
    
        }
    }
    
};

} // END CROWDLOGGER.preferences.defaults NAMESPACE
