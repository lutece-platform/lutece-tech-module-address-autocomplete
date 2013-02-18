(function($) {

    // Ce script n'est utile qu'après initialisation de la configuration
    
    var $LUTECE = window.LUTECE || (window.LUTECE = {});
    var $MAA = $LUTECE.ADDRESS_AUTOCOMPLETE || ($LUTECE.ADDRESS_AUTOCOMPLETE = {});
    var $config = $MAA.config || ($MAA.config = {});
    
    var PROP_WS_URL = "suggestPOI.ws.url";
    var PROP_UI_DELAY = "suggestPOI.ui.delay";
    var PROP_PARAM_QUERY_MIN_LENGTH = "suggestPOI.param.query.minLength";
    var PROP_PARAM_TYPES_DEFAULT = "suggestPOI.param.types.default";
    var PROP_PARAM_NB_RESULTS_DEFAULT = "suggestPOI.param.nbResults.default";
    var PROP_PARAM_CLIENT_ID = "suggestPOI.param.clientId";
    
    var EVT_NS_SPOI = ".suggestPOI";
    var EVT_SELECT = "select"
    var EVT_ERROR = "error";
    
    var DATATYPE_JSON = "json";
    var DATATYPE_JSONP = "jsonp";
    
    var SEP_TYPES = ",";
    
    // Pattern de création d'un nouveau plugin jQuery.
    // Rajoute une méthode suggestPOI() à tout objet jQuery sélectionné dans le DOM.
    
    $.fn.extend({
        
        suggestPOI: function(options, arg) {
        
        	if (typeof(console) != "undefined") {
        		console.log(["SuggestPOI setup on:", this]);
        	}
        
            var defaultOptions = {
                types: $config[PROP_PARAM_TYPES_DEFAULT],
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
	      
	            $.ajax({
	              
	                url: $config[PROP_WS_URL],
	                dataType: DATATYPE_JSONP,
	                
	                data: {
	                    clientId: $config[PROP_PARAM_CLIENT_ID],
	                    query: input.term,
	                    nbResults: nbResults,
	                    types: types
	                },
	                
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
	                    
	                        forward($.map(data.result, function(item) {
	                           
	                           return {	                           
	                               label: item.libelleTypo,
	                               poi: item
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