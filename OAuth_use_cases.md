# OAuth - Advanced security


## Inleiding

## Use-cases extra security features


### 1. Opaque tokens
Toevoegen aan Inleidend document extra security optie.

Met name een privacy aspect dat je geen persoonsgegevens kan lekken in een opaque token

vooral opnemen als best practice in inleidend document oauth

dit is geen specificatie of RFC maar een optionele functie

#### Introductie

De nieuwe versie van het OAuth NL profiel voegt onder meer de mogelijkheid voor het gebruik van opaque tokens als optie bij token response, binnen het profiel. Het is belangrijk om te benadrukken dat dit is geen specificatie of RFC is, maar een optionele functie.
Zie ook v1.1.0-rc.2 op :  https://logius-standaarden.github.io/OAuth-NL-profiel/ 

Dit is toegevoegd als best practice, op basis van het rapport van Gartner "Architect a Modern API Access Control Strategy" ID G00723547, waar het sterk is aangeraden om het externe OAuth access_token token in te wisselen voor een intern access_token. Het externe token kan een JWT token zijn met weinig/geen claims of een opaque token. Aangezien het access_token niet gevalideerd hoort te worden door de client (RP) kan het even goed een opaque token zijn. Gartner raadt gebruik van opaque tokens aan om privacyoverwegingen.



#### Context / wat zijn opaque tokens?

In de context van OAuth wil je als client zijnde vaak een resource aanspreken. Als je volledig door de authorisatie komt krijg je een token mee als bewijs van jou toegang tot de resource - deze access token, vaak een jwt (JSON Web Token), heeft inherent (gevoelige) informatie in zich verstopt zonder enige meerwaarde voor de client. Hier komen opaque tokens aan bod.

Opaque token is een type access token that do not reveal any information about the user or the token itself. Unlike JWTs (JSON Web Tokens), which encode information and can be decoded by clients, opaque tokens are essentially random strings that serve as references to information stored on the server.
Opaque tokens is een type toegangstoken welke geen informatie onthult over de gebruiker of het token zelf. In wezen zijn het willekeurige strings die dienen als referenties naar informatie die op de (OAuth/Open ID provider) server is opgeslagen.

#### Voorbeeld architectuur

Iets verzinnen?

![Opaque token architecture](./media/opaque_token_gartner.png)

De kern van OAuth is uiteraard het scheiden van de Authorization Server van de Resource Server en deze onafhankelijk te maken van de gebruikte client. Dit blijkt mooi uit bovenstaande flow en voorbeeld. Belangrijkste implicatie voor de architectuur is daarmee dan ook dat voor een dergelijke oplossing waarbij OAuth wordt toegepast de user niet alleen een client en een resource server wordt aangeboden, maar ook een authorization server (drie autonome architectural building blocks). Dit kan een authorization server zijn van de organisatie zelf, zoals in het voorbeeld, maar ook een authorization server van een derde partij zoals in de context al wordt gesuggereerd en zoals je kan zien in het inlogscherm van Spotify waarbij je ook kan registreren met Facebook, Apple of Google. In de context van de Nederlandse overheidsarchitectuur is het dus van belang bij een solution architectuur voor een voorziening goed na te gaan en documenteren welke partijen worden voorzien in de genoemde building blocks. Zie ook het theme IAM en API van de Nora en uiteraard de genoemde standaarden zoals gepubliceerd door Logius en het Forum Standaardisatie.


#### Voordelen van Opaque Tokens
- Minder privacygevoelig
    Omdat opaque tokens geen gebruikers informatie bevatte, is er minder kans op lekkage van gevoelige gegevens. 
- Gelimiteerde risico's bij diefstal
    Daarnaast maakt het ook andere geimplementeerde mechanismen aan de server kant veiliger. Denk bijvoorbeeld aan refresh tokens - ook al zou er een token gecompromitteerd zijn, het is dan voor de boosdoener nog steeds niet af te leiden wat voor eigenschappen deze token bezit en daarmee de resources the misbruiken.


#### Implementatie overwegingen

- ##### Token Generatie
    Bij het genereren van opaque tokens is het cruciaal om een veilige random generators te gebruiken. Hier bestaan al liraries en frameworks voor.

- ##### Token Opslag
    De server moet een veilige opslag van tokens en hun bijbehorende metadata (bijv. gebruikers-ID, vervaltijd, scopes) bijhouden. Denk aan een database of in-memory opslag, waarbij de toegang goed moet worden beschermd.

- ##### Token Validatie
    Bij ontvangst van een nieuwe request moet de server vooralsnog de validatieprocessen voor tokens implementeren. Denk hierbij aan het controleren van het bestaan en de geldigheid van een token; verifiëren van de bijbehorende gebruikerspermissies; checken op vervaldatum etc.



## Referenties

[Coursera basis training met Postman]

https://www.coursera.org/projects/api-testing-a-real-application-via-postman

[Link naar de lijst van verplichte standaarden]

https://forumstandaardisatie.nl/open-standaarden/verplicht

[link naar de standaard]

https://forumstandaardisatie.nl/open-standaarden/verplicht#:~:text=NL%20GOV%20Assurance%20profile%20for%20OAuth%202.0

[link naar de logius standaard]

https://publicatie.centrumvoorstandaarden.nl/api/oauth/

[link naar het IAM thema van de NORA]

https://www.noraonline.nl/wiki/Identity_%26_Access_Management_(IAM)

[link naar het API Thema van de NORA]

https://www.noraonline.nl/wiki/API

[Het JWT token kan  men eenvoudig decoden/inspecteren op]

RFC 6749: The OAuth 2.0 Authorization Framework
OWASP: JSON Web Tokens (JWT) Cheat Sheet
NIST Special Publication 800-63: Digital Identity Guidelines
