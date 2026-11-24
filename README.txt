KISAILU.NET DARTS LIVE OVERLAY – VERCEL + GITHUB JSON

Sisältö:
- darts-tv-overlay.html: läpinäkyvä 650 x 120 OBS-tulostaulu. Kisailu.netin live-tiedot haetaan 2 sekunnin välein.
- index.html: erillinen ohjauspaneeli, toimii toisella laitteella.
- darts-api-testi.html: automaattinen getscore/getmatch/getall-testi; mittaa vasteajat, kirjaa vastauksen sisältömuutokset ja vie CSV/JSON.
- api/state.js: tallentaa valinnan GitHub-repositorion JSON-tiedostoon GitHub Contents API:n avulla.
- api/probe.js: turvallinen välityspalvelin sallittuihin Kisailu-testi-endpointteihin.

VERCEL ENVIRONMENT VARIABLES
Säilytä Kisailu-avaimet kuten ennen:
KISAILU_API_KEY
KISAILU_API_VALIDATION
KISAILU_AUTHORIZATION (vain jos käytössä)

Lisää ohjaustilaa varten:
GITHUB_TOKEN = GitHub fine-grained token, jolla on Contents: Read and write vain tähän repoosi.
GITHUB_REPOSITORY = omistaja/repon-nimi (suositus: erillinen pieni state-repo, jota ei ole yhdistetty tähän Vercel-projektiin)
GITHUB_STATE_PATH = data/darts-state.json (valinnainen, tämä on oletus)
GITHUB_BRANCH = main (valinnainen, oletus main)
DARTS_CONTROL_TOKEN = itse valitsemasi pitkä salainen tunnus, jota käytetään vain ohjauspaneelissa

TÄRKEÄÄ GITHUB-TOKENISTA
Älä koskaan lisää GITHUB_TOKEN-arvoa HTML-tiedostoon tai GitHubiin. Se pysyy vain Vercelin Environment Variables -asetuksissa. GitHub token tarvitsee Contents: Read and write -oikeuden valittuun repositorioon. Tallenna ympäristömuuttujat ja tee Redeploy.

KÄYTTÖÖNOTTO
1. Kopioi tämän kansion sisältö GitHub-repositorioon, joka on yhdistetty Verceliin.
2. Lisää yllä olevat ympäristömuuttujat Vercelin Project Settings > Environment Variables.
3. Tee Redeploy.
4. Ohjauspaneeli: https://OMA-PROJEKTI.vercel.app/index.html
5. OBS Browser Source: https://OMA-PROJEKTI.vercel.app/darts-tv-overlay.html?controls=0. Set Browser Source width/height to the full OBS canvas (e.g. 1920 x 1080); the 650 x 123 scoreboard is positioned 50 px from the right and bottom edges. The overlay page has no visible selection controls.
6. API-testi: https://OMA-PROJEKTI.vercel.app/darts-api-testi.html

GITHUB JSON -TALLENNUS
Ohjauspaneelin tallennus muuttaa data/darts-state.json -tiedostoa GITHUB_REPOSITORY-repositoriossa. Jokainen valinta luo GitHub-commitin. ÄLÄ käytä tähän samaa tuotantorepositoriota, joka käynnistää tämän Vercel-projektin deployn jokaisesta commitista: käytä erillistä pientä GitHub-repoa vain ohjaustilalle. Tämä ei ole uusi tallennuspalvelu, vaan GitHub JSON -tiedosto. Se ei käynnistä live-tulosten hakua eikä tallenna tuloksia. Ohjausvalinnan lukuväli overlayssa on 5 s; tulostietojen kyselyväli on erikseen 2 s.

KILPAILUN NÄYTETTÄVÄ NIMI
Ohjauspaneelin Kilpailu / sarja -valinnan alla on vapaaehtoinen kenttä “Tulostaulussa näkyvä kilpailun nimi”. Jos kenttä jätetään tyhjäksi, tulostaulu näyttää Kisailusta haetun alkuperäisen nimen. Jos kenttään kirjoitetaan oma nimi, sitä käytetään vain tulostaulun keltaisessa otsikossa. Oma nimi tallentuu samaan data/darts-state.json-ohjaustilaan (displayTitle-kenttä), ja sen enimmäispituus on 64 merkkiä. Kilpailun tunniste, ottelulista ja ottelutiedot pysyvät ennallaan.

API-TESTIN KÄYTTÖ
Avaa darts-api-testi.html. Aseta Event ID. Jos getscore/getmatch vaatii Game ID:n, liitä GAM#... tunniste Game ID -kenttään. Tarkista kolmen endpointin JSON-payloadit ennen testiä; oletuspayloadit ovat alustavia, koska Kisailun getscore/getmatch-payloadien tarkkaa muotoa ei ole vahvistettu tässä paketissa. Testi kysyy kaikkia kolmea endpointia rinnakkain, näyttää vasteajat ja havaitsee vastaussisällön muutokset. Vie JSON/CSV analyysiä varten.

RAJOITUKSET
- GitHub API:n käyttörajat ja tallennuksen viive koskevat ohjausvalintaa, eivät suoraan live-tuloskyselyä.
- 2 sekunnin kyselyväli ei takaa, että Kisailu.netin taustajärjestelmä päivittää tiedon kahdessa sekunnissa; se määrittää vain tämän overlayn kyselytiheyden.
- Testisivun getscore/getmatch payloadit pitää tarvittaessa sovittaa todelliseen Kisailu API -pyyntöön selaimen Network-välilehdeltä.


OTTELULISTAN SAILYMINEN (korjaus): game/getall palauttaa GameData-kentän XOR-koodattuna. Overlay purkaa sen Id-kentän avulla ja näyttää myös päättyneet ottelut valintalistassa. Automaattitila valitsee ensin pelaajilla täytetyn ottelun, jolla ei ole EndTime-arvoa; jos sellaisia ei ole, se näyttää viimeisimmän oikeilla pelaajilla pelatun ottelun. API-pyyntö käyttää Reverse-kenttää (EVE#...).


TULOSTAULUN URL-PARAMETRIT
Kaikki parametrit ovat valinnaisia. Oletusarvot: width=650, height=123, right=50, bottom=50, scale=100, refresh=2000, theme=yellow.
- width=650 : grafiikan leveys pikseleinä (320–1920)
- height=123 : grafiikan korkeus pikseleinä (70–500)
- right=50 : etäisyys oikeasta reunasta pikseleinä (0–2000)
- bottom=50 : etäisyys alareunasta pikseleinä (0–2000)
- scale=100 : koko grafiikan skaalaus prosentteina (50–200)
- hideStats=1 : piilottaa tilastorivin; oletuskorkeus ilman height-parametria 96 px
- hideScore=1 : piilottaa jäljellä olevien pisteiden keltaiset pistelaatikot
- refresh=2000 : Kisailu.netin ottelutietojen hakuväli millisekunteina (500–60000)
- theme=yellow|green|blue|red : korostusvärit; oletus yellow
- controls=0 : piilottaa sivun mahdollisen ohjauspaneelin

ESIMERKKI
/darts-tv-overlay.html?controls=0&width=800&height=150&right=50&bottom=50&scale=100&refresh=2000&theme=yellow

Piilota tilastot: /darts-tv-overlay.html?controls=0&hideStats=1
Piilota tuloslaatikot: /darts-tv-overlay.html?controls=0&hideScore=1
Skaalaa 120 prosenttiin: /darts-tv-overlay.html?controls=0&scale=120
