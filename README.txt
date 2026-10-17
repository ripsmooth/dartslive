DARTS TV KISAILU - OVERLAY

Sisältö:
- darts-tv-overlay.html: 650 x 120 px TV-tyylinen tulostaulu + ohjauspaneeli
- matches.json: ladattujen Kisailu.net-aineistojen yhdistetty ottelu- ja pelaajalista

Käyttö:
1. Julkaise tiedostot samalla staattisella hostilla (esim. GitHub Pages tai Vercel).
2. Ohjauspaneeli: avaa darts-tv-overlay.html ja valitse ottelu.
3. OBS Browser Source: käytä osoitetta darts-tv-overlay.html?controls=0, leveys 650, korkeus 120.
4. Tausta on läpinäkyvä OBS:n ympäriltä. Grafiikan sisäinen pohja on tumma, korostukset keltaiset ja vihreät.

TÄRKEÄÄ: tämä paketti yhdistää toimitetut tapahtuma- ja game/getall JSON-snapshotit. Se ei vielä hae automaattisesti Kisailu.netin API:sta. Ladatuissa game/getall-tiedoissa monien otteluiden pelaajaindeksit ovat -1 ja osa tuloskentistä puuttuu, joten nimet/pisteet voi tarvittaessa korjata ohjauspaneelissa. Automaattista API-yhteyttä ei pidä merkitä toimivaksi ennen kuin selaimen Network-välilehdeltä on varmistettu pyyntömetodi, payload ja CORS/evästevaatimukset.
