# kaupunki-kuntoon

![kartta_hfr](https://user-images.githubusercontent.com/17712488/216606267-18cea20d-c943-4b3c-8519-90803630afcd.gif)


Live: https://lauriniva.github.io/kaupunki-kuntoon/

##Harjoitusprojekti

Sivustolla voi tehdä ilmoituksen puutteesta tai ongelmasta, kuten kuopasta tiessä tai kaatuneesta puusta.

Käyttäjillä eri rooleja:
 - perus käyttäjä voi lisätä raportteja
 - työntekijä voi merkata oman osastonsa raportteja työn alle tai valmiiksi
 - operaattori/työnohjaaja voi ohjata raportteja osastoille
 - manager voi muokata työntekijöiden osastoja

##Itselle kokonaan uutta:
- kartan näyttäminen ja asioiden merkkaaminen kartalle
  -Leaflet.js
- Mantine UI-kirjasto
- Redux omassa projektissa
- Supabase backend

<details>
  <summary>---Stack---</summary>

- Frontend
    - React ( Create React App)
    - Redux Toolkit https://redux-toolkit.js.org/
    - Mantine https://ui.mantine.dev/
    - React Leaflet https://react-leaflet.js.org/
    - Leaflet.js https://leafletjs.com/
- Backend
    - Supabase
        - Db
        - Auth
        - Bucket (kuvat)
        
 </details> 

<details>
  <summary>---Idea---</summary>


Käyttäjät voi merkata kartalle tekstin ja kuvan kanssa paikan, jossa jotain korjattavaa tms.
Esim. kuoppa tiessä, tie useasti auraamatta, huono näkyvyys risteyksessä, puu kaatunut...

Henkilökunta näkee kaikki ilmoitukset ja voi merkata ilmoitukselle osaston ja/tai vastuuhenkilön.

Ilmoituksen tehnyt käyttäjä näkee, kun asia etenee tai kuitataan tehdyksi.

---???---
Muiden käyttäjien ilmoitusten näkeminen?
Valmiit pohjat? (Esim Tie -> Kuoppa -> Vaarallinen )
</details>
   

<details>
  <summary>---MVP---</summary>

- 2 käyttäjäryhmää
    - käyttäjä
        - Voi lisätä merkinnän
        - Näkee omat merkintänsä kartalla
    - henkilökunta
        - Näkee kaikki merkinnät kartalla
        - Voi vaihtaa merkinnän tilaa
        - Voi vaihtaa merkinnän vastuuosastoa / “omistajaa”

- Merkinnän lisääminen
    - Paina nappia “Ilmoita”
    - Täytä tiedot
        - Kuvaus (teksti)
        - Osasto (dropdown) (väri markkerille)
            - Katu
            - Viheralueet
            - Sähkö
            - Viemärit
        - Valokuva
            - Pakkaa selaimessa
        - Sijainti
            - Avaa kartan
                - Paikantaa ensin käyttäjän sijainnin mukaan
                    - Jos lupaa paikannuksen ei saada, paikantaa keskustaan
            - Nappia painamalla merkitsee kartan keskipisteen ylös (tähtäin)
 </details> 

