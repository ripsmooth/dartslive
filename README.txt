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
- hideAvg=1 : piilottaa ottelun kokonaiskeskiarvon KA-sarakkeen (oletuksena näkyy)
- hideAvgLeg=1 : piilottaa nykyisen legin keskiarvon KA LEG -sarakkeen (oletuksena näkyy)
- hideScore=1 : piilottaa jäljellä olevien pisteiden keltaiset pistelaatikot
- refresh=2000 : Kisailu.netin ottelutietojen hakuväli millisekunteina (500–60000)
- theme=yellow|green|blue|red : korostusvärit; oletus yellow
- controls=0 : piilottaa sivun mahdollisen ohjauspaneelin

ESIMERKKI
/darts-tv-overlay.html?controls=0&width=800&height=150&right=50&bottom=50&scale=100&refresh=2000&theme=yellow

Piilota tilastot: /darts-tv-overlay.html?controls=0&hideStats=1
Piilota ottelun KA-sarake: /darts-tv-overlay.html?controls=0&hideAvg=1
Piilota KA LEG -sarake: /darts-tv-overlay.html?controls=0&hideAvgLeg=1
Piilota tuloslaatikot: /darts-tv-overlay.html?controls=0&hideScore=1
Skaalaa 120 prosenttiin: /darts-tv-overlay.html?controls=0&scale=120

OTTELULISTAN KÄYNNISSÄ OLEVAT OTTELUT
Ohjauspaneelin ottelulistassa Automaattinen: käynnissä oleva -valinnan jälkeen näytetään ensin Kisailun käynnissä olevat ottelut. Kisailun GameData.status-arvoa 2 käytetään käynnissäolon tunnistamiseen; päättymisaika (EndTime) sulkee ottelun pois. Käynnissä olevat merkitään listassa tekstillä "● KÄYNNISSÄ". Muiden otteluiden keskinäinen järjestys säilyy. Lista päivittyy, kun kilpailu haetaan tai Päivitä ottelulista -painiketta painetaan.


OTTELUN LOPPUTULOKSEN SÄILYTTÄMINEN
- Overlay tallentaa viimeisimmän näytetyn ottelun tilanteen selaimen sessionStorageen, joten se voidaan palauttaa sivun uudelleenlatauksen jälkeen samassa selainistunnossa.
- Kun ottelu päättyy (EndTime tai status 4) tai automaattitilassa ottelu katoaa onnistuneesta Kisailu-haun vastauksesta, tulostaulu säilyttää viimeisimmän tilanteen ja näyttää tunnisteen LOPPUTULOS.
- Lopputulos pysyy näkyvissä, kunnes Kisailu ilmoittaa uuden käynnissä olevan ottelun (status 2). Sen jälkeen tulostaulu vaihtuu automaattisesti uuteen otteluun.
- Jos Kisailu-haku epäonnistuu hetkellisesti, viimeisin tulostaulu säilytetään tyhjentämisen sijaan.


SARJATAULUKON ULKOASUN PÄIVITYS
- Oletusleveys 1188 px (noin 20 % aiempaa suurempi)
- Sarjataulukko keskitetään selain-/OBS-näkymään sekä vaaka- että pystysuunnassa
- Joukkue-sarakkeelle varattu 28 % taulukon leveydestä
- Heitto ka. näytetään kolmen tikan keskiarvona: (TP / TD) * 3
- Oletusfontteja ja rivikorkeutta suurennettu noin 20 %
- URL-parametrit scale, width, refresh sekä sarja ja season säilyvät käytössä

SARJATAULUKON LOHKOJAKO
- Sarjataulukko ryhmittelee joukkueet erillisiksi taulukoiksi Kisailun EventDetails.Group-kentän perusteella.
- Jokaisella lohkolla on oma otsikko (LOHKO 1, LOHKO 2 jne.) sekä oma sijoitusjärjestys.
- Avoin 1. divisioona (M1): 2 lohkoa.
- Avoin 2. divisioona (M2): 6 lohkoa.
- Avoin 3. divisioona (M3): useita lohkoja; lohkoja voi rajata URL-parametrilla.
- Naisten 1. divisioona (N1): lohkot näytetään samalla tavalla.
- Oletuksena näytetään kaikki valitun sarjan lohkot.

Sarjataulukon URL-parametrit:
- ?sarja=M1 : avoin 1. divisioona, kaikki lohkot erillisinä taulukoina
- ?sarja=M2 : avoin 2. divisioona, kaikki lohkot erillisinä taulukoina
- ?sarja=M3&lohko=1 : näyttää vain avoimen 3. divisioonan lohkon 1
- &lohko=2 : rajaa näkymän valitun sarjan lohkoon 2
- &lohko=all : näyttää kaikki lohkot (oletus)

