# Module Address Autocomplete

Address autocomplete for Lutece (`@suggestPOIInput` macro, `SuggestPOI` JavaScript), used by the « Géolocalisation »
questions of plugin-forms and plugin-appointment and by the address of an appointment form.

## Configuration

`WEB-INF/conf/plugins/address-autocomplete.properties` (override it in the site):

| Property | Role |
|---|---|
| `address-autocomplete.suggestPOI.ws.url` | URL of the address service (default: BAN `https://api-adresse.data.gouv.fr/search/`) |
| `address-autocomplete.suggestPOI.ws.apiinput` | Format of the service: `BAN`, `STOREADR` or `SUGGESTPOI` |
| `address-autocomplete.suggestPOI.param.clientId` | Client id (STOREADR / SUGGESTPOI) |
| `address-autocomplete.suggestPOI.ui.delay`, `…param.query.minLength`, `…param.nbResults.default` | Typing delay, minimum length, number of results |

## Content-Security-Policy: allow the address service (required)

The address service is called **from the browser** (`fetch` in `suggestPOI.js`). The browser refuses the call unless the
origin of `address-autocomplete.suggestPOI.ws.url` is listed in the `connect-src` directive of the
`Content-Security-Policy` header of the site: the console then shows
`Connecting to '<ws.url>…' violates the following Content Security Policy directive: "connect-src …"` and every search
answers « Aucun résultat », in the front office and in the back office.

The default CSP of lutece-core (`core_admin_security_header`, header `Content-Security-Policy`, type `page`,
category `all`) does not list any address service, and this module ships no SQL to add one because the service URL is a
site setting. Each site that uses the module adds the origin of **its** configured URL to `connect-src`:

- in the back office: *Système > Gestion des en-têtes de sécurité* (right `CORE_SECURITY_HEADER_MANAGEMENT`), modify the
  `Content-Security-Policy` header of type `page`, category `all`, and add the origin to `connect-src`, e.g.
  `connect-src 'self' https://api-adresse.data.gouv.fr …` (applied at once);
- or in a Liquibase changeset of the site (same approach as module-genericattributes-openstreetmap for its map hosts):

```sql
-- liquibase formatted sql
-- changeset mysite:csp-address-autocomplete
-- preconditions onFail:MARK_RAN onError:WARN
-- precondition-sql-check expectedResult:0 SELECT COUNT(*) FROM core_admin_security_header WHERE name = 'Content-Security-Policy' AND type = 'page' AND value LIKE '%api-adresse.data.gouv.fr%'
UPDATE core_admin_security_header SET value = REPLACE( value, 'connect-src ', 'connect-src https://api-adresse.data.gouv.fr ' )
 WHERE name = 'Content-Security-Policy' AND type = 'page' AND value LIKE '%connect-src %';
```

Replace `https://api-adresse.data.gouv.fr` by the origin of the URL the site configures (a StoreAdr or SuggestPOI
server, a test stub…). A Content-Security-Policy custom value defined for a URL pattern (configuration items of the
header) replaces the whole header for those URLs: add the origin there too. With `upgrade-insecure-requests` in the
policy, an `http://` service is also upgraded to `https://`: use an `https://` URL.
