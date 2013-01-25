(function($) {
	
	if (typeof($.onReady) === "undefined") {
		
		var ITER_MAX = 100;
		var TRY_INTERVAL = 100; // ms // * ITER_MAX = 10s
		
		/**
		 * Appelle une fonction dès qu'un élément ou plusieurs du DOM sont effectivement disponibles.
		 * 
		 * <p>Cette méthode effectue un nombre fini de tentatives sur un intervalle de temps relativement
		 * restreint. Elle est faite pour combattre des problèmes de timing, pas pour différer des événements.</p>
		 * 
		 * @param selector	(string) Sélecteur CSS d'un ou plusieurs éléments.
		 * @param callabck  Une méthode à appeler sur chaque élément dès que l'un d'entre eux devient disponible.
		 */
		$.onReady = function(selector, callback) {
			
			var i = 0;
			
			function testReady() {
				
				// On limite le nombre de tests total
				
				if (i++ > ITER_MAX) {
					return;
				}
				
				var jElem = $(selector);
				
				// Si pas présent, on réessaye plus tard
				
				if (jElem.length < 1) {
					
					setTimeout(testReady, TRY_INTERVAL);
					return;
				}
				
				// Présent(s), on appelle la callback dessus
				
				jElem.each(callback);
			}
			
			testReady();
		}
	}
	
})(jQuery);