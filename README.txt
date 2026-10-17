DARTS TV OVERLAY v2
- darts-tv-overlay.html: 650x120 OBS-tulostaulu ja otteluvalintapaneeli
- matches.json: Presörin perjantai -kilpailun EVE#nalvuw9 63 pelin tallennettu lista
Käyttö:
1. Pura ZIP samaan kansioon.
2. Suositus: julkaise molemmat tiedostot samalla staattisella hostilla (GitHub Pages/Vercel).
3. Avaa darts-tv-overlay.html ohjauspaneelissa, valitse ottelu pudotusvalikosta.
4. OBS Browser Source: osoite overlay-sivuun?controls=0, koko 650x120.
TÄRKEÄÄ: ottelulista perustuu tallennettuun aineistoon. Reaaliaikainen API-haku ei ole tässä paketissa vielä kytketty, koska getall-pyynnön tarkka payload ja kilpailun pelaajanimien endpoint pitää vahvistaa onnistuneesta Network-pyynnöstä. Ohjauspaneelin manuaaliset kentät toimivat.
