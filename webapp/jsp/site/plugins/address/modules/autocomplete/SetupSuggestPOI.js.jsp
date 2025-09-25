<%@ page contentType="text/javascript" %>
<%@ page errorPage="../../ErrorPagePortal.jsp" %>

<%@page import="fr.paris.lutece.plugins.address.modules.autocomplete.web.SuggestPOIJSPBean"%>

${ suggestPOIJSPBean.getSetupSuggestPOIJavaScriptPortal( pageContext.request ) }
