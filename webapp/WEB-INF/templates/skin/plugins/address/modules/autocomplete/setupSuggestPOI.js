(function($) {

	// Script dynamique (par template) de mise en place de la configuration de l'appel à SuggestPOI
	
	var $LUTECE = window.LUTECE || (window.LUTECE = {});
	var $MAA = $LUTECE.ADDRESS_AUTOCOMPLETE || ($LUTECE.ADDRESS_AUTOCOMPLETE = {});
	var $config = $MAA.config || ($MAA.config = {});
	
	var PROP_WS_URL = "suggestPOI.ws.url";
    var PROP_UI_DELAY = "suggestPOI.ui.delay";
    var PROP_PARAM_QUERY_MIN_LENGTH = "suggestPOI.param.query.minLength";
    var PROP_PARAM_TYPES_DEFAULT = "suggestPOI.param.types.default";
    var PROP_PARAM_NB_RESULTS_DEFAULT = "suggestPOI.param.nbResults.default"
    var PROP_PARAM_CLIENT_ID = "suggestPOI.param.clientId";
    
    $config[PROP_WS_URL] = "${ws_url}";
    $config[PROP_UI_DELAY] = parseInt("${ui_delay}", 10);
    $config[PROP_PARAM_QUERY_MIN_LENGTH] = parseInt("${param_query_minLength}", 10);
    $config[PROP_PARAM_TYPES_DEFAULT] = "${param_types_default}";
    $config[PROP_PARAM_NB_RESULTS_DEFAULT] = parseInt("${param_nbResults_default}", 10);
    $config[PROP_PARAM_CLIENT_ID] = "${param_clientId}";
     
})(jQuery);