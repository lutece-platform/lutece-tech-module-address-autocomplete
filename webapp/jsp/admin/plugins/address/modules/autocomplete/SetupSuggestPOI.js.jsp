<%@ page contentType="text/javascript" %>
<%@ page errorPage="../../ErrorPage.jsp" %>

<jsp:useBean id="suggestPOI" scope="session" class="fr.paris.lutece.plugins.address.modules.autocomplete.web.SuggestPOIJSPBean" />

<%= suggestPOI.getSetupSuggestPOIJavaScriptAdmin( request ) %>