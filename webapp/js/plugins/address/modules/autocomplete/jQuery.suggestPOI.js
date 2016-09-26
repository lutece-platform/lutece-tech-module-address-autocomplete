(function($) {

    // Ce script n'est utile qu'après initialisation de la configuration
    
    var $LUTECE = window.LUTECE || (window.LUTECE = {});
    var $MAA = $LUTECE.ADDRESS_AUTOCOMPLETE || ($LUTECE.ADDRESS_AUTOCOMPLETE = {});
    var $config = $MAA.config || ($MAA.config = {});
    
    var PROP_WS_URL = "suggestPOI.ws.url";
    var PROP_DATATYPE = "suggestPOI.ws.datatype";
    var PROP_ON_SELECT_UPDATE_DOM = "suggestPOI.param.onSelectUpdateDom";
    var PROP_API_INPUT = "suggestPOI.ws.apiinput";
    var PROP_UI_DELAY = "suggestPOI.ui.delay";
    var PROP_PARAM_QUERY_MIN_LENGTH = "suggestPOI.param.query.minLength";
    var PROP_PARAM_TYPES_DEFAULT = "suggestPOI.param.types.default";
    var PROP_PARAM_BANTYPE_DEFAULT = "suggestPOI.param.bantype.default";
    var PROP_PARAM_NB_RESULTS_DEFAULT = "suggestPOI.param.nbResults.default";
    var PROP_PARAM_CLIENT_ID = "suggestPOI.param.clientId";
    
    var EVT_NS_SPOI = ".suggestPOI";
    var EVT_SELECT = "select"
    var EVT_ERROR = "error";
    
    var DATATYPE_JSON = "json";
    var DATATYPE_JSONP = "jsonp";

    var APIINPUT_SUGGESTPOI = "SUGGESTPOI";
    var APIINPUT_BAN = "BAN";
    
    var SEP_TYPES = ",";

    //Compatibility with older version where the APIINPUT and DATATYPE were not given.
    //Only SuggestPoi was available. An app could have overriden PROP_WS_URL, and now
    //we default PROP_DATATYPE and PROP_API_INPUT to the values for BAN. So attempt
    //to detect this situation and revert to the correct values for SuggestPOI
    if ($config[PROP_WS_URL].indexOf("SuggestPOI") > -1) {
        $config[PROP_DATATYPE] = DATATYPE_JSONP;
        $config[PROP_API_INPUT] = APIINPUT_SUGGESTPOI;
    }
    
    // Pattern de création d'un nouveau plugin jQuery.
    // Rajoute une méthode suggestPOI() à tout objet jQuery sélectionné dans le DOM.
    
    $.fn.extend({
        
        suggestPOI: function(options, arg) {
        
        	if (typeof(console) != "undefined") {
        		console.log(["SuggestPOI setup on:", this]);
        	}
        
            var defaultOptions = {
                types: $config[PROP_PARAM_TYPES_DEFAULT],
                bantype: $config[PROP_PARAM_BANTYPE_DEFAULT],
                nbResults: $config[PROP_PARAM_NB_RESULTS_DEFAULT]
            };
            
            options = (
        		typeof(options) === "object" ?
				$.extend({}, defaultOptions, options) : defaultOptions
    		);
            
            $(this).each(function() {
                $.suggestPOI(this, options, arg);
            });
        }
    });
    
    /**
     * Met en place une auto-complétion de libellés de POI sur un champ texte.
     * 
     * Lève les événements d'identifiants suivants :
     * - $.suggestPOI.EVT_SELECT (sur le champ) lorsqu'un POI a été sélectionné dans la liste
     *   d'auto-complétion (event.poi est le POI sélectionné)
     * - $.suggestPOI.EVT_ERROR (sur le champ) en cas d'erreur (argument : l'erreur survenue)
     * 
     * @param elem      Un champ texte de formulaire (cible de l'appel jQuery)
     * @param options   (opt.) Un objet d'options de configuration, dont notamment :
     *   - nbResults : nombre de résultats désirés (valeur par défaut en configuration)
     *   - types : tableau ou liste (concaténée par ",") d'identifiants de types de POI (valeur par défaut en configuration)
     * @param arg       (opt.) Autre argument statique. 
     */
    $.suggestPOI = function(elem, options, arg) {
    
        var jElem = $(elem);
              
        var nbResults = options.nbResults;
        var types = options.types;
        var bantype = options.bantype;
        
        if ($.isArray(types)) {
            types = types.join(SEP_TYPES);
        }
            
	    jElem.autocomplete({
	    
            minLength: $config[PROP_PARAM_QUERY_MIN_LENGTH],
            delay: $config[PROP_UI_DELAY],
	       
            // Définition de la source de données.
            // Une méthode convient pour une source distante.
	        source: function(input, forward) {
	        	
	        	var jThis = $(this);

                var ajax_data;
                if ($config[PROP_API_INPUT] == APIINPUT_BAN) {
	                ajax_data = {
	                    q: input.term,
	                    limit: nbResults,
	                    type: bantype
	                };
                } else {
	                ajax_data = {
	                    clientId: $config[PROP_PARAM_CLIENT_ID],
	                    query: input.term,
	                    nbResults: nbResults,
	                    types: types
	                };
                }
	      
	            $.ajax({
	              
	                url: $config[PROP_WS_URL],
	                dataType: $config[PROP_DATATYPE] || DATATYPE_JSONP,
	                
	                data: ajax_data,
	                
	                success: function(data) {
	                
	                    if (typeof(data.error) !== "undefined") {
	                    	
	                    	if (typeof(console) !== "undefined") {
				            	console.error(data.error);
				            }
	            
	                    	jThis.trigger($.Event(EVT_ERROR), data.error);
	                    }
	                    else {
	                    
                            // Il faut produire des objets qui comportent a minima
                            // une propriété "label" pour affichage dans la liste déroulante
                            // de suggestions.
	                    
                            var listResults;
                            if ($config[PROP_API_INPUT] == APIINPUT_BAN) {
                                listResults = data.features;
                            } else {
                                listResults = data.result;
                            }
	                        forward($.map(listResults, function(item) {
	                           
                                var item2;
                                if ($config[PROP_API_INPUT] == APIINPUT_BAN) {
                                    item2 = {
                                        "libelleTypo":item.properties.label,
                                        "id":item.properties.id,
                                        "x":item.geometry.coordinates[0],
                                        "y":item.geometry.coordinates[1],
                                        "sourcePOI": item,
                                        "type":item.properties.type
                                    };
                                } else {
                                    item2 = item;
                                }

	                
	                           return {	                           
	                               label: item2.libelleTypo,
	                               poi: item2
	                           };
	                        }));
	                    }
	                },
	            
	                error: function (xhr, ajaxOptions, thrownError) {
	                    
	                    if (typeof(console) !== "undefined") {
	                        console.error([thrownError, xhr, ajaxOptions]);
	                    }
	                    
	                    jThis.trigger($.Event(EVT_ERROR, thrownError));
	                }
	            });
	        },
	    
            // Un élément a été sélectionné
	        select: function(event, ui) {
	        
	            if (typeof(ui.item) !== "undefined") {
                    $(this).trigger($.Event(EVT_SELECT, ui.item));
	            }
	            if ($config[PROP_ON_SELECT_UPDATE_DOM] === "false") {
	               //Both lines should be enough on their own to prevent jquery-ui
	               //from updating the <input>, but keep them both just in case
	               event.preventDefault();
	               return false;
	           }
	        },
	    
	        open: function() {
	            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
	        },
	    
	        close: function() {
	            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
	        }
	    });
    };
    
    $.suggestPOI.EVT_SELECT = EVT_SELECT + EVT_NS_SPOI; // Choix de POI effectué
    $.suggestPOI.EVT_ERROR = EVT_ERROR + EVT_NS_SPOI; // Erreur survenue

})(jQuery);