KISAILU.NET DARTS LIVE OVERLAY – VERCEL

Tämä on live-kytkennän pohjapaketti kilpailulle EVE#robgoc4, Synttärikisat Singelit AS.
Grafiikka 650 x 120 px, läpinäkyvä tausta, päivitys 3 sekunnin välein.

JULKAISU
1. Lataa kansion sisältö GitHub-repositorioon ja yhdistä repo Verceliin (Root Directory = projektin juuri).
2. Lisää Vercelin Project Settings > Environment Variables -kohtaan:
   KISAILU_API_KEY       = Kisailu-pyynnön x-api-key-arvo
   KISAILU_API_VALIDATION = Kisailu-pyynnön x-api-validation-arvo
   KISAILU_AUTHORIZATION  = vain jos alkuperäinen pyyntö oikeasti tarvitsee Authorization-otsakkeen; käytä arvoa täsmälleen sellaisena kuin onnistuneessa Network-pyynnössä.
3. Redeploy projekti.
4. Avaa ohjauspaneeli: https://OMA-PROJEKTI.vercel.app/darts-tv-overlay.html
5. Lisää OBS:ään Browser Source samalla osoitteella ja perään ?controls=0. Leveys 650, korkeus 120.

TÄRKEÄÄ
- Älä laita avaimia HTML:ään tai games.json-tiedostoon. Säilytä ne vain Vercelin Environment Variables -asetuksissa.
- Paketin games.json perustuu käyttäjän toimittamaan tapahtuma- ja game/getall-vastaukseen. Ottelun valinta/automaattivalinta käyttää status-arvoja, mutta Kisailun statuskoodien tarkka merkitys on varmistettava käytännössä.
- Live-score tulkitaan stats[].Darts.LegScores / LegPoints -kentistä. Jos rajapinnan tulkinta poikkeaa, tarkista tulostaulun lukemat ensimmäisessä käynnissä olevassa pelissä.
- API voi edellyttää Authorization-arvoa. Jos x-api-key tai validation-arvot ovat aidosti salaisia ja ne on jaettu aiemmin julkisesti, vaihda/kierrätä ne Kisailun hallinnassa, jos mahdollista.

Korjaus: games.json sisältää Kisailun oikeat GameId-arvot (GAM#...), ja overlay valitsee API-vastauksesta ulomman Id-kentän perusteella. Pisteet luetaan GameData.scores-taulukosta.