Huomaa: usean lohkon näyttäminen peräkkäin kasvattaa sivun korkeutta. OBS Browser Source -lähteen korkeutta voi kasvattaa, tai yksittäisen lohkon voi näyttää lohko-parametrilla.


OTTELUPAIVAN KAAVIO JA OTTELUJARJESTYS
- darts-tv-ottelulista.html: kaikki tapahtuman ottelut Kisailun palauttamassa id-jarjestyksessa.
- darts-tv-kaavio.html: graafinen ottelukaavio, joka sijoittaa ottelukortit GameData.x- ja GameData.y-koordinaattien mukaan ja piirtää yhteydet, kun needs_opponent_push kertoo edeltavan ottelun.
- api/diagram.js: erillinen game/getall-valityspalvelin; pyynto sisaltaa EventId, Now ja Delta:false. Vanha api/live.js ja tulostaulun kysely pysyvat muuttumattomina.
- index.html: ohjaus molempiin nakymiin, EventId, leveys, skaalaus ja paivitysvali.
Esimerkkitapahtuma: EVE#sml26p0426. URL-parametrit: event, width, scale, refresh.
Huomaa: tarkka tapahtuman otteludata tulee Kisailusta vasta Vercel-julkaisun jalkeen. Taulukon ja listan renderointia ei ole voitu testata verkon yli tassa tyoymparistossa.


GRAFIIKKAPÄIVITYS
- Ottelujärjestys näyttää enintään 16 ottelua kerrallaan kahdessa pystysarakkeessa: ottelut 1–8 vasemmalla ja 9–16 oikealla. Jos otteluita on yli 16, näkymä vaihtaa automaattisesti seuraavaan 16 ottelun sivuun.
- Ottelujärjestyksessä näkyvät molempien pelaajien ottelukohtaiset 3 tikan keskiarvot. Laskenta käyttää samaa LegPoints/LegDarts-laskentaa kuin varsinainen live-tulostaulu.
- Ottelujärjestys ja ottelukaavio sovitetaan automaattisesti 16:9-kuvaruutuun; sisältö ei vaadi selaamista.
- Ottelujärjestys noudattaa valittua Darts TV -layoutia 1: yläreunassa DARTS TV -brändi ja keltainen otsikkopalkki, ottelunumerot keltaisissa tunnisteissa, pelaajien keskiarvot vihreällä, tulos omassa keltaisessa kentässään sekä vaihe/taulu ja tilatunniste omissa sarakkeissaan.
- Ottelukaavio säilyttää aiemman graafisen toteutuksensa. Vanha live-tulostaulu ja sarjataulukko eivät muutu.

PÄIVITYS 25.11.2026 – OTTELUJÄRJESTYSGRAFIIKAN KORJAUKSET
- Ottelujärjestyksen pelaajakeskiarvo käyttää nyt samaa laskentaperustaa kuin toimiva darts-tv-overlay: Darts.LegDarts, Darts.LegPoints sekä käynnissä olevan legin tikat ja jäljellä oleva pistemäärä. Aiempi GameType-tarkistus, joka saattoi näyttää kaikille pelaajille viivan, poistettiin.
- Ottelujärjestyksen grafiikasta poistettiin Darts TV -logo.
- Kisailun EVE#-tapahtumatunnistetta ei näytetä ottelujärjestyksen eikä ottelukaavion julkisessa grafiikassa. Tunniste säilyy teknisessä URL-parametrissa ja ohjauspaneelin EventId-kentässä, jotta datan haku toimii.
- Ottelujärjestyksen ottelukortin tiedot näytetään erillisillä riveillä: vaihe, taulu ja kellonaika.
- Varsinaista live-tulostaulua ja sarjataulukon logiikkaa ei muutettu.

Uudet keskiarvoparametrit (molemmat näkyvät oletuksena; aseta arvoksi 0 tai poista parametri näyttääksesi sarakkeen):
- hideAvg=1 : piilottaa koko ottelun KA-keskiarvon.
- hideAvgLeg=1 : piilottaa käynnissä olevan (tai päättyneen ottelun viimeisen) legin KA LEG -keskiarvon.
Parametrit ovat toisistaan riippumattomia ja ne voi yhdistää samaan osoitteeseen. Esim. hideAvg=1&hideAvgLeg=0 näyttää vain KA LEG -sarakkeen.
