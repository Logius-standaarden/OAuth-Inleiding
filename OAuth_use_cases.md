# OAuth - Advanced security

> Concept beschrijving dd 01-11-2024 - door Stas Mironov

## Use-cases extra security features


### 1. Opaque tokens
Toevoegen aan Inleidend document extra security optie.

Met name een privacy aspect dat je geen persoonsgegevens kan lekken in een opaque token

vooral opnemen als best practice in inleidend document oauth

dit is geen specificatie of RFC maar een optionele functie

#### Introductie

De nieuwe versie van het OAuth NL profiel voegt onder meer de mogelijkheid voor het gebruik van opaque tokens als optie bij token response, binnen het profiel. Het is belangrijk om te benadrukken dat dit is geen specificatie of RFC is, maar een optionele functie.
Zie ook v1.1.0-rc.2 op :  https://logius-standaarden.github.io/OAuth-NL-profiel/ 

Dit is toegevoegd als best practice, op basis van de security ontwikkelingen en privacyoverwegingen die wij rondom OAuth zien. Het is immers sterk aangeraden om het externe OAuth access_token token in te wisselen voor een intern access_token. Het externe token kan een JWT token zijn met weinig/geen claims of een opaque token. 
> Aangezien het access_token niet gevalideerd hoort te worden door de client (RP) kan het even goed een opaque token zijn. 



#### Context / wat zijn opaque tokens?

In de context van OAuth wil je als client zijnde vaak een resource aanspreken. Als je volledig door de authorisatie komt krijg je een token mee als bewijs van jou toegang tot de resource - deze access token, vaak een jwt (JSON Web Token), heeft inherent (gevoelige) informatie in zich verstopt zonder enige meerwaarde voor de client. Hier komen opaque tokens aan bod.

Opaque tokens is een type toegangstoken welke geen informatie onthult over de gebruiker of het token zelf. In wezen zijn het willekeurige strings die dienen als referenties naar informatie die op de (OAuth/Open ID provider) server is opgeslagen.

#### Voorbeeld architectuur

![Opaque token architecture](./media/opaque_token.drawio.svg)

Hierboven zien we een voorbeeld architectuur/flow met de nodige building blocks om de werking van opaque tokens aan te duiden. Zoals we al weten gaat het bij OAuth om het scheiden van de Authorization Server van de Resource Server en deze onafhankelijk maken van de gebruikte client. 
We zien dat de access tokens aan de client kant (tot en met de Mediator/API gateway) als opaque tokens kunnen worden geimplementeerd. De bijbehorende OAuth server moet deze kunnen vertalen naar de bijbehordende JWT's en deze zal via de API gateways worden meegestuurd naar de service, die in dit geval onder een registratie valt. De service kan dan gewoon geimplementeerd worden met JWT's in mind.

> _Toevoegen verschil OAuth server aan de registratie kant?_


#### Voordelen van Opaque Tokens
- ##### Minder privacygevoelig
    Omdat opaque tokens geen gebruikers informatie bevatte, is er minder kans op lekkage van gevoelige gegevens. 

- ##### Beperkte risico's bij diefstal
    Daarnaast maakt het ook andere geimplementeerde mechanismen aan de server kant veiliger. Denk bijvoorbeeld aan refresh tokens - ook al zou er een token gecompromitteerd zijn, het is dan voor de boosdoener nog steeds niet af te leiden wat voor eigenschappen deze token bezit en daarmee de resources the misbruiken.


#### Implementatie overwegingen

- ##### Token Generatie
    Bij het genereren van opaque tokens is het cruciaal om een veilige random generators te gebruiken. Hier bestaan al libraries en frameworks voor.

- ##### Token Opslag
    De server moet een veilige opslag van tokens en hun bijbehorende metadata (bijv. gebruikers-ID, vervaltijd, scopes) bijhouden. Denk aan een database of in-memory opslag, waarbij de toegang goed moet worden beschermd.

- ##### Token Validatie
    Bij ontvangst van een nieuwe request moet de server vooralsnog de validatieprocessen voor tokens implementeren. Denk hierbij aan het controleren van het bestaan en de geldigheid van een token; verifiëren van de bijbehorende gebruikerspermissies; checken op vervaldatum etc.


### 2. Rich Authorization Request (RAR)


