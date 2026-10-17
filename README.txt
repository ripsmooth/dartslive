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

API-TESTIN KÄYTTÖ
Avaa darts-api-testi.html. Aseta Event ID. Jos getscore/getmatch vaatii Game ID:n, liitä GAM#... tunniste Game ID -kenttään. Tarkista kolmen endpointin JSON-payloadit ennen testiä; oletuspayloadit ovat alustavia, koska Kisailun getscore/getmatch-payloadien tarkkaa muotoa ei ole vahvistettu tässä paketissa. Testi kysyy kaikkia kolmea endpointia rinnakkain, näyttää vasteajat ja havaitsee vastaussisällön muutokset. Vie JSON/CSV analyysiä varten.

RAJOITUKSET
- GitHub API:n käyttörajat ja tallennuksen viive koskevat ohjausvalintaa, eivät suoraan live-tuloskyselyä.
- 2 sekunnin kyselyväli ei takaa, että Kisailu.netin taustajärjestelmä päivittää tiedon kahdessa sekunnissa; se määrittää vain tämän overlayn kyselytiheyden.
- Testisivun getscore/getmatch payloadit pitää tarvittaessa sovittaa todelliseen Kisailu API -pyyntöön selaimen Network-välilehdeltä.
