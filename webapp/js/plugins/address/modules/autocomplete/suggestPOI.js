/**
 * SuggestPOI - Address autocomplete using LuteceAutoComplete
 * Bridges address API services (BAN, STOREADR, SUGGESTPOI) with the core LuteceAutoComplete component.
 */
(function() {
    'use strict';

    var LUTECE = window.LUTECE || (window.LUTECE = {});
    var ADDRESS_AUTOCOMPLETE = LUTECE.ADDRESS_AUTOCOMPLETE || (LUTECE.ADDRESS_AUTOCOMPLETE = {});
    var config = ADDRESS_AUTOCOMPLETE.config || (ADDRESS_AUTOCOMPLETE.config = {});

    var PROP_WS_URL = 'suggestPOI.ws.url';
    var PROP_API_INPUT = 'suggestPOI.ws.apiinput';
    var PROP_PARAM_QUERY_MIN_LENGTH = 'suggestPOI.param.query.minLength';
    var PROP_PARAM_TYPES_DEFAULT = 'suggestPOI.param.types.default';
    var PROP_PARAM_SRID_DEFAULT = 'suggestPOI.param.srid.default';
    var PROP_PARAM_BANTYPE_DEFAULT = 'suggestPOI.param.bantype.default';
    var PROP_PARAM_BANLAT_DEFAULT = 'suggestPOI.param.banlat.default';
    var PROP_PARAM_BANLON_DEFAULT = 'suggestPOI.param.banlon.default';
    var PROP_PARAM_BANPOSTCODE_DEFAULT = 'suggestPOI.param.banpostcode.default';
    var PROP_PARAM_BANCITYCODE_DEFAULT = 'suggestPOI.param.bancitycode.default';
    var PROP_PARAM_NB_RESULTS_DEFAULT = 'suggestPOI.param.nbResults.default';
    var PROP_PARAM_CLIENT_ID = 'suggestPOI.param.clientId';

    var APIINPUT_BAN = 'BAN';
    var APIINPUT_STOREADR = 'STOREADR';
    var APIINPUT_SUGGESTPOI = 'SUGGESTPOI';

    var EVT_SELECT = 'suggestpoi:select';
    var EVT_ERROR = 'suggestpoi:error';

    if (config[PROP_WS_URL] && config[PROP_WS_URL].indexOf('SuggestPOI') > -1) {
        config[PROP_API_INPUT] = APIINPUT_SUGGESTPOI;
    }

    /**
     * Builds the fetch URL for a given query string based on the configured API input type.
     * Supports BAN, STOREADR, and SUGGESTPOI APIs, each with their own URL format and parameters.
     *
     * @param {string} query - The search query entered by the user
     * @param {Object} options - Override options for URL parameters
     * @param {number} [options.nbResults] - Maximum number of results to return
     * @param {string} [options.banlat] - Latitude for BAN proximity search
     * @param {string} [options.banlon] - Longitude for BAN proximity search
     * @param {string} [options.banpostcode] - Postal code filter for BAN
     * @param {string} [options.bancitycode] - City code filter for BAN
     * @param {string} [options.bantype] - Address type filter for BAN
     * @param {string} [options.types] - Entity types for STOREADR/SUGGESTPOI
     * @param {string} [options.srid] - Spatial Reference ID for STOREADR
     * @returns {string} The fully constructed fetch URL
     */
    function buildFetchUrl(query, options) {
        var apiInput = config[PROP_API_INPUT];
        var wsUrl = config[PROP_WS_URL];
        var encodedQuery = encodeURIComponent(query);

        if (apiInput === APIINPUT_BAN) {
            var params = ['q=' + encodedQuery];
            var limit = options.nbResults || config[PROP_PARAM_NB_RESULTS_DEFAULT];
            if (limit) params.push('limit=' + limit);
            var lat = options.banlat || config[PROP_PARAM_BANLAT_DEFAULT];
            if (lat) params.push('lat=' + lat);
            var lon = options.banlon || config[PROP_PARAM_BANLON_DEFAULT];
            if (lon) params.push('lon=' + lon);
            var postcode = options.banpostcode || config[PROP_PARAM_BANPOSTCODE_DEFAULT];
            if (postcode) params.push('postcode=' + postcode);
            var citycode = options.bancitycode || config[PROP_PARAM_BANCITYCODE_DEFAULT];
            if (citycode) params.push('citycode=' + citycode);
            var type = options.bantype || config[PROP_PARAM_BANTYPE_DEFAULT];
            if (type) params.push('type=' + type);
            return wsUrl + '?' + params.join('&');

        } else if (apiInput === APIINPUT_STOREADR) {
            var clientId = config[PROP_PARAM_CLIENT_ID];
            var parms = JSON.stringify({
                Entites: options.types || config[PROP_PARAM_TYPES_DEFAULT],
                toSrid: options.srid || config[PROP_PARAM_SRID_DEFAULT]
            });
            return wsUrl + '/' + clientId + '/poiauto/' + encodedQuery + '?Parms=' + encodeURIComponent(parms);

        } else {
            var params = ['query=' + encodedQuery];
            var clientId = config[PROP_PARAM_CLIENT_ID];
            if (clientId) params.push('clientId=' + clientId);
            var nbResults = options.nbResults || config[PROP_PARAM_NB_RESULTS_DEFAULT];
            if (nbResults) params.push('nbResults=' + nbResults);
            var types = options.types || config[PROP_PARAM_TYPES_DEFAULT];
            if (types) params.push('types=' + types);
            return wsUrl + '?' + params.join('&');
        }
    }

    /**
     * Parses the raw API response into a normalized array of POI objects.
     * Handles the different response formats from BAN, STOREADR, and SUGGESTPOI APIs.
     *
     * @param {Object} data - The raw JSON response from the API
     * @returns {Array<{label: string, id: string, x: number, y: number, type: string|null, sourcePOI: Object}>}
     *   Array of normalized POI objects
     */
    function parseResponse(data) {
        var apiInput = config[PROP_API_INPUT];
        var results = [];

        if (data && data.error) {
            console.error('SuggestPOI API error:', data.error);
            return results;
        }

        var listResults = [];
        if (apiInput === APIINPUT_BAN) {
            listResults = data.features || [];
        } else if (apiInput === APIINPUT_STOREADR) {
            listResults = Array.isArray(data) ? data : (data.result || []);
        } else {
            listResults = data.result || [];
        }

        listResults.forEach(function(item) {
            var poi;
            if (apiInput === APIINPUT_BAN) {
                poi = {
                    label: item.properties.label,
                    id: item.properties.id,
                    x: item.geometry.coordinates[0],
                    y: item.geometry.coordinates[1],
                    type: item.properties.type,
                    sourcePOI: item
                };
            } else if (apiInput === APIINPUT_STOREADR) {
                poi = {
                    label: item.Libelletypo,
                    id: String(item.Objectid),
                    x: item.X,
                    y: item.Y,
                    type: null,
                    sourcePOI: item
                };
            } else {
                poi = {
                    label: item.libelleTypo,
                    id: String(item.id || item.libelleTypo),
                    x: item.x,
                    y: item.y,
                    type: item.type,
                    sourcePOI: item
                };
            }
            results.push(poi);
        });

        return results;
    }

    /**
     * Fetches precise coordinates for a STOREADR POI by its object ID.
     * This is a secondary API call made after the user selects an address,
     * since the initial autocomplete results from STOREADR may lack precise coordinates.
     *
     * @param {string} poiId - The STOREADR object ID of the selected POI
     * @param {function({x: number, y: number}|null): void} callback - Called with coordinates or null on failure
     */
    function fetchStoreAdrCoordinates(poiId, callback) {
        var url = config[PROP_WS_URL] + '/' + config[PROP_PARAM_CLIENT_ID] + '/objectid/(' + poiId + ',4326)';
        fetch(url)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.result && data.result.Features && data.result.Features[0]) {
                    callback({
                        x: data.result.Features[0].geometry.coordinates[0],
                        y: data.result.Features[0].geometry.coordinates[1]
                    });
                } else {
                    callback(null);
                }
            })
            .catch(function(error) {
                console.error('SuggestPOI STOREADR coordinates error:', error);
                callback(null);
            });
    }

    /**
     * Creates a new SuggestPOI instance, wiring address autocomplete to a LuteceAutoComplete component.
     * Dynamically imports LuteceAutoComplete and configures it with a fetch-based source callback.
     *
     * @constructor
     * @param {HTMLElement|string} element - The autocomplete container element or a CSS selector string
     * @param {Object} [userOptions] - Override options merged with global config defaults
     * @param {string} [userOptions.types] - Entity types filter (STOREADR/SUGGESTPOI)
     * @param {string} [userOptions.srid] - Spatial Reference ID (STOREADR)
     * @param {string} [userOptions.bantype] - Address type filter (BAN)
     * @param {string} [userOptions.banlat] - Latitude for proximity search (BAN)
     * @param {string} [userOptions.banlon] - Longitude for proximity search (BAN)
     * @param {string} [userOptions.banpostcode] - Postal code filter (BAN)
     * @param {string} [userOptions.bancitycode] - City code filter (BAN)
     * @param {number} [userOptions.nbResults] - Maximum number of results
     * @param {boolean} [userOptions.allowFreeText=true] - Whether free text input is allowed without selection
     */
    function SuggestPOI(element, userOptions) {
        var self = this;

        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) {
            console.error('SuggestPOI: element not found');
            return;
        }

        this.element = element;
        this.options = Object.assign({
            types: config[PROP_PARAM_TYPES_DEFAULT],
            srid: config[PROP_PARAM_SRID_DEFAULT],
            bantype: config[PROP_PARAM_BANTYPE_DEFAULT],
            banlat: config[PROP_PARAM_BANLAT_DEFAULT],
            banlon: config[PROP_PARAM_BANLON_DEFAULT],
            banpostcode: config[PROP_PARAM_BANPOSTCODE_DEFAULT],
            bancitycode: config[PROP_PARAM_BANCITYCODE_DEFAULT],
            nbResults: config[PROP_PARAM_NB_RESULTS_DEFAULT],
            allowFreeText: true
        }, userOptions || {});

        this.selectedPoi = null;

        element.setAttribute('data-minimumInputLength', String(config[PROP_PARAM_QUERY_MIN_LENGTH] || 3));
        element.setAttribute('data-allowFreeText', String(this.options.allowFreeText));

        element.addEventListener('autocomplete:select', function(event) {
            self.handleSelection(event.detail.suggestion);
        });

        var opts = this.options;
        import('../../../../../themes/shared/modules/luteceAutoComplete.js').then(function(module) {
            var LuteceAutoComplete = module.default;
            self.autocomplete = new LuteceAutoComplete(element, {
                source: function(query, callback) {
                    var url = buildFetchUrl(query, opts);
                    fetch(url)
                        .then(function(response) { return response.json(); })
                        .then(function(data) {
                            callback(parseResponse(data));
                        })
                        .catch(function(error) {
                            console.error('SuggestPOI fetch error:', error);
                            callback([]);
                        });
                }
            });
        }).catch(function(error) {
            console.error('SuggestPOI: failed to load LuteceAutoComplete', error);
        });
    }

    /**
     * Handles the user's address selection from the autocomplete dropdown.
     * For STOREADR, fetches precise coordinates before dispatching the event.
     * Dispatches a custom 'suggestpoi:select' event on the container element.
     *
     * @param {Object} poi - The selected POI object from parseResponse
     * @param {string} poi.label - Display label of the selected address
     * @param {string} poi.id - Unique identifier of the selected address
     * @param {number} poi.x - X coordinate (longitude)
     * @param {number} poi.y - Y coordinate (latitude)
     * @param {string|null} poi.type - Address type
     * @param {Object} poi.sourcePOI - Original raw API response object
     */
    SuggestPOI.prototype.handleSelection = function(poi) {
        var self = this;

        function dispatchEvent(finalPoi) {
            self.selectedPoi = finalPoi;
            self.element.dispatchEvent(new CustomEvent(EVT_SELECT, {
                bubbles: true,
                detail: {
                    poi: finalPoi,
                    label: finalPoi.label,
                    value: finalPoi.id
                }
            }));
        }

        if (config[PROP_API_INPUT] === APIINPUT_STOREADR && poi && poi.id) {
            fetchStoreAdrCoordinates(poi.id, function(coords) {
                if (coords) {
                    poi.x = coords.x;
                    poi.y = coords.y;
                }
                dispatchEvent(poi);
            });
        } else {
            dispatchEvent(poi);
        }
    };

    /**
     * Returns the currently selected POI object, or null if no selection has been made.
     *
     * @returns {{label: string, id: string, x: number, y: number, type: string|null, sourcePOI: Object}|null}
     *   The selected POI or null
     */
    SuggestPOI.prototype.getSelectedPoi = function() {
        return this.selectedPoi;
    };

    /**
     * Returns the current value of the search input field.
     *
     * @returns {string} The input value, or an empty string if the input is not found
     */
    SuggestPOI.prototype.getValue = function() {
        var input = this.element.querySelector('.lutece-autocomplete-search-input');
        return input ? input.value : '';
    };

    /**
     * Sets the value of the search input field programmatically.
     *
     * @param {string} value - The value to set in the input field
     */
    SuggestPOI.prototype.setValue = function(value) {
        var input = this.element.querySelector('.lutece-autocomplete-search-input');
        if (input) {
            input.value = value;
        }
    };

    window.SuggestPOI = SuggestPOI;
    window.SuggestPOI.EVT_SELECT = EVT_SELECT;
    window.SuggestPOI.EVT_ERROR = EVT_ERROR;

})();