#### Introductie

In de opkomende release (1.2) van [het OAuth NL profiel](https://logius-standaarden.github.io/OAuth-NL-profiel/) gaan wij een extra security maatregel toevoegen, namelijk RAR. Dit is beschreven in een stabiele [RFC](https://www.rfc-editor.org/rfc/rfc9396.html) die ondertussen door de meeste marktpartijen wordt ondersteunt. Bovendien is dit ook een manier om de autorisatie/toegangsverlening aan te vullen vanuit OAuth 2.0 .



#### Context / wat zijn Rich Authorization Requests?

Het "OAuth 2.0 Authorization Framework" [RFC6749] definieert de `scope` parameter waarmee OAuth-clients de aangevraagde scope van een toegangstoken kunnen specificeren. Dit mechanisme is voldoende geschikt voor adynamische scenario’s en grofmazige autorisatieverzoeken - denk aan "geef me leesrechten voor de resource-owner's profiel". 
>voorbeeld kan beter worden opgeschreven
Dit is echter niet voldoende om fijnmazige autorisatie te specificeren, zoals: "laat me een bedrag van 45 euro overmaken naar Verkoper A" of "geef me lees rechten tot map A en schrijf rechten tot bestand X".
Maar ook her-authenticatie en step-up-authenticatie voor eenmalige betalingsgoedkeuringen, andere expliciete transacties, het ondertekenen van documenten of het aanvragen/goedkeuren van toegang tot specifieke dossiers of documenten.
Dit zijn allerlei voorbeelden waar het wenselijk is om aanvullende details mee te geven naar de AS (Authorization Server), buiten alleen de `scope` parameter.

Met Rich Authorization Requests (RAR) kunnen clients een `authorization_details` claim meesturen met aanvullende details, waardoor fijnmazigere autorisatie mogelijk wordt. Hierdoor kan de RS (Resource Server) ook gedetailleerde autorisatie voor specifieke verzoeken implementeren.
We illustreren de werking aan de hand van de voorbeelden hieronder.

#### Voorbeeld 1: Betaling in het Financiële Domein (deze is WIP)

##### Context:
Een gebruiker wil een betaling van **€50** uitvoeren naar een verkoper (**Merchant XYZ**) via een financiële app. De app gebruikt RAR voor gedetailleerde autorisatie.

##### Flow en Technische Details:

###### Initiëren van de Betaling:
- De betaler start een betaling via een webapplicatie of mobiele applicatie (bijv. een webshop).
- De applicatie verzamelt de benodigde gegevens (bijv. bedrag, ontvanger, omschrijving).

###### OAutorisatieverzoek met RAR:
- De applicatie stuurt een Authorization Request naar de OAuth 2.0 Authorization Server van de bank, conform de RFC 6749 specificaties.

```http
GET /authorize?
  response_type=code
  &client_id=payment_app_123
  &redirect_uri=https://app.example.com/callback
  &state=abc123xyz
  &authorization_details=%7B
    %22type%22%3A%22payment_initiation%22%2C
    %22amount%22%3A%7B
      %22value%22%3A%2250%22%2C
      %22currency%22%3A%22EUR%22
    %7D%2C
    %22creditor_name%22%3A%22Merchant%20XYZ%22%2C
    %22creditor_iban%22%3A%22NL12BANK34567890%22%2C
    %22description%22%3A%22Betaling%20voor%20dienst%22
  %7D HTTP/1.1
Host: auth.bank.example
```
Decoded authorization_details (JSON):

json
{
  "type": "payment_initiation",
  "amount": {
    "value": "50",
    "currency": "EUR"
  },
  "creditor_name": "Merchant XYZ",
  "creditor_iban": "NL12BANK34567890",
  "description": "Betaling voor dienst"
}
- Het verzoek bevat de volgende parameters:
  - `response_type=code`: Het verzoek vraagt om een autorisatiecode.
  - `client_id`: De unieke identifier van de applicatie die de betaling aanvraagt.
  - `redirect_uri`: De URL naar waar de betaler wordt teruggestuurd na goedkeuring.
  - `scope=payment:approve`: De scope voor toegang tot betalingsgerelateerde gegevens.
  - `state`: Een uniek anti-CSRF token om de integriteit van het verzoek te waarborgen.
  - `payment_details`: Een gestructureerd JSON-object met details van de betaling (bedrag, begunstigde, referentie).

###### Authenticatie van de Betaler:
- De betaler wordt doorgestuurd naar de bank's OAuth-provider.
- De betaler moet zich identificeren (bijv. via DigiD, bank-ID, of SMS).
- De bank verifieert de identiteit van de betaler.

###### Weergave van de Betaling:
- Na succesvolle authenticatie wordt de betaler gepresenteerd met de betalingsdetails in de interface van de bank.
- De bank toont een formulier of pagina met een overzicht van de transactie.

###### Goedkeuring of Weigering van de Betaling:
- De betaler moet expliciet de betaling goedkeuren door op een knop "Betaling goedkeuren" te klikken.
  - Indien goedgekeurd, wordt de transactie voortgezet.
  - Indien geweigerd, wordt de betaling geannuleerd en krijgt de applicatie een foutmelding terug (bijv. `error=access_denied`).

###### Terugkoppeling naar de Applicatie:
- Bij goedkeuring wordt de betaler omgeleid naar de `redirect_uri` met de autorisatiecode.
- De URL ziet er bijvoorbeeld als volgt uit:


#### Voorbeeld 2: Leesrechten in het Financiële Domein 

##### Context:
Een gebruiker wil via een financiële app ("FinApp") de boekhoudsoftware ("BoekSoft") toestemming geven om alleen **leesrechten** te krijgen op **transacties** van één specifieke bankrekening.

##### Flow en Technische Details:


###### 1. Autorisatieverzoek naar Authorisatie Endpoint

````http
GET /authorize?
  response_type=code&
  client_id=boeksoft-client-id&
  redirect_uri=https%3A%2F%2Fboeksoft.nl%2Fcallback&
  state=xyz123&
  authorization_details=%5B%7B%22type%22%3A%22transaction%22%2C%22actions%22%3A%5B%22read%22%5D%2C%22locations%22%3A%5B%22urn%3Abank%3Aaccount%3A12345678%22%5D%2C%22datatypes%22%3A%5B%22transactions%22%5D%7D%5D
````

#### Inhoud van het `authorization_details` parameter

```json
[
  {
    "type": "transaction",
    "actions": ["read"],
    "locations": ["urn:bank:account:12345678"],
    "datatypes": ["transactions"]
  }
]
```

| Parameter           | Betekenis                                                            |
|---------------------|----------------------------------------------------------------------|
| `type`              | Type toegang (bijv. `"transaction"`)                                 |
| `actions`           | Acties toegestaan (bijv. `"read"`)                                   |
| `locations`         | Specifieke resource (`urn:bank:account:12345678`)                    |
| `datatypes`         | Type data (bijv. `"transactions"`)                                   |

---

###### 2. Gebruiker geeft toestemming (Redirect met autorisatiecode)

```http
HTTP/1.1 302 Found
Location: https://boeksoft.nl/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz123
```

---

###### 3. Token Request

````http
POST /token HTTP/1.1
Host: bank.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=SplxlOBeZQQYbYS6WxSbIA&
redirect_uri=https%3A%2F%2Fboeksoft.nl%2Fcallback&
client_id=boeksoft-client-id&
client_secret=geheim
````

###### 4. Token Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid",  //betere functionele scope nodig
  "authorization_details": [
    {
      "type": "transaction",
      "actions": ["read"],
      "locations": ["urn:bank:account:12345678"],
      "datatypes": ["transactions"]
    }
  ]
}
```

---

###### 5. Toegang tot resource (API Verzoek met Token)


```http
GET /accounts/12345678/transactions
Authorization: Bearer eyJhbGciOi...
```

---


## Referenties

[Link naar de lijst van verplichte standaarden]

https://forumstandaardisatie.nl/open-standaarden/verplicht

[link naar de standaard]

https://forumstandaardisatie.nl/open-standaarden/verplicht#:~:text=NL%20GOV%20Assurance%20profile%20for%20OAuth%202.0

[link naar de logius standaard]

https://publicatie.centrumvoorstandaarden.nl/api/oauth/

RFC 6749: The OAuth 2.0 Authorization Framework
OWASP: JSON Web Tokens (JWT) Cheat Sheet
NIST Special Publication 800-63: Digital Identity Guidelines
