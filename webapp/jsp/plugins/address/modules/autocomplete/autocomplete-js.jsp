<% // Absence de cache pour cette page
response.setHeader("Pragma", "no-cache");
response.setHeader("Cache-Control", "no-cache");
response.setDateHeader("Expires", 0);
%>
<%@ page contentType="text/javascript;" %>
<%@ page import="fr.paris.lutece.portal.service.util.AppPropertiesService"%>


function createAutocomplete(jquerySelector) {
	
	//Waiting for the page to be fully loaded
	setTimeout(function(){
		$(document).ready(function() {
			$(jquerySelector).each(function() {
				//Create autocomplete inputs
				$(this).autocomplete({
					source: function(request, response) {
                   		$.ajax({
                      	 	url: '<%=AppPropertiesService.getProperty( "address-autocomplete.urlWS" ) %>',
                       		async: false,
                       		dataType: 'jsonp',
                       		data: {
                        		 addressPrefix: request.term,
                          		 zone: '<%=AppPropertiesService.getProperty( "address-autocomplete.zone" ) %>',
                          		 date: '<%=AppPropertiesService.getProperty(  "address-autocomplete.date" ) %>',
	                          	 maxResults: '<%=AppPropertiesService.getProperty("address-autocomplete.maxResults" ) %>',
	                          	 clientId: '<%=AppPropertiesService.getProperty( "address-autocomplete.clientId" ) %>'
                      	 	},
                      	 	success: function(data){
								//Erreur dans la requete
								if(data.error){
									$("#labelAutocomplete").css('display', 'block'); 
									$("#labelAutocomplete").text(data.error.message);
								}
								
								//Mise a jour de la liste deroulante
								else {
									response( $.map( data.result, function( item ) {
										return {
											label: item,
											value: item
										}
									}));
									$("#labelAutocomplete").css('display', 'none'); 
								}
                      	 	}
                   	 	})
               		 },
					minLength: '<%=AppPropertiesService.getProperty( "address-autocomplete.minLength" ) %>'
				});
    		});
		});
	}, 1500);
}
