# Pianificazione KalRaf28

*Documento ricostruito il 25/11/2026 dal codice del repository e dalle decisioni prese durante lo sviluppo. Aggiornato alla versione 86 (26/11/2026).*

---

## 🔁 PROMPT DI RIPRESA (da incollare in una nuova chat)

> Sto sviluppando **KalRaf28** (titolo interno "Diario Calorie"), una web app personale per contare kcal e macronutrienti usando l'API di Gemini. È online su **https://raf28.github.io/KalRaf28** ed è pubblicata dal repository GitHub **raf28/KalRaf28**: è tutta in un unico file `index.html` (HTML + CSS + JavaScript, nessun framework e nessun server), più `manifest.webmanifest`, `sw.js` (service worker), `privacy.html`, la cartella `icone/` e questo documento (`pianificazione-KalRaf28.md`). La versione attuale è la **40**.
>
> Gestisco il progetto **dallo smartphone** (Google Pixel 8, Chrome Android). Claude ha l'accesso in scrittura al repository (app GitHub "Claude" installata su KalRaf28) e può pubblicare direttamente le modifiche; in alternativa le carico io con "Add files via upload". In quel caso voglio sempre **il file `index.html` completo**, pronto da caricare, mai pezzi di codice da incollare a mano. A ogni modifica il numero di versione va aumentato di uno in fondo alla pagina Impostazioni ("Versione NN") e il commit si chiama "vNN: descrizione breve".
>
> L'app è installata sul mio Pixel come **APK Android** (TWA creata con PWABuilder, package `io.github.raf28.kalraf28`, nome KalRaf28, icona "Kcal"). L'APK carica l'app da GitHub Pages, quindi ogni modifica pubblicata su KalRaf28 arriva da sola sul telefono. Il secondo repository **raf28.github.io** contiene solo `.well-known/assetlinks.json` (verifica che toglie la barra dell'indirizzo) e non va toccato.
>
> Prima di tutto leggi il codice attuale dal repository (è pubblico: https://github.com/raf28/kalraf28) e questo documento di pianificazione. Poi riprendiamo dalla lista **"Cose da fare"** in fondo al documento.
>
> Regole fisse:
> - Non devo **mai** pagare l'API oltre al mio abbonamento Google AI Pro: si usano solo il livello gratuito e modelli Flash/Flash-Lite, e una chiave di un progetto senza fatturazione.
> - I valori nutrizionali non si correggono a mano nell'app: se Gemini sbaglia lo correggo in chat e vale sempre l'ultima versione.
> - Gemini non deve mai inventare valori: se non li conosce deve dirlo ("non trovato") e chiedermeli.
> - Interfaccia in italiano, pulsanti grandi, pensata per il telefono.

---

## 1. Cos'è l'app

KalRaf28 è un diario alimentare personale. Al posto di contare le calorie nelle chat dell'app Gemini, l'utente descrive, detta o fotografa quello che mangia. L'app chiede i valori a Gemini tramite API e tiene il conto della giornata.

- **Hosting:** GitHub Pages (`raf28.github.io/KalRaf28`), account GitHub `raf28`.
- **Tecnologia:** un solo file `index.html` con HTML, CSS e JavaScript vanilla. Non c'è backend.
- **Dati:** restano nel browser del telefono (`localStorage` con chiave `diario_kcal_v1`, foto degli alimenti in IndexedDB `diario_kcal_foto`), con un backup opzionale su Google Drive.
- **AI:** API Gemini (`generativelanguage.googleapis.com/v1beta`) con la chiave personale di Google AI Studio, salvata solo in quel browser. Le risposte sono in JSON strutturato (`responseSchema`).
- **Accesso:** il PIN si chiede una sola volta per dispositivo. Nel codice c'è solo l'hash SHA‑256 con il prefisso `diario-kcal:`; dopo lo sblocco il dispositivo resta sbloccato.
- **Tema:** verde scuro `#1f4d35`, font Outfit, chiaro/scuro automatico.

## 2. Requisiti decisi

- Le foto degli alimenti, delle etichette e dei piatti vengono analizzate da Gemini.
- Si vedono **sempre** il totale kcal e i macro: proteine, carboidrati (di cui zuccheri), grassi (di cui saturi), fibre e sale.
- I pasti sono divisi in **colazione, pranzo, cena e spuntini**. Gli spuntini sono numerati: "Spuntino 1", "Spuntino 2"…
- **La giornata la chiude l'utente** a mano, perché la cena a volte è dopo mezzanotte. Non esiste un cambio di data automatico.
- C'è una barra kcal giornaliera con **margine bonus**. L'obiettivo si imposta da 1000 a 5000 kcal e il margine da 0 a 600 (all'inizio era pensato tra 200 e 400). Entrambi si scelgono nelle Impostazioni.
- Il modello Gemini si sceglie nelle Impostazioni.
- La **chat Ricette** è separata e non entra mai nel conteggio.
- **Niente correzione manuale dei valori:** si corregge in chat e conta l'ultimo valore dato.
- Lo **storico** delle giornate si tiene una settimana (si può cambiare); le ricette si tengono sempre.
- **Mai spese extra per l'API** oltre all'abbonamento.
- In futuro forse un'APK.

## 3. Come funziona oggi (v39): sezioni

La barra in basso ha 6 voci: **Diario · Alimenti · Ricette · Preimpostati · Storico · Impostazioni**.

### 3.1 Diario
- **Testata:** "Giornata iniziata [data] alle [ora]", kcal consumate / obiettivo (+bonus) e una barra colorata: verde fino all'obiettivo, gialla nella zona bonus (a righe), rossa oltre. Accanto c'è l'etichetta "Restano X", "Bonus: X rimaste" oppure "Oltre di X". Sotto c'è una griglia con i 5 macro (zuccheri e saturi in piccolo).
- **Frecce ‹ ›** per sfogliare le giornate archiviate. Una giornata archiviata si apre in sola lettura e con **"Modifica giornata"** si può riaprire. Durante la modifica la testata diventa marrone/oro e il pulsante diventa "Fine modifiche"; al termine la giornata torna nello storico al suo posto.
- **Pillole in basso:** Colazione, Pranzo, Cena, Spuntino N e il pulsante giallo **"Nuovo spuntino"**. Quest'ultimo chiude lo spuntino corrente e ne apre uno nuovo; è disattivato finché lo spuntino corrente è vuoto.
- **Ogni pasto** ha la sua lista di alimenti (nome, quantità, kcal, macro e un'etichetta che dice da dove viene il valore), la riga del totale, la chat con Gemini e il pulsante "Svuota pasto" (per gli spuntini "Elimina spuntino", con rinumerazione degli altri).
- **Composer:** fotocamera, galleria, testo, **dettatura vocale** (Web Speech API, it‑IT) e invio. Le foto vengono ridotte a 1280 px in JPEG.
- **La × su una voce** la toglie, e nella chat compare "(Ho eliminato a mano: …)" così Gemini lo sa.
- **"Chiudi giornata":** mostra un riepilogo, manda la giornata nello storico e apre una giornata nuova vuota.

### 3.2 Logica Gemini per i pasti (prompt `SYS_MEAL`)
- A ogni messaggio Gemini riceve la **lista attuale** del pasto in JSON e restituisce **sempre la lista completa aggiornata**: aggiunge, sostituisce le correzioni senza doppioni e rimuove.
- Le voci con `imposto: true` sono valori dati dall'utente e non si toccano. Se l'utente dà solo le kcal, i macro restano vuoti (null); se dà il totale del pasto, il pasto diventa una sola voce.
- **Fonte dei valori**, in ordine di priorità, con l'etichetta colorata che compare nell'app:
  1. `utente` → "valore tuo"
  2. `alimenti` → "valore sicuro – Alimenti" (l'app ricalcola i valori dalla scheda salvata, in base ai grammi o al numero di pezzi)
  3. `etichetta` → "da etichetta"
  4. `generico` → "valore generico" (tabelle CREA ecc.; se l'utente cita una marca non salvata, Gemini suggerisce di salvarla)
  5. `foto` → "stima da foto"
  6. `non_trovato` → kcal 0 e macro vuoti, "cercare manualmente l'alimento", e Gemini chiede i valori
- Le fonti `ricetta` e `preimpostato` esistono già nel codice. La seconda è pronta per la sezione futura.
- **Domande** ("sei sicuro del sale?"): risponde senza modificare la lista (`domanda: true`).
- **Riepilogo** solo su richiesta esplicita ("dammi il totale"): mostra un riquadro con l'elenco degli alimenti, il totale kcal e la tabella dei macro. I valori mancanti sono segnati con * e i totali parziali con "≥".
- Ogni risposta ha i pulsanti **▶︎ Ascolta / ⏸ Pausa** per la lettura ad alta voce in italiano.
- Gemini riceve solo gli ultimi 10 messaggi della chat del pasto come storia.

### 3.3 Affidabilità delle chiamate (dalla v33)
- Con il modello principale si fanno **4 tentativi**, con attese crescenti, se Google risponde "sovraccarico" (503/500/high demand).
- Poi si passa alla **Riserva 1** e alla **Riserva 2**, 2 tentativi ciascuna, con un avviso a schermo. Se le riserve sono su "Automatico", l'app sceglie l'ultimo Flash‑Lite e l'ultimo Flash stabili disponibili.
- Se fallisce tutto, compare un messaggio d'errore con il pulsante **↻ Riprova**.
- I messaggi d'errore sono in italiano: chiave non valida, limite di richieste (429), modello che non risponde.

### 3.4 Alimenti (archivio prodotti di marca)
- È un elenco alfabetico con la lettera dell'indice fissa in alto e una ricerca per nome e note.
- Ogni scheda contiene nome ("Prodotto – Marca"), riferimento ("100 g", "1 vasetto (170 g)"…), kcal, i macro completi, le note (es. "1 galletta = 8 g") e due foto: **tabella** e **confezione**, salvate in IndexedDB.
- **"+ Aggiungi alimento":**
  - **Automatico (predefinito):** si detta (pulsante grande "Parla"), si scrive o si fotografa, e dopo 2 secondi di pausa Gemini prepara da solo la scheda (prompt `SYS_FOOD`). Gemini sistema gli errori di dettatura, usa esattamente i valori dati, converte il sodio in sale × 2,5, mette 0 ai macro che mancano se c'è una tabella e lascia vuoti i macro se è indicato solo il valore kcal.
  - **Compila a mano:** un modulo con tutti i campi.
  - In entrambi i casi la scheda si controlla e poi si salva.
- C'è la regola "**macro mancanti = 0**" (v39), con una nota sotto la scheda: "Macro non specificati: …" oppure "sono indicate solo le kcal".
- Nel Diario, quando l'utente nomina un alimento salvato, Gemini lo collega con il suo `alimento_id` e i grammi (o il numero di pezzi). L'app poi **ricalcola i valori con precisione dalla scheda**.

### 3.5 Ricette
- Due schede: **Chat** e **Ricettario (N)**.
- La **Chat** è un consulente di cucina per la dieta (prompt `SYS_REC`) che non conta nel diario. Quando propone una ricetta concreta compare il riquadro **"Salva nel ricettario"**. Il pulsante "Nuova conversazione" svuota la chat, che tiene al massimo 200 messaggi.
- Il **Ricettario** mostra kcal e macro per porzione e l'elenco degli ingredienti. Ha i pulsanti **"Aggiungi a un pasto"** (si sceglie il pasto e le porzioni da 0,5 a 10, a passi di 0,5) ed **"Elimina"**.
- **"Importa ricette":** si incolla del testo (anche più ricette insieme, per esempio dalle note di Gemini) o uno screenshot. Gemini le struttura usando esattamente i valori presenti nel testo (prompt `SYS_IMP`).

### 3.6 Preimpostati
- Per ora c'è solo un segnaposto: **"Sezione in arrivo."** (vedi Cose da fare).

### 3.7 Storico
- È l'elenco delle giornate chiuse. Ognuna ha un pallino verde, giallo o rosso, le kcal rispetto all'obiettivo, i macro e il dettaglio per pasto, con i pulsanti "Annulla" ed "Elimina giornata".
- Si conservano al massimo 400 giornate. Le più vecchie del periodo scelto vengono eliminate in automatico.

### 3.8 Impostazioni
- **Obiettivo kcal**, da 1000 a 5000 a passi di 50 (cursore + numero; predefinito 2000).
- **Margine bonus**, da 0 a 600 a passi di 50 (predefinito 300).
- **Conservazione dello storico:** 3, 7 (predefinito), 14 o 30 giorni, oppure sempre.
- **Gemini:** chiave API (con "Mostra/Nascondi" e "Salva e carica modelli"), modello principale (si consiglia Flash‑Lite) e Riserve 1 e 2.
- **Backup su Google Drive** (vedi 3.9).
- **Backup su file:** esporta e importa un JSON (`diario-kcal-AAAA-MM-GG.json`) senza la chiave API.
- **Sicurezza:** "Blocca con PIN su questo dispositivo".
- **Reset App:** scollega Google e cancella tutti i dati sul telefono. I backup su Drive restano.
- In fondo c'è "Versione 39 · i valori nutrizionali sono stime del modello." e il pulsante "Applica e torna al Diario".

### 3.9 Backup su Google Drive (v34–v38) ✅
- Si accede con Google (Google Identity Services, token OAuth). Il permesso è **solo `drive.file`**: l'app vede solo i file che crea lei.
- Su Drive c'è la cartella **"KalRaf28 Backup"**, con **un solo file sempre aggiornato** `kalraf28-backup.json` e una sottocartella **"Foto"** per le foto degli alimenti. Le foto si caricano solo se sono cambiate (lo si capisce da un'impronta) e quelle non più usate vengono cancellate.
- **Quando si salva:**
  - Alimenti, ricette e impostazioni → poco dopo ogni modifica (circa 4 secondi).
  - Diario e storico → alla chiusura della giornata, alla fine di una modifica e una volta al giorno.
  - In più c'è il pulsante "Sincronizza".
- Il messaggio "☁ Sincronizzato su Google Drive" conferma il backup. Se il telefono è offline o il token è scaduto, le modifiche restano "in attesa": il primo tocco nell'app chiede di nuovo l'accesso e il backup riparte quando torna la rete.
- **Ripristino:** al primo collegamento, se su Drive c'è già un backup, l'app propone di ripristinarlo. Altrimenti c'è "Ripristina da Drive", che riporta tutti i dati (compresa la chiave API) e poi scarica le foto.
- La pagina **`privacy.html`** è l'informativa richiesta da Google per la schermata di consenso OAuth (contatto: raf28g@gmail.com).

### 3.10 Altro
- "Trascina in basso per aggiornare" ricarica la pagina.
- Le frecce rotonde ↑ ↓ portano in cima o in fondo.
- Il tasto Indietro di Android chiude prima le finestre e poi torna alla sezione precedente.
- Nella cartella `icone/` c'è l'icona dell'app creata dall'utente: un **cerchio verde scuro con la scritta "Kcal"** bianca con il bordo nero. Formati: PNG trasparenti da 48, 72, 96, 144, 192 e 512 px; PNG maskable da 192 e 512 px; `icona-kcal.svg` e `icona-kcal-maskable.svg`. **Non è ancora collegata:** la piccola icona nella scheda del browser è un'altra, disegnata dentro `index.html` (cerchio arancio con foglia), e va sostituita con questa.

## 3.11 App Android (APK) e verifica del dominio ✅
- **Tipo:** TWA (Trusted Web Activity) generata il 25/11/2026 su pwabuilder.com ("Package for stores" → Google Play), package **`io.github.raf28.kalraf28`**, nome **KalRaf28**, nome breve "Kcal". È un'app installata a tutti gli effetti, con la sua icona; dietro le quinte usa Chrome come motore, quindi accesso Google, dettatura e fotocamera funzionano come nel browser.
- **Dove sono i file:** sul PC, nella cartella `Desktop\Kcal` (zip originale ed estratto): `KalRaf28.apk` (installata sul Pixel), `KalRaf28.aab` (solo per l'eventuale Play Store), `assetlinks.json`, `signing.keystore` e `signing-key-info.txt` (password). Keystore e password vanno messi al sicuro e **non** vanno mai nel repository né in questo documento.
- **Verifica del dominio:** Android controlla `https://raf28.github.io/.well-known/assetlinks.json`, cioè la **radice** del dominio, non `/KalRaf28/`. La radice si pubblica solo con un repository chiamato esattamente `raf28.github.io`, per questo ne è stato creato un secondo (pubblico), che contiene solo:
  - `.well-known/assetlinks.json`, con il package e l'impronta SHA‑256 della firma dell'APK;
  - `_config.yml` con `include: [".well-known"]`, perché altrimenti GitHub Pages ignora le cartelle che iniziano con il punto.
  Con la verifica attiva, l'app si apre senza la barra in alto (condividi / tre puntini). Nel menu dei tre puntini, quando c'era, non andava toccato "Installa e crea scorciatoia": avrebbe creato una seconda icona da browser.
- **Accessi di Claude:** l'app GitHub "Claude" è installata sull'account `raf28` **solo** per il repository KalRaf28, quindi Claude può pubblicarci direttamente le modifiche. Il repository raf28.github.io è stato creato dal browser e Claude non ha l'accesso diretto (non serve).

## 3.12 Come si aggiorna l'app
- **Modifiche normali** (funzioni, schermate, testi, colori interni, prompt di Gemini, Drive): si modifica il repository **KalRaf28** (di solito solo `index.html`, alzando la versione: v41, v42…). GitHub Pages pubblica in 1-2 minuti; sul telefono basta chiudere e riaprire l'app (o trascinare giù per aggiornare). Il service worker è "prima la rete", quindi con internet si carica sempre l'ultima versione. Il numero in fondo alle Impostazioni conferma la versione.
- **Cose che richiedono una nuova APK** (sono dentro l'APK): nome e icona sul telefono, colore della schermata d'avvio, identificativo dell'app. Si rigenera con PWABuilder usando **lo stesso keystore** (in "All Settings" → chiave esistente), così la nuova APK si installa sopra la vecchia. Se cambiasse la firma, andrebbe aggiornata anche l'impronta in `assetlinks.json`.
- **Da non toccare:** i nomi dei due repository, GitHub Pages attivo su entrambi, i file `manifest.webmanifest` e `sw.js` di KalRaf28 e tutto il repository raf28.github.io.

## 4. Struttura dei dati (localStorage `diario_kcal_v1`)

```
settings: { apiKey, model, bk1, bk2, target, margin, keepDays }
day:      { id, start, meals: { colazione, pranzo, cena, spuntino1, … : { items[], chat[], closed? } }, curSnack }
history:  [ { id, start, end, meals, tot, target, margin, curSnack, full } ]
recipes:  [ { id, src?, nome, porzioni, ingredienti[] } ]
recChat:  [ messaggi della chat ricette ]
foods:    [ { id, nome, riferimento, kcal, proteine, carboidrati, zuccheri, grassi, saturi, fibre, sale, note, foto:{tabella,confezione} } ]
unlocked, parked/editPos (durante la modifica di una giornata archiviata)
```
Ogni voce di un pasto contiene: `nome, quantita, kcal, proteine, carboidrati, zuccheri, grassi, saturi, fibre, sale, fonte`, più eventualmente `imposto, alimento_id, grammi, fattore`.
Lo stato di Drive è a parte, in `localStorage` con chiave `kalraf28_drive`.

## 5. Cronologia delle versioni (dal repository)

- **25/11 mattina (06:07–10:28):** prima pubblicazione e circa 30 caricamenti successivi. In questa fase sono nati diario, pasti/spuntini, chat Gemini, Alimenti, Ricette, Storico, Impostazioni e PIN.
- **v33:** tentativi automatici, modelli di riserva, tasto Riprova.
- **v34:** backup su Google Drive e Reset App.
- **v35:** backup delle foto su Drive.
- Pagina privacy per Google.
- **v36:** backup su Drive limitati a 3.
- **v37:** un solo backup sempre aggiornato.
- Icone dell'app Kcal (SVG e PNG).
- **v38:** messaggio "Sincronizzato su Drive".
- **v39:** macro mancanti a 0 e nota "macro non specificati".
- **v40:** manifest, service worker e icona "Kcal" collegata, per installare l'app come APK.
- **Stessa sera:** APK generata con PWABuilder e installata sul Pixel; creato il repository `raf28.github.io` con `assetlinks.json`: l'app si apre come app vera, senza barra. Claude ha ora l'accesso in scrittura al repository KalRaf28.
- **Icona ridisegnata:** "Kcal" più grande, bordo bianco più spesso intorno alle lettere e uguale intorno al cerchio; versione maskable pensata per il ritaglio a cerchio di Android. APK rigenerata con lo stesso keystore (versione 1.0.1, version code 2) e installata sopra.

- **26/11 mattina (v41–v57), ritocchi grafici e funzioni:**
  - barra del pasto con nome in maiuscolo e kcal accanto ("PRANZO 412 kcal");
  - "Svuota pasto" e "Chiudi giornata" identici (pillola verde scuro, bordo rosso sottile);
  - testata con data per esteso dentro una pillola verde, frecce piccole bianche, senza ora (apertura e chiusura della giornata visibili nello Storico);
  - "Restano … kcal"; nei riquadri dei macro il nome sopra e il valore sotto, stesso bianco e stessa grandezza;
  - riquadro "Lista alimenti" con cornice verde e titolo; riga dell'alimento ridisegnata (nome su tutta la larghezza, quantità in bianco, kcal e X nel cerchio sotto); conferma prima di eliminare un alimento;
  - riepilogo in chat incorniciato di verde;
  - alimenti "valore sicuro" con ⓘ: toccandoli si apre la scheda dell'alimento con foto; foto a tutto schermo toccandole (Diario e Alimenti);
  - aggiornamenti immediati (il service worker non usa più la cache HTTP di 10 minuti);
  - risolto il bug della barra in basso che spariva dopo il "trascina per aggiornare" (v52);
  - tolto il pulsante Preimpostati (v53);
  - scelta dell'aspetto in Impostazioni: come il telefono / chiaro / scuro, salvata anche nel backup (v57).
  - Alimenti nello stile del Diario (v80–v84): testata verde con ricerca a pillola, schede a pillola alte due righe con bordo verde, kcal e "per …" su due righe.
  - Foto degli alimenti (v86): Foto confezione 1, Foto confezione 2 e Foto tabella valori nutrizionali sulla stessa riga, con fotocamera, galleria e "Rimuovi"; microfono "Parla" sotto il campo di testo; in alto "Compila scheda Automaticamente / Manualmente" (predefinito: Automaticamente).
  - Scheda alimento (v87): microfono e invio accanto al campo di testo, come nel Diario.
  - Schermata di avvio (v88): sfondo verde, icona "Kcal" in un cerchio con contorno bianco, motto "Mangia bene, conta giusto", puntini animati e frutta/verdura disegnate intorno. Dura almeno 1 secondo (v89); se il caricamento è lento resta (con i puntini che si muovono) finché l'app non è pronta. Il service worker (cache kalraf28-v45) prova prima GitHub, ma se non risponde entro 0,8 secondi apre subito la copia salvata e la aggiorna in sottofondo: in quel caso la versione nuova arriva all'apertura successiva.
  - Icona Android (v89): il bordo bianco sul Pixel era spesso perché PWABuilder mette l'icona maskable rimpicciolita (margine 8,5dp) su sfondo bianco. Cerchio verde dell'icona maskable portato da r=155 a r=178 (su 512) per dimezzare il bordo visibile. Serve rifare l'APK con la STESSA chiave (signing.keystore) per installarlo sopra quello attuale.
  - riga dei pasti spostata sopra il campo di scrittura, tolta la vecchia barra in basso (v60);
  - **nuovo sistema dei pasti (v63):** cerchio **+** fisso a sinistra della riga → menu "Aggiungi Colazione / Pranzo / Cena / Spuntino". Nella riga compaiono solo i pasti aggiunti, **nell'ordine in cui sono stati aggiunti** (`day.order`). Colazione, pranzo e cena uno solo ciascuno; spuntini numerati in sequenza, **massimo 9** (era 10 fino alla v70). Ogni pasto ha **"Elimina …"** con conferma (sostituisce "Svuota pasto"): eliminando uno spuntino in mezzo, i successivi vengono rinumerati. Tolti "Nuovo spuntino", lo spuntino "in corso" e gli spuntini "chiusi": tutti i pasti restano sempre modificabili. Le giornate salvate con il vecchio formato vengono convertite da sole.

**Stato:** online, **collaudo in corso dal 25/11/2026**. Interfaccia del Diario rifinita il 26/11.

---

## 📋 STATO DELLE SEZIONI (25/11/2026, valutazione dell'utente)
- ✅ **Già funzionanti:** Diario, Alimenti, Storico, Impostazioni.
- 🔧 **Da implementare / completare:** **Ricette** (nel codice esiste già una prima versione con chat e ricettario, da rivedere e completare) e **Preimpostati** (oggi solo il segnaposto "Sezione in arrivo").
- ❓ Ricette e Preimpostati: **da decidere se resteranno** nell'app oppure no.
- **26/11 (v53):** tolto il pulsante **Preimpostati** dalla barra in basso, in attesa di capire se la sezione può essere utile. La barra ora ha 5 voci (Diario, Alimenti, Ricette, Storico, Impostazioni), più larghe e centrate. La sezione (oggi solo un segnaposto) e la fonte `preimpostato` restano nel codice: per rimetterla basta ripristinare il pulsante `data-v="pasti"` e tornare a 6 colonne.

## ✅ COSE DA FARE

### Priorità alta
1. **Collaudo del backup su Drive:** collegare, modificare un alimento e verificare il file su Drive; chiudere una giornata; fare un Reset App e poi un ripristino completo, foto comprese; provare cosa succede con il token scaduto e da offline.
2. **Sezione "Preimpostati" (pranzi e cene):** è ancora da progettare. Cose da decidere:
   - Come si crea un preimpostato: dalla chat, salvando un pasto già fatto dal diario, oppure a mano.
   - Come si aggiunge a un pasto, per esempio con le porzioni come per le ricette.
   - La fonte `preimpostato` ("valore sicuro – Preimpostati") è già prevista nel codice.
   - Va incluso nel backup su Drive tra i dati salvati subito.
3. **APK Android (TWA con PWABuilder):** con la v40 sono stati aggiunti `manifest.webmanifest` (icone "Kcal", schermo intero) e `sw.js` (prima la rete, copia offline come riserva); anche l'icona nella scheda del browser ora è "Kcal". APK generata il 25/11/2026 su pwabuilder.com (package `io.github.raf28.kalraf28`, nome KalRaf28). APK installata sul Pixel il 25/11/2026. Per togliere la barra dell'indirizzo è stato creato il repository pubblico `raf28.github.io` con `.well-known/assetlinks.json` (impronta della firma dell'APK) e `_config.yml` (`include: [".well-known"]`, altrimenti GitHub Pages non pubblica la cartella). L'APK carica l'app da GitHub: i repository KalRaf28 e raf28.github.io e GitHub Pages devono restare come sono. Se in futuro si rifà l'APK con un'altra firma, va aggiornata l'impronta in assetlinks.json. Prossimo passo: collaudo dell'app installata. **Fatto il 25/11:** APK installata e barra sparita.

4. **Mettere al sicuro le chiavi** (in un posto solo, per esempio una cartella privata su Drive), senza mai scriverle in questo documento né nel repository:
   - `signing.keystore` e il file di testo con le sue password, presi dallo zip di PWABuilder: servono per rifare l'APK in futuro (stesso package `io.github.raf28.kalraf28`);
   - la **chiave API di Gemini** (Google AI Studio), da tenere insieme alle altre.

### Da verificare durante il collaudo
5. Sezione **Alimenti** (era "fatta, da testare"): creazione con dettatura e con foto, collegamento nel diario con i grammi o i pezzi, ricalcolo dei valori.
6. Regola v39 "macro mancanti = 0": controllare che non dia valori falsi quando l'etichetta è incompleta.
7. Modelli di riserva: provarli nelle ore in cui Google è sovraccarico.
8. **Costi API:** controllare in Google AI Studio / Google Cloud che il progetto della chiave **non abbia la fatturazione attiva**, così si resta solo nel livello gratuito e non si paga mai.
9. **Schermata di consenso OAuth:** se è in modalità "test", controllare la durata dell'accesso e gli utenti di prova. Valutare se pubblicarla.

### Piccole cose notate rileggendo il codice
10. Il "Backup su file" non contiene le foto degli alimenti (stanno in IndexedDB), e la descrizione nomina solo "diario, storico e ricettario", anche se esporta pure alimenti e impostazioni. Va aggiornato il testo oppure incluse le foto.
11. Il README del repository è vuoto: si potrebbe aggiungere una breve descrizione e un link a questo documento.
12. Tenere aggiornato questo documento (è salvato nel repository) alla fine di ogni sessione di lavoro.

### Da sistemare alla prossima rigenerazione dell'APK (non urgente)
- **Blocco in verticale:** il manifest (v40) ha `"orientation": "portrait"` e PWABuilder l'ha messo dentro l'APK. Effetti: l'app **non ruota in orizzontale** e **non si può usare a schermo diviso** su Android (probabilmente per il blocco; le app TWA a volte sono comunque capricciose con lo schermo diviso). Soluzione: togliere `orientation` dal manifest (o metterlo `"any"`), poi rigenerare l'APK con PWABuilder (stesso keystore, version code 3) e reinstallarla sopra. Effetto collaterale: ruoterà anche in orizzontale, layout un po' largo.
  - **Idea dell'utente:** aggiungere nelle Impostazioni un interruttore **"Blocca in verticale" sì/no**, per scegliere se l'app ruota o no. Come farlo: togliere il blocco dall'APK (una sola rigenerazione), poi gestire la rotazione dentro l'app con `screen.orientation.lock('portrait')` / `unlock()` in base all'interruttore (da verificare che funzioni nella TWA). Dopo quella rigenerazione, l'interruttore e le sue eventuali modifiche arrivano da GitHub senza rifare l'APK.
- **Barra in basso tagliata (visto una volta, 25/11):** alla prima apertura dopo l'aggiornamento dell'APK mancava la barra di navigazione in basso (Diario… Impostazioni); riaprendo l'app è tornata a posto. Si ripresentava anche dopo il "trascina per aggiornare". **v52 (26/11):** l'altezza dell'app ora è misurata in JavaScript (`--appH`, la più piccola tra `innerHeight` e `visualViewport.height` quando non si sta scrivendo) e ricalcolata all'avvio, dopo il ricaricamento, al ritorno in primo piano e a ogni cambio di dimensione. Da verificare sul telefono.

### Futuro
13. Eventuale APK "autonoma" con tutto il codice dentro (Capacitor o simili): servirebbe solo per il Play Store o per non dipendere da GitHub. Richiede di rifare il login Google per Drive e la dettatura.
