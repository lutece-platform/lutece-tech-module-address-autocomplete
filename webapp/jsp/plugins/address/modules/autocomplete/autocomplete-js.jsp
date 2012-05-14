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
			$(".autocomplete_input").each(function() {
				//Create autocomplete inputs
				$(this).autocomplete({
					source: function(request) {
                   		$.ajax({
                      	 	url: '<%=AppPropertiesService.getProperty( "address-autocomplete.urlWS" ) %>',
                       		type: 'GET',
                       		async: false,
                       		data: {
                        		 addressPrefix: request.term,
                          		 zone: '<%=AppPropertiesService.getProperty( "address-autocomplete.zone" ) %>',
                          		 date: '<%=AppPropertiesService.getProperty(  "address-autocomplete.date" ) %>',
	                          	 maxResults: '<%=AppPropertiesService.getProperty("address-autocomplete.maxResults" ) %>',
	                          	 clientId: '<%=AppPropertiesService.getProperty( "address-autocomplete.clientId" ) %>'
                      	 	},
                      	 	success: function(data) {
                      	 		alert(data);
                      	 	},
                      	 	error: function(data, textStatus, ex) {
                      	 		console.info(data);
                      	 	}
                   	 	})
               		 },
					minLength: '<%=AppPropertiesService.getProperty( "address-autocomplete.minLength" ) %>'
				});
    		});
		});
	}, 1000);
}
