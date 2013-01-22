<%@ page errorPage="../../ErrorPagePortal.jsp" %>

<jsp:useBean id="javascript" scope="session" class="fr.paris.lutece.plugins.address.modules.autocomplete.web.JavaScriptJSPBean" />

<%= javascript.getSetupSuggestPOI( request ) %>