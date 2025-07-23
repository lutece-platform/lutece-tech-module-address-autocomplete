<%@ page contentType="text/javascript" %>
<%@ page errorPage="../../ErrorPage.jsp" %>

<%@page import="fr.paris.lutece.plugins.address.modules.autocomplete.web.SuggestPOIJSPBean"%>

${ suggestPOIJSPBean.getSetupSuggestPOIJavaScriptAdmin( pageContext.request )}
