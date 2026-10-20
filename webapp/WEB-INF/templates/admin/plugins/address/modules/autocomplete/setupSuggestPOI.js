(function() {
    'use strict';

    var LUTECE = window.LUTECE || (window.LUTECE = {});
    var ADDRESS_AUTOCOMPLETE = LUTECE.ADDRESS_AUTOCOMPLETE || (LUTECE.ADDRESS_AUTOCOMPLETE = {});
    var config = ADDRESS_AUTOCOMPLETE.config || (ADDRESS_AUTOCOMPLETE.config = {});

    config['suggestPOI.ws.url'] = "${ws_url?js_string}";
    <#if ws_datatype??>config['suggestPOI.ws.datatype'] = "${ws_datatype?js_string}";</#if>
    <#if ws_apiinput??>config['suggestPOI.ws.apiinput'] = "${ws_apiinput?js_string}";</#if>
    config['suggestPOI.ui.delay'] = parseInt("${ui_delay?js_string}", 10);
    config['suggestPOI.param.query.minLength'] = parseInt("${param_query_minLength?js_string}", 10);
    <#if param_onSelectUpdateDom??>config['suggestPOI.param.onSelectUpdateDom'] = "${param_onSelectUpdateDom?js_string}";</#if>
    config['suggestPOI.param.types.default'] = "${param_types_default?js_string}";
    <#if param_srid_default??>config['suggestPOI.param.srid.default'] = "${param_srid_default?js_string}";</#if>
    <#if param_bantype_default??>config['suggestPOI.param.bantype.default'] = "${param_bantype_default?js_string}";</#if>
    <#if param_banlat_default??>config['suggestPOI.param.banlat.default'] = "${param_banlat_default?js_string}";</#if>
    <#if param_banlon_default??>config['suggestPOI.param.banlon.default'] = "${param_banlon_default?js_string}";</#if>
    <#if param_banpostcode_default??>config['suggestPOI.param.banpostcode.default'] = "${param_banpostcode_default?js_string}";</#if>
    <#if param_bancitycode_default??>config['suggestPOI.param.bancitycode.default'] = "${param_bancitycode_default?js_string}";</#if>
    config['suggestPOI.param.nbResults.default'] = parseInt("${param_nbResults_default?js_string}", 10);
    config['suggestPOI.param.clientId'] = "${param_clientId?js_string}";
    <#if param_storeadrfilter_default??>config['suggestPOI.param.storeadrfilter.default'] = "${param_storeadrfilter_default?js_string}";</#if>

})();
