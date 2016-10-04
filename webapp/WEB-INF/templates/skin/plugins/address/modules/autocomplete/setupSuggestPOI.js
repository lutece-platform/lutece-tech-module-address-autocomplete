(function($) {

	// Script dynamique (par template) de mise en place de la configuration de l'appel à SuggestPOI
	
	var $LUTECE = window.LUTECE || (window.LUTECE = {});
	var $MAA = $LUTECE.ADDRESS_AUTOCOMPLETE || ($LUTECE.ADDRESS_AUTOCOMPLETE = {});
	var $config = $MAA.config || ($MAA.config = {});
	
	var PROP_WS_URL = "suggestPOI.ws.url";
    var PROP_DATATYPE = "suggestPOI.ws.datatype";
    var PROP_API_INPUT = "suggestPOI.ws.apiinput";
    var PROP_UI_DELAY = "suggestPOI.ui.delay";
    var PROP_PARAM_QUERY_MIN_LENGTH = "suggestPOI.param.query.minLength";
    var PROP_ON_SELECT_UPDATE_DOM = "suggestPOI.param.onSelectUpdateDom";
    var PROP_PARAM_TYPES_DEFAULT = "suggestPOI.param.types.default";
    var PROP_PARAM_BANTYPE_DEFAULT = "suggestPOI.param.bantype.default";
    var PROP_PARAM_BANLAT_DEFAULT = "suggestPOI.param.banlat.default";
    var PROP_PARAM_BANLON_DEFAULT = "suggestPOI.param.banlon.default";
    var PROP_PARAM_BANPOSTCODE_DEFAULT = "suggestPOI.param.banpostcode.default";
    var PROP_PARAM_BANCITYCODE_DEFAULT = "suggestPOI.param.bancitycode.default";
    var PROP_PARAM_NB_RESULTS_DEFAULT = "suggestPOI.param.nbResults.default"
    var PROP_PARAM_CLIENT_ID = "suggestPOI.param.clientId";
    
    $config[PROP_WS_URL] = "${ws_url}";
    <#if ws_datatype??>$config[PROP_DATATYPE] = "${ws_datatype}";</#if>
    <#if ws_apiinput??>$config[PROP_API_INPUT] = "${ws_apiinput}";</#if>
    $config[PROP_UI_DELAY] = parseInt("${ui_delay}", 10);
    $config[PROP_PARAM_QUERY_MIN_LENGTH] = parseInt("${param_query_minLength}", 10);
    <#if param_onSelectUpdateDom??>$config[PROP_ON_SELECT_UPDATE_DOM] = "${param_onSelectUpdateDom}";</#if>
    $config[PROP_PARAM_TYPES_DEFAULT] = "${param_types_default}";
    <#if param_bantype_default??>$config[PROP_PARAM_BANTYPE_DEFAULT] = "${param_bantype_default}";</#if>
    <#if param_banlat_default??>$config[PROP_PARAM_BANLAT_DEFAULT] = "${param_banlat_default}";</#if>
    <#if param_banlon_default??>$config[PROP_PARAM_BANLON_DEFAULT] = "${param_banlon_default}";</#if>
    <#if param_banpostcode_default??>$config[PROP_PARAM_BANPOSTCODE_DEFAULT] = "${param_banpostcode_default}";</#if>
    <#if param_bancitycode_default??>$config[PROP_PARAM_BANCITYCODE_DEFAULT] = "${param_bancitycode_default}";</#if>
    $config[PROP_PARAM_NB_RESULTS_DEFAULT] = parseInt("${param_nbResults_default}", 10);
    $config[PROP_PARAM_CLIENT_ID] = "${param_clientId}";
     
})(jQuery);