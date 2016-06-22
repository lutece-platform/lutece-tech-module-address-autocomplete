/*
 * Copyright (c) 2002-2014, Mairie de Paris
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice
 *     and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice
 *     and the following disclaimer in the documentation and/or other materials
 *     provided with the distribution.
 *
 *  3. Neither the name of 'Mairie de Paris' nor 'Lutece' nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * License 1.0
 */
package fr.paris.lutece.plugins.address.modules.autocomplete.web;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import fr.paris.lutece.portal.service.template.AppTemplateService;
import fr.paris.lutece.portal.service.util.AppPathService;
import fr.paris.lutece.portal.service.util.AppPropertiesService;
import fr.paris.lutece.portal.web.admin.PluginAdminPageJspBean;

public class SuggestPOIJSPBean extends PluginAdminPageJspBean
{
    /* + + + + + + + + + + + + + + + + + + + + + + + + + + +
    + Constants
    + + + + + + + + + + + + + + + + + + + + + + + + + + + */
    
    private static final long serialVersionUID = 4190973800934420917L;
    
    @SuppressWarnings("unused")
    private static final Logger logger = Logger.getLogger( SuggestPOIJSPBean.class.getName(  ) );
    
    // Configuration property names
    
    private static final String _PROP_PREFIX = "address-autocomplete.suggestPOI.";
    
    private static final String SUBPROP_WS_URL = "ws.url";
    private static final String SUBPROP_WS_DATATYPE = "ws.datatype";
    private static final String SUBPROP_WS_APIINPUT = "ws.apiinput";
    private static final String SUBPROP_UI_DELAY = "ui.delay";
    private static final String SUBPROP_PARAM_QUERY_MIN_LENGTH = "param.query.minLength";
    private static final String SUBPROP_PARAM_TYPES_DEFAULT = "param.types.default";
    private static final String SUBPROP_PARAM_BANTYPE_DEFAULT = "param.bantype.default";
    private static final String SUBPROP_PARAM_NB_RESULTS_DEFAULT = "param.nbResults.default";
    private static final String SUBPROP_PARAM_CLIENT_ID = "param.clientId";
    
    private static final String PROP_WS_URL = _PROP_PREFIX + SUBPROP_WS_URL;
    private static final String PROP_WS_DATATYPE = _PROP_PREFIX + SUBPROP_WS_DATATYPE;
    private static final String PROP_WS_APIINPUT = _PROP_PREFIX + SUBPROP_WS_APIINPUT;
    private static final String PROP_UI_DELAY = _PROP_PREFIX + SUBPROP_UI_DELAY;
    private static final String PROP_PARAM_QUERY_MIN_LENGTH = _PROP_PREFIX + SUBPROP_PARAM_QUERY_MIN_LENGTH;
    private static final String PROP_PARAM_TYPES_DEFAULT = _PROP_PREFIX + SUBPROP_PARAM_TYPES_DEFAULT;
    private static final String PROP_PARAM_BANTYPE_DEFAULT = _PROP_PREFIX + SUBPROP_PARAM_BANTYPE_DEFAULT;
    private static final String PROP_PARAM_NB_RESULTS_DEFAULT = _PROP_PREFIX + SUBPROP_PARAM_NB_RESULTS_DEFAULT;
    private static final String PROP_PARAM_CLIENT_ID = _PROP_PREFIX + SUBPROP_PARAM_CLIENT_ID;
    
    // Template model key names
    
    private static final String KEY_BASE_URL = "base_url";
    
    private static final String KEY_WS_URL = SUBPROP_WS_URL.replace( '.', '_' );
    private static final String KEY_WS_DATATYPE = SUBPROP_WS_DATATYPE.replace( '.', '_' );
    private static final String KEY_WS_APIINPUT = SUBPROP_WS_APIINPUT.replace( '.', '_' );
    private static final String KEY_UI_DELAY = SUBPROP_UI_DELAY.replace( '.', '_' );
    private static final String KEY_PARAM_QUERY_MIN_LENGTH = SUBPROP_PARAM_QUERY_MIN_LENGTH.replace( '.', '_' );
    private static final String KEY_PARAM_TYPES_DEFAULT = SUBPROP_PARAM_TYPES_DEFAULT.replace( '.', '_' );
    private static final String KEY_PARAM_BANTYPE_DEFAULT = SUBPROP_PARAM_BANTYPE_DEFAULT.replace( '.', '_' );
    private static final String KEY_PARAM_NB_RESULTS_DEFAULT = SUBPROP_PARAM_NB_RESULTS_DEFAULT.replace( '.', '_' );
    private static final String KEY_PARAM_CLIENT_ID = SUBPROP_PARAM_CLIENT_ID.replace( '.', '_' );
    
    // Template sub-paths
    // In this JSPBean, the templates are JS files
    
    private static final String TPL_PORTAL = "skin/plugins/address/modules/autocomplete/setupSuggestPOI.js";
    private static final String TPL_ADMIN = "admin/plugins/address/modules/autocomplete/setupSuggestPOI.js";
    
    /* + + + + + + + + + + + + + + + + + + + + + + + + + + +
    + Private methods
    + + + + + + + + + + + + + + + + + + + + + + + + + + + */
    
    /**
     * @return  Common values in a map for SuggestPOI JavaScript template. 
     */
    private Map<String, String> getInitSuggestPOIModel( HttpServletRequest request ) {
        
        Map<String, String> model = new HashMap<String, String>();
        
        model.put( KEY_BASE_URL, AppPathService.getBaseUrl( request ) );
        
        model.put( KEY_WS_URL, AppPropertiesService.getProperty( PROP_WS_URL ) );
        model.put( KEY_WS_DATATYPE, AppPropertiesService.getProperty( PROP_WS_DATATYPE ) );
        model.put( KEY_WS_APIINPUT, AppPropertiesService.getProperty( PROP_WS_APIINPUT ) );
        model.put( KEY_UI_DELAY, AppPropertiesService.getProperty( PROP_UI_DELAY ) );
        model.put( KEY_PARAM_QUERY_MIN_LENGTH, AppPropertiesService.getProperty( PROP_PARAM_QUERY_MIN_LENGTH ) );
        model.put( KEY_PARAM_TYPES_DEFAULT, AppPropertiesService.getProperty( PROP_PARAM_TYPES_DEFAULT ) );
        model.put( KEY_PARAM_BANTYPE_DEFAULT, AppPropertiesService.getProperty( PROP_PARAM_BANTYPE_DEFAULT ) );
        model.put( KEY_PARAM_NB_RESULTS_DEFAULT, AppPropertiesService.getProperty( PROP_PARAM_NB_RESULTS_DEFAULT ) );
        model.put( KEY_PARAM_CLIENT_ID, AppPropertiesService.getProperty( PROP_PARAM_CLIENT_ID ) );
        
        return model;
    }
    
    /* + + + + + + + + + + + + + + + + + + + + + + + + + + +
    + Public methods
    + + + + + + + + + + + + + + + + + + + + + + + + + + + */
    
    /**
     * Provides JavaScript source code for setting up SuggestPOI configuration  in the front-office.
     * 
     * @param request   The request in progress.
     * @return  JavaScript source
     */
    public String getSetupSuggestPOIJavaScriptPortal( HttpServletRequest request ) {
        
        Map<String, String> model = this.getInitSuggestPOIModel( request );
        return AppTemplateService.getTemplate( TPL_PORTAL, this.getLocale(  ), model ).getHtml( );
    }
    
    /**
     * Provides JavaScript source code for setting up SuggestPOI configuration in the back-office.
     * 
     * @param request   The request in progress.
     * @return  JavaScript source
     */
    public String getSetupSuggestPOIJavaScriptAdmin( HttpServletRequest request ) {
        
        Map<String, String> model = this.getInitSuggestPOIModel( request );
        return AppTemplateService.getTemplate( TPL_ADMIN, this.getLocale(  ), model ).getHtml( );
    }
}
