# Pianificazione KalRaf28

*Documento ricostruito il 25/11/2026 dal codice del repository e dalle decisioni prese durante lo sviluppo. Aggiornato alla versione 182 (27/11/2026).*

---

## 🔁 PROMPT DI RIPRESA (da incollare in una nuova chat)

> Sto sviluppando **KalRaf28** (titolo interno "Diario Calorie"), una web app personale per contare kcal e macronutrienti usando l'API di Gemini. È online su **https://raf28.github.io/KalRaf28** ed è pubblicata dal repository GitHub **raf28/KalRaf28**: è tutta in un unico file `index.html` (HTML + CSS + JavaScript, nessun framework e nessun server), più `manifest.webmanifest`, `sw.js` (service worker), `privacy.html`, la cartella `icone/` e questo documento (`Pianificazione Kcal Raf28.md`). La versione attuale è la **182**.
>
> Gestisco il progetto **dallo smartphone** (Google Pixel 8, Chrome Android). Claude ha l'accesso in scrittura al repository (app GitHub "Claude" installata su KalRaf28) e può pubblicare direttamente le modifiche; in alternativa le carico io con "Add files via upload". In quel caso voglio sempre **il file `index.html` completo**, pronto da caricare, mai pezzi di codice da incollare a mano. A ogni modifica il numero di versione va aumentato di uno in fondo alla pagina Impostazioni ("Versione App: NN") e il commit si chiama "vNN: descrizione breve".
>
> L'app è installata sul mio Pixel come **APK Android** (TWA creata con PWABuilder, package `io.github.raf28.kalraf28`, nome KalRaf28, icona "Kcal"). L'APK carica l'app da GitHub Pages, quindi ogni modifica pubblicata su KalRaf28 arriva da sola sul telefono. Il secondo repository **raf28.github.io** contiene solo `.well-known/assetlinks.json` (verifica che toglie la barra dell'indirizzo) e non va toccato.
>
> Come lavoriamo: per ogni modifica grafica voglio **prima un'anteprima (immagine)** e solo dopo la mia conferma ("implementa") la modifica va pubblicata. Rispondimi sempre in italiano.
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

## 3. Come funziona oggi (v182): sezioni

La barra in basso ha 5 voci: **Diario · Alimenti · Ricette · Storico · Impostazioni** (Preimpostati tolto nella v53). La voce attiva è evidenziata con una pillola verde `#2f8f5c`.

### 3.1 Diario
- **Testata verde:** in alto il titolo "Diario" (v173), poi una pillola con la data su due righe ("Giovedì 26" / "Novembre", v102), le frecce ‹ › (32 px) per sfogliare le giornate e "Nuova Giornata Alimentare" (tasto di default, verde chiaro, v94); poi kcal consumate / obiettivo (+bonus) e una barra colorata: verde fino all'obiettivo, gialla nella zona bonus (a righe), rossa oltre. Accanto c'è l'etichetta "Restano X kcal", "Bonus: X rimaste" oppure "Oltre di X". Sotto ci sono i riquadri dei macro con il nome sopra e il valore sotto (stesso bianco e stessa grandezza).
- **Frecce ‹ ›** per sfogliare le giornate archiviate. Una giornata archiviata si apre in sola lettura e con **"Modifica giornata"** si può riaprire. Durante la modifica la testata diventa marrone/oro, le frecce si disattivano e la barra "Giornata archiviata" mostra "Salva" (v106); al termine la giornata torna nello storico al suo posto.
- **Riga dei pasti (v63)**, sopra il campo di scrittura: una pillola verde con il cerchio **+** bianco a sinistra e i pasti aggiunti (larghi 96 px; quello scelto è verde chiaro con scritta bianca, v108). Il **+** apre "Aggiungi Colazione / Pranzo / Cena / Spuntino": colazione, pranzo e cena uno ciascuno, spuntini numerati fino a **9**. I pasti compaiono **nell'ordine in cui sono stati aggiunti** (`day.order`).
- **Ogni pasto** ha una barra fissa in alto a pillola, uguale alla riga dei pasti ("PRANZO 412 kcal", v120), con **"Elimina pranzo/cena/…"** (verde chiaro; con conferma; eliminando uno spuntino in mezzo i successivi vengono rinumerati); poi la **tabella del pasto** "LISTA ALIMENTI / TOTALE KCAL E MACRO" (v139–v147) con cornice verde: alimenti (nome, quantità, fonte, kcal, macro, X rossa con conferma; ⓘ sugli alimenti "valore sicuro" apre la scheda con le foto), "Totale kcal PRANZO: N kcal", tabella dei macro e Ascolta/Pausa; infine la chat con Gemini. Scorrendo, il contenuto sfuma sotto la barra del pasto e sopra la riga dei pasti.
- **Composer:** icone nei cerchi verde scuro: fotocamera, galleria, testo, **dettatura vocale** (Web Speech API, it‑IT) e invio. Le foto vengono ridotte a 1280 px in JPEG.
- **La × su una voce** la toglie, e nella chat compare "(Ho eliminato a mano: …)" così Gemini lo sa.
- **"Nuova Giornata Alimentare" (prima "Chiudi giornata", v94):** apre il pop-up "Chiudere la giornata alimentare?" con, nell'ordine: la frase "La giornata alimentare attuale verrà chiusa, conservata nello storico e se ne aprirà una nuova. / Potrai consultarla nello Storico e modificarla tornando indietro con la freccia ‹ accanto alla data.", il riepilogo kcal e quello dei macro in bianco, le kcal per pasto e i tasti "Annulla" (verde scuro) e "Nuova Giornata Alimentare" (verde chiaro `#2f8f5c`). Conferma: mostra un riepilogo, manda la giornata nello storico e apre una giornata nuova vuota.

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
- **Domande** ("sei sicuro del sale?") e **domande di cucina** (temperature, tempi, cotture, fuoco, sostituzioni; v140): risponde senza modificare la lista (`domanda: true`).
- **Riepilogo** solo su richiesta esplicita ("dammi il totale"): dalla v139 mostra in chat la stessa tabella del pasto della "Lista alimenti" (alimenti con X, totale kcal, macro), sempre aggiornata. I valori mancanti sono segnati con *.
- Ogni risposta ha i pulsanti **▶︎ Ascolta / ⏸ Pausa** per la lettura ad alta voce in italiano (frase per frase; Pausa ricorda il punto per 1 ora; tenendo premuto Ascolta 1 secondo riparte dall'inizio, v152; pulsante AUTO per la lettura automatica delle nuove risposte, v153).
- Gemini riceve solo gli ultimi 10 messaggi della chat del pasto come storia.

### 3.3 Affidabilità delle chiamate (dalla v33)
- Con il modello principale si fanno **4 tentativi**, con attese crescenti, se Google risponde "sovraccarico" (503/500/high demand).
- Poi si passa alla **Riserva 1** e alla **Riserva 2**, 2 tentativi ciascuna, con un avviso a schermo. Se le riserve sono su "Automatico", l'app sceglie l'ultimo Flash‑Lite e l'ultimo Flash stabili disponibili.
- Se fallisce tutto, compare un messaggio d'errore con il pulsante **↻ Riprova**.
- I messaggi d'errore sono in italiano: chiave non valida, limite di richieste (429), modello che non risponde.

### 3.4 Alimenti (archivio prodotti di marca)
- È un elenco alfabetico con la ricerca fissa in alto e, sotto, la lettera dell'indice che si ferma scorrendo (v119); la ricerca è per nome e note.
- **Grafica (v80–v84, v111–v119):** testata verde con il conteggio e la ricerca a pillola (la ricerca resta fissa scorrendo); schede a pillola alte due righe, piene di verde scuro `#1f4d35` con scritte bianche (in chiaro, dalla v163: più basse, bianche con bordo e scritte `#1f4d35`) (nome, kcal, "per …"); aperte tornano con lo sfondo normale e i tasti Annulla / Modifica / Elimina (standard 2). Il tasto Indietro di Android chiude la scheda aperta. Pulsante a pillola "Aggiungi alimento" con il cerchio + come nel Diario; nessuna sfumatura (v162).
- Ogni scheda contiene nome ("Prodotto – Marca"), riferimento ("100 g", "1 vasetto (170 g)"…), kcal, i macro completi, le note (es. "1 galletta = 8 g") e **tre foto (v86)**: **Confezione 1**, **Confezione 2** e **Tabella valori nutrizionali**, sulla stessa riga, ognuna con fotocamera, galleria e "Rimuovi". Sono salvate in IndexedDB (chiavi `confezione`, `confezione2`, `tabella`).
- **"Aggiungi alimento":** in alto si sceglie **"Compila scheda Automaticamente"** (predefinito) o **"Compila scheda Manualmente"**.
  - **Automaticamente:** si detta (microfono accanto al campo di testo, con il tasto invio, come nel Diario: v87), si scrive o si fotografa, e dopo 2 secondi di pausa Gemini prepara da solo la scheda (prompt `SYS_FOOD`). Gemini sistema gli errori di dettatura, usa esattamente i valori dati, converte il sodio in sale × 2,5, mette 0 ai macro che mancano se c'è una tabella e lascia vuoti i macro se è indicato solo il valore kcal.
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
- Pulsante tolto dalla barra (v53). Nel codice resta solo il segnaposto "Sezione in arrivo." (vedi Stato delle sezioni).

### 3.7 Storico
- Titolo "Storico Giornate Alimentari" con il conteggio. È l'elenco delle giornate chiuse, nello stile degli Alimenti (v132–v148): pillole verde scuro con pallino colorato, data e kcal "su obiettivo". Aperta mostra "RIEPILOGO: N kcal", macro, orari, poi COLAZIONE / PRANZO / SPUNTINO… con gli alimenti, e i tasti Annulla … Modifica, Elimina (rosso). "Modifica" porta al Diario su quella giornata. Dalla v172 anche "Elimina" è verde: rosso solo nella conferma. Il tasto Indietro di Android chiude la giornata aperta.
- 🟢🟡🔴 **Significato del pallino colorato** (nota da riusare in futuro, per esempio in una legenda nell'app): **verde** = la giornata è rimasta entro l'obiettivo kcal; **giallo/arancione** = ha superato l'obiettivo ma è rimasta nel margine bonus; **rosso** = ha superato anche il bonus (stessi colori della barra kcal del Diario). Il colore si calcola con l'obiettivo e il margine salvati in quella giornata.
- Si conservano al massimo 400 giornate. Le più vecchie del periodo scelto vengono eliminate in automatico.

### 3.8 Impostazioni
- **Obiettivo kcal**, da 1000 a 5000 a passi di 50 (cursore + numero; predefinito 2000).
- **Margine bonus**, da 0 a 600 a passi di 50 (predefinito 300).
- **Conservazione dello storico:** 3, 7 (predefinito), 14 o 30 giorni, oppure sempre.
- **Intelligenza Artificiale: Gemini** (v126): chiave API (con "Mostra/Nascondi" e "Salva e Carica Modelli"), modello principale (si consiglia Flash‑Lite) e Riserve 1 e 2.
- **Backup su Google Drive** (vedi 3.9).
- **Backup su file (v90, v144):** "Esporta backup" apre il menu di condivisione di Android (File, Drive, email, WhatsApp; il file condiviso è un `.txt` con il JSON) o, se annullato, salva `diario-kcal-AAAA-MM-GG.json` in Download; "Importa backup" accetta `.json` e `.txt`. Un unico JSON con **tutti i dati e le foto degli alimenti** (campo `photos`, le foto in base64), senza la chiave API. L'importazione sostituisce tutti i dati e rimette le foto; i file vecchi senza foto si importano lo stesso e lasciano le foto attuali. È indipendente dal backup su Drive, che non è stato toccato.
- **Aspetto (v57, v125):** "Come il Telefono" / "Chiaro" / "Scuro" (`settings.theme`), salvato anche nel backup; tasti verde scuro, quello scelto verde chiaro con ✓.
- **Sicurezza:** tasto "PIN Applicazione" (blocca l'app con il PIN su questo dispositivo; dalla v143, stesso stile di "Sincronizza").
- **Reset App:** scollega Google e cancella tutti i dati sul telefono ("Cancella solo i dati su questo telefono: / i backup su Drive restano.").
- Tutti i blocchi hanno il bordo verde `#2c6a49` (v121).
- In fondo c'è "* I Valori Nutrizionali Generici sono stime del modello" (nel colore arancione dell'etichetta "valore generico" del Diario) e sotto "Versione App: NN" (v132), poi il pulsante "Applica e torna al Diario".

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
- **Swipe a sinistra/destra** (v168) per passare da una sezione all'altra, a carosello.
- "Trascina in basso per aggiornare" ricarica la pagina (solo quando si è in cima). In più (v150–v151), **tenendo premuto per 1 secondo un qualsiasi tasto della barra in basso** (Diario, Alimenti, Ricette, Storico o Impostazioni, selezionato o no) il telefono vibra e l'app si aggiorna da qualunque punto, anche a metà di una chat; il tocco normale resta invariato. Come ogni aggiornamento, riparte dal Diario sulla giornata in corso senza pasti selezionati.
- Le frecce rotonde ↑ ↓ portano in cima o in fondo.
- Il tasto/gesto Indietro di Android chiude prima le finestre (pop-up come "Aggiungi un pasto", conferme, foto a tutto schermo) e le schede aperte (Alimenti, Storico), poi torna alla sezione precedente. Dalla v149 finestre, foto e schede usano **CloseWatcher** (Chrome 120+): si chiudono senza passare dalla cronologia, quindi niente schermata che scorre con lo swipe da sinistra; se CloseWatcher non c'è si usa la cronologia come prima.
- Nella cartella `icone/` c'è l'icona dell'app creata dall'utente: un **cerchio verde scuro con la scritta "Kcal"** bianca con il bordo nero. Formati: PNG trasparenti da 48, 72, 96, 144, 192 e 512 px; PNG maskable da 192 e 512 px; `icona-kcal.svg` e `icona-kcal-maskable.svg`. È collegata dalla v40 (scheda del browser, manifest, APK).
- **Icona maskable (quella usata per l'APK):** quadrato bianco con cerchio verde e "Kcal". PWABuilder la mette nell'APK **rimpicciolita** (margine di 8,5dp per lato) su uno **sfondo bianco**, e il Pixel mostra solo il cerchio centrale: per questo il bordo bianco sul telefono è molto più spesso che nel disegno. Nella v89 il cerchio verde è passato da r=155 a r=178 (su 512) per **dimezzare** il bordo visibile. Le anteprime vanno fatte simulando questo passaggio, non ritagliando il disegno così com'è.

### 3.11 App Android (APK) e verifica del dominio ✅
- **Tipo:** TWA (Trusted Web Activity) generata il 25/11/2026 su pwabuilder.com ("Package for stores" → Google Play), package **`io.github.raf28.kalraf28`**, nome **KalRaf28**, nome breve "Kcal". È un'app installata a tutti gli effetti, con la sua icona; dietro le quinte usa Chrome come motore, quindi accesso Google, dettatura e fotocamera funzionano come nel browser.
- **Versioni dell'APK:** 1.0.1 (version code 2, icona ridisegnata, 25/11) installata sul Pixel; **1.0.2 (version code 3)** generata il 26/11 sera con lo stesso keystore per l'icona con il bordo dimezzato (da installare sopra). La prossima dovrà avere **version code 4**. Impostazioni da usare su PWABuilder ("Package For Stores" → Google Play → All Settings): Package ID `io.github.raf28.kalraf28`, App name `KalRaf28`, Short name `Kcal`, colori tutti `#1f4d35`, splash fade 300 ms, fallback "Custom Tabs", ChromeOS only e Meta Quest non spuntati, Signing key **"Use mine"** con `signing.keystore` (l'utente inserisce alias e password).
- **Dove sono i file:** sul PC, nella cartella `Desktop\Kcal` (zip originali ed estratti, il più recente è "(1)"): `KalRaf28.apk` (installata sul Pixel), `KalRaf28.aab` (solo per l'eventuale Play Store), `assetlinks.json`, `signing.keystore` e `signing-key-info.txt` (password). Keystore e password vanno messi al sicuro e **non** vanno mai nel repository né in questo documento.
- **Verifica del dominio:** Android controlla `https://raf28.github.io/.well-known/assetlinks.json`, cioè la **radice** del dominio, non `/KalRaf28/`. La radice si pubblica solo con un repository chiamato esattamente `raf28.github.io`, per questo ne è stato creato un secondo (pubblico), che contiene solo:
  - `.well-known/assetlinks.json`, con il package e l'impronta SHA‑256 della firma dell'APK;
  - `_config.yml` con `include: [".well-known"]`, perché altrimenti GitHub Pages ignora le cartelle che iniziano con il punto.
  Con la verifica attiva, l'app si apre senza la barra in alto (condividi / tre puntini). Nel menu dei tre puntini, quando c'era, non andava toccato "Installa e crea scorciatoia": avrebbe creato una seconda icona da browser.
- **Accessi di Claude:** l'app GitHub "Claude" è installata sull'account `raf28` **solo** per il repository KalRaf28, quindi Claude può pubblicarci direttamente le modifiche. Il repository raf28.github.io è stato creato dal browser e Claude non ha l'accesso diretto (non serve).

### 3.12 Come si aggiorna l'app
- **Modifiche normali** (funzioni, schermate, testi, colori interni, prompt di Gemini, Drive): si modifica il repository **KalRaf28** (di solito solo `index.html`, alzando la versione). GitHub Pages pubblica in 1-2 minuti; sul telefono basta chiudere e riaprire l'app (o trascinare giù per aggiornare). Con rete lenta (oltre 0,8 s) l'app si apre con la copia salvata e la versione nuova arriva all'apertura successiva. Il numero in fondo alle Impostazioni conferma la versione.
- **Cose che richiedono una nuova APK** (sono dentro l'APK): nome e icona sul telefono, colore della schermata d'avvio, identificativo dell'app. Si rigenera con PWABuilder usando **lo stesso keystore** (in "All Settings" → chiave esistente), così la nuova APK si installa sopra la vecchia. Se cambiasse la firma, andrebbe aggiornata anche l'impronta in `assetlinks.json`.
- **Da non toccare:** i nomi dei due repository, GitHub Pages attivo su entrambi, l'indirizzo e lo scope di `manifest.webmanifest`, la registrazione di `sw.js` (si può modificare il suo contenuto, alzando il nome della cache) e tutto il repository raf28.github.io.

### 3.13 Schermata di avvio e apertura veloce (v88–v89)
- In `index.html`, subito dopo `<body>`, c'è `#splash`: sfondo verde a gradiente, icona "Kcal" in un cerchio di 178 px con contorno bianco di 9 px e ombra, motto **"Mangia bene, conta giusto"**, tre puntini animati e 23 disegni di frutta e verdura (mela, banana, carota, broccolo, arancia, pomodoro, pera, melanzana, kiwi, uva, avocado, limone, fragola) sparsi intorno.
- `hideSplash()` viene chiamata dopo `boot()`: la splash dura **almeno 1 secondo** dall'apertura; se il caricamento è più lento resta, con i puntini che si muovono, finché l'app non è pronta, poi sfuma in 0,3 s. In caso di errore JavaScript sparisce comunque.
- **Service worker (`sw.js`, cache `kalraf28-v45`):** prima la rete senza cache HTTP; se GitHub non risponde entro **0,8 secondi** e c'è una copia salvata, apre subito quella e intanto scarica la versione nuova (che si vedrà all'apertura successiva). Offline usa sempre la copia salvata. Così non c'è più lo schermo bianco quando GitHub è lento.

### 3.14 🔘 Tasto di default (fissato dall'utente il 26/11/2026, v94)
Quando l'utente chiede "il tasto di default" si usa **sempre** questo formato, uguale a "Annulla" e "Nuova Giornata Alimentare":
- **forma:** pillola tonda (`border-radius: 99px`), senza bordo né ombra;
- **dimensioni:** **150 × 40 px** fissi (`width:150px; height:40px; padding:3px 10px`);
- **scritta:** bianca, **14 px**, non in grassetto (`font-weight:400`), `line-height:1.15`, centrata, al massimo **due righe** (a capo con `<br>`, es. "Nuova Giornata<br>Alimentare");
- **colore di default:** verde scuro **`#1f4d35`** (quello di "Annulla"), uguale in chiaro e in scuro. Il verde chiaro `#2f8f5c` solo se chiesto (oggi solo "Nuova Giornata Alimentare"); rosso `var(--bad)` solo per le eliminazioni definitive.
- **Nel codice:** classe `btn bdef` (commento "TASTO DI DEFAULT" nello stile).

### 3.15 🔘 Tasto standard 2 (fissato dall'utente il 26/11/2026, v114)
Formato più piccolo, per le sezioni dove il tasto di default non ci sta (prima applicazione: Alimenti). Misura presa dal vecchio "Modifica" della scheda alimento:
- **forma:** pillola tonda (`border-radius: 99px`), senza bordo né ombra;
- **dimensioni:** **90 × 40 px** fissi;
- **scritta:** bianca, **14 px**, non in grassetto, centrata, una sola parola (Annulla, Modifica, Elimina, Salva, Rimuovi…);
- **colore:** verde scuro **`#1f4d35`**, uguale in chiaro e in scuro; rosso `var(--bad)` solo per le eliminazioni definitive.
- **Nel codice:** classe `btn std2` (commento "TASTO STANDARD 2" nello stile).

## 4. Struttura dei dati (localStorage `diario_kcal_v1`)

```
settings: { apiKey, model, bk1, bk2, target, margin, keepDays, theme, autoRead }
day:      { id, start, meals: { colazione, pranzo, cena, spuntino1, … : { items[], chat[] } }, order: [pasti nell'ordine in cui sono stati aggiunti] }
history:  [ { id, start, end, meals, order, tot, target, margin, full } ]
recipes:  [ { id, src?, nome, porzioni, ingredienti[] } ]
recChat:  [ messaggi della chat ricette ]
foods:    [ { id, nome, riferimento, kcal, proteine, carboidrati, zuccheri, grassi, saturi, fibre, sale, note, foto:{confezione,confezione2,tabella} } ]
unlocked, parked/editPos (durante la modifica di una giornata archiviata)
```
Ogni voce di un pasto contiene: `nome, quantita, kcal, proteine, carboidrati, zuccheri, grassi, saturi, fibre, sale, fonte`, più eventualmente `imposto, alimento_id, grammi, fattore`.
Lo stato di Drive è a parte, in `localStorage` con chiave `kalraf28_drive`. I vecchi campi `curSnack` e `closed` (prima della v63) vengono convertiti da `normalize()`.

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

- **26/11 (v41–v89), ritocchi grafici e funzioni:**
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
  - riga dei pasti spostata sopra il campo di scrittura, tolta la vecchia barra in basso (v60);
  - **nuovo sistema dei pasti (v63):** cerchio **+** fisso a sinistra della riga → menu "Aggiungi Colazione / Pranzo / Cena / Spuntino". Nella riga compaiono solo i pasti aggiunti, **nell'ordine in cui sono stati aggiunti** (`day.order`). Colazione, pranzo e cena uno solo ciascuno; spuntini numerati in sequenza, **massimo 9** (era 10 fino alla v70). Ogni pasto ha **"Elimina …"** con conferma (sostituisce "Svuota pasto"): eliminando uno spuntino in mezzo, i successivi vengono rinumerati. Tolti "Nuovo spuntino", lo spuntino "in corso" e gli spuntini "chiusi": tutti i pasti restano sempre modificabili. Le giornate salvate con il vecchio formato vengono convertite da sole.
  - Alimenti nello stile del Diario (v80–v84): testata verde con ricerca a pillola, schede a pillola alte due righe con bordo verde, kcal e "per …" su due righe.
  - Foto degli alimenti (v86): Foto confezione 1, Foto confezione 2 e Foto tabella valori nutrizionali sulla stessa riga, con fotocamera, galleria e "Rimuovi"; microfono "Parla" sotto il campo di testo; in alto "Compila scheda Automaticamente / Manualmente" (predefinito: Automaticamente).
  - Scheda alimento (v87): microfono e invio accanto al campo di testo, come nel Diario.
  - Schermata di avvio (v88): sfondo verde, icona "Kcal" in un cerchio con contorno bianco, motto "Mangia bene, conta giusto", puntini animati e frutta/verdura disegnate intorno. Dura almeno 1 secondo (v89); se il caricamento è lento resta (con i puntini che si muovono) finché l'app non è pronta. Il service worker (cache kalraf28-v45) prova prima GitHub, ma se non risponde entro 0,8 secondi apre subito la copia salvata e la aggiorna in sottofondo: in quel caso la versione nuova arriva all'apertura successiva.
  - Icona Android (v89): il bordo bianco sul Pixel era spesso perché PWABuilder mette l'icona maskable rimpicciolita (margine 8,5dp) su sfondo bianco. Cerchio verde dell'icona maskable portato da r=155 a r=178 (su 512) per dimezzare il bordo visibile. APK 1.0.2 (version code 3) rigenerata la sera stessa con la stessa chiave.
  - Backup su file con le foto (v90): "Esporta backup" mette nello stesso file JSON anche le foto degli alimenti e "Importa backup" le ripristina. Backup su Drive invariato.
  - Scheda alimento aperta dal Diario (ⓘ nella Lista alimenti, v91): il tasto **"Chiudi"** è in basso a sinistra, verde a pillola come "Modifica" ed "Elimina" della sezione Alimenti. Nelle conferme (es. eliminare un pasto) resta "Annulla".
  - Pulsante "Chiudi giornata" rinominato **"Chiudi Giornata Alimentare"** (v92): testo 13 px su due righe ("Chiudi Giornata" / "Alimentare"), stessa altezza di prima (40 px), testata invariata. In modifica di una giornata archiviata mostra "Fine / modifiche".
  - **Pulsanti uniformi (v93):** tutti i pulsanti dei pop-up (Chiudi, Annulla, Modifica, Elimina, Salva, Aggiungi, Importa, Chiudi e apri nuova…), quelli delle schede Alimenti e Storico e "Chiudi Giornata Alimentare" hanno lo stesso formato: pillola tonda verde scuro `#1f4d35` (uguale in chiaro e scuro), scritta bianca 14 px non in grassetto, altezza 40 px, come "Elimina pranzo". Solo i pulsanti di **eliminazione definitiva** (conferme di "Elimina", "Cancella tutto") sono **rossi**, per ora. Esclusi i selettori "Compila scheda Automaticamente / Manualmente" e il menu "Aggiungi pasto". Regola CSS in fondo allo stile (commento "v93").
  - **Nuova Giornata Alimentare (v94):** il pulsante in alto e quello di conferma nel pop-up si chiamano "Nuova Giornata Alimentare" e sono verde chiaro `#2f8f5c` (come la voce attiva della barra in basso); pop-up riordinato (frase sotto la domanda, poi kcal e macro in bianco). Nasce il **tasto di default**.
  - **Elimina pasto (v95):** il pulsante "Elimina pranzo / cena / colazione / spuntino" sulla barra del pasto ha il formato del tasto di default (150 × 40 px) in verde chiaro `#2f8f5c`. Nel pop-up "Eliminare il …?" i tasti "Annulla" (verde scuro) ed "Elimina" (rosso, eliminazione definitiva) hanno il formato del tasto di default.
  - **Testo del pop-up "Eliminare il …?" (v96):** "Il pasto (o Lo spuntino), i suoi alimenti e la sua chat verranno eliminati." e a capo "Potrai riaggiungerne uno nuovo con il tasto +" (senza punto finale, v97); tolto "Non si può annullare". Per gli spuntini resta la nota sulla rinumerazione.
  - **Lista alimenti (v97):** la X nel cerchio per togliere un alimento era verde chiaro (rossa dalla v138). Nel pop-up "Eliminare questo alimento?" i tasti "Annulla" (verde scuro) ed "Elimina" (rosso) hanno il formato del tasto di default.
  - **Ascolta / Pausa (v98):** icone disegnate (non più emoji): triangolino del play nel colore della scritta, quadratino della pausa verde scuro `#1f4d35` con le due lineette bianche. Il tasto attivo (Ascolta mentre legge, Pausa quando è in pausa) diventa verde pieno con scritta e triangolino bianchi. La lettura avviene **frase per frase**; Pausa ferma e ricorda la frase interrotta, Ascolta **riprende dall'inizio di quella frase**. Il punto di pausa si salva sul telefono (`localStorage` chiave `kalraf28_tts`, non nel backup) per **1 ora** e solo per l'ultimo audio: avviare un'altra risposta lo dimentica; a fine lettura si riparte dall'inizio.
  - **Ascolta / Pausa (v99):** anche il play ha il quadratino verde scuro con il triangolino bianco, come la pausa. Corretta la ripresa dopo la pausa: nella v98 l'app chiamava sempre `speechSynthesis.cancel()` subito prima di `speak()`, e su Android la nuova lettura veniva ignorata. Ora `cancel()` si chiama solo se sta già parlando, con un'attesa di 250 ms prima di ripartire.
  - **Ascolta / Pausa (v100):** il testo si legge a pezzi più corti (si spezza anche su virgole e a capo, massimo 12 parole per pezzo), così una pausa successiva riprende davvero dal nuovo punto e non dal pezzo lungo precedente. Se il telefono segnala la parola che sta leggendo (`onboundary`), la ripresa parte dalla **parola esatta**; altrimenti dall'inizio del pezzo interrotto.
  - **Data nella testata (v101):** su due righe, "Giovedì 26" sopra e il mese in MAIUSCOLO sotto ("NOVEMBRE"), stessa grandezza del testo (14 px); frecce ‹ › più grandi (32 px invece di 26).
  - **Data nella testata (v102):** il mese ha solo l'iniziale maiuscola ("Novembre"); spazio tra frecce e data portato a 12 px per lato (uguale a sinistra e a destra).
  - **Giornata archiviata (v103):** sfogliando con le frecce la pagina resta in cima (testata con data e kcal visibili; prima scorreva subito in fondo alla chat). Nella barra marrone tolto "Oggi ›" (per tornare a oggi si usa la freccia ›); "Modifica giornata" è un tasto di default verde scuro, sotto la frase, a sinistra.
  - **Modifica di una giornata archiviata (v104):** durante la modifica la barra marrone "Giornata archiviata" resta visibile sopra il pasto (elemento `#editBar`), con "Modifica giornata" disattivato a sinistra e **"Salva"** a destra (tasti di default). Frecce ‹ › disattivate e "Fine modifiche" in testata tolto. "Salva" rimette la giornata nello storico, mostra "Aggiornamento salvato" e torna alla giornata attuale.
  - **Fine Modifiche (v105):** il tasto "Salva" si chiama **"Fine Modifiche"**. Durante la modifica entrambe le frecce sono disattivate; premendo "Fine Modifiche" compare "Aggiornamento salvato" e si **resta sulla giornata appena modificata** (in sola lettura), con le frecce riattivate dove si può andare (› verso oggi sempre, ‹ solo se ci sono giornate più vecchie).
  - **Salva (v106):** il tasto torna a chiamarsi **"Salva"**; testo della barra in modifica: "Stai modificando una giornata archiviata." / "Tocca «Salva» per registrare le modifiche.". Dopo "Salva" si resta sulla giornata (comportamento della v105).
  - **Frecce ↑ ↓ (v107):** lo sfondo dei due cerchi è trasparente al 50% (bordo e freccia invariati), in chiaro e in scuro.
  - **Riga dei pasti (v108):** il pasto selezionato è verde chiaro `#2f8f5c` con nome e kcal bianchi (come "Diario" evidenziato); il cerchio **+** è bianco con il + verde chiaro e un bordo verde chiaro di 4 px.
  - **Tasto + (v109):** bordo di 2 px e + nello stesso colore del tasto microfono (`#436955` in chiaro, `#1f4d35` in scuro); cerchio bianco.
  - **Aggiungi un pasto (v110):** pillole con la forma delle schede Alimenti (raggio 34 px, alte 58 px), piene di verde `#2c6a49` con scritte bianche; pasti già aggiunti sbiaditi e non toccabili; più spazio sopra e sotto l'elenco; "Annulla" a sinistra come tasto di default.
  - **Alimenti (v111):** le pillole chiuse hanno lo sfondo verde `#22804f` (uguale in chiaro e in scuro), il bordo verde scuro di prima e tutte le scritte bianche (nome, kcal, "per …"); la scheda aperta resta con lo sfondo normale.
  - **Alimenti (v112):** il cerchio + di "Aggiungi alimento" è identico a quello del Diario (46 px, bianco, + e bordo da 2 px nel verde del microfono). Il tasto **Indietro di Android** (tasto o gesto) con una scheda alimento aperta la **chiude** invece di cambiare schermata (ogni apertura aggiunge un passo nella cronologia, che si toglie da solo se la scheda si chiude toccando il nome o "Annulla").
  - **Alimenti (v113):** tolto il riquadro azzurro che lampeggiava al tocco (`-webkit-tap-highlight-color: transparent` su tutta l'app). La chiusura della scheda con il gesto Indietro usa **CloseWatcher** (Chrome 120+), senza passare dalla cronologia: niente più schermata che scorre con lo swipe da sinistra. Se CloseWatcher manca si usa ancora la cronologia (v112).
  - **Alimenti (v114):** nasce il **tasto standard 2** (vedi 3.14). Lo usano tutti i pulsanti della sezione Alimenti: Annulla / Modifica / Elimina nella scheda aperta, Annulla / Salva nella finestra "Aggiungi/Modifica alimento", i tre "Rimuovi" delle foto e Annulla / Elimina (rosso) del pop-up di eliminazione. Restano com'erano le icone (fotocamera, galleria, microfono, invio, foto delle schede), i due selettori "Compila scheda Automaticamente / Manualmente" e la pillola "↻ Riprova".
  - **Alimenti (v115):** nella finestra Aggiungi/Modifica alimento i "Rimuovi" sono tasti standard 2 e i cerchi fotocamera/galleria delle foto sono grandi come microfono e invio (44 px, stesso verde). Indietro di Android: se una finestra (Modifica, conferma Elimina…) è aperta sopra una scheda alimento aperta, il primo Indietro chiude la finestra e il secondo la scheda (anche la finestra usa CloseWatcher in questo caso).
  - **Alimenti (v116):** più spazio (8 px in più) tra i cerchi fotocamera/galleria e il tasto "Rimuovi".
  - **Alimenti (v117):** le pillole chiuse hanno lo sfondo dello stesso verde scuro della cornice (`#1f4d35`), in chiaro e in scuro; scritte bianche.
  - **Alimenti (v118):** sfumatura sopra "Aggiungi alimento" più lunga (46 px invece di 18) e più decisa; barra con ombra più marcata in chiaro e, in scuro, ombra profonda più un alone chiaro di 1 px, così si stacca anche su fondo scuro. Solo nella sezione Alimenti.
  - **Alimenti (v119):** scorrendo, il titolo "Alimenti / N salvati" esce dallo schermo ma la barra **"Cerca un alimento" resta fissa in alto**; la lettera dell'indice si ferma subito sotto di lei, e sotto la lettera ferma c'è la stessa sfumatura della barra in basso (46 px). Le misure si calcolano da sole (`alimSticky()` / `alimStuck()`).
  - **Diario (v120):** la barra del pasto ("PRANZO 412 kcal · Elimina pranzo") ha forma, colore e misure della barra dei pasti in basso (pillola `#1f4d35`, alta 58 px, larga come quella in basso). Tolto lo spazio vuoto sopra la barra dei pasti in basso; scorrendo, il contenuto sfuma sotto la barra del pasto e sopra la barra dei pasti, con la stessa sfumatura degli Alimenti (46 px; `diarioFades()`).
  - **Impostazioni (v121):** tutti i blocchi hanno il bordo sottile (1 px) nel verde del tasto "Applica e torna al Diario" (`#2c6a49`); sfondo e contenuto invariati.
  - **Impostazioni (v122):** in Aspetto i tre tasti ("Come il Telefono", "Chiaro", "Scuro") sono pieni nel verde di "Applica e torna al Diario" (`#2c6a49`) con scritta bianca; quello selezionato è nel verde chiaro di "Nuova Giornata Alimentare" (`#2f8f5c`).
  - **Impostazioni (v123):** in Aspetto i tasti non selezionati hanno il verde degli spuntini non selezionati della barra del Diario (`#436955` in chiaro, `#153424` in scuro); il selezionato resta verde chiaro `#2f8f5c`.
  - **Impostazioni (v124):** cursori di Obiettivo kcal e Margine bonus nel verde chiaro `#2f8f5c`; nel blocco Storico "Conserva le giornate alimentari per" e sotto "Le giornate alimentari più vecchie vengono eliminate in automatico." (tolto "Le ricette restano sempre").
  - **Impostazioni (v125):** in Aspetto i tasti non selezionati hanno il verde della barra dei pasti del Diario (`#1f4d35`); quello selezionato è verde chiaro `#2f8f5c` con la spunta bianca ✓. Storico: "Conserva le Giornate Alimentari per" e sotto "Quelle più vecchie vengono eliminate in automatico."
  - **Impostazioni (v126):** il blocco "Gemini" si chiama **"Intelligenza Artificiale: Gemini"** (in futuro potranno esserci altri modelli). Tasti a pillola alti 40 px come lo standard 2, nel verde dei tasti non selezionati di Aspetto (`#1f4d35`): "Salva e Carica Modelli" a sinistra, "Mostra/Nascondi" a destra con larghezza fissa (104 px) che non cambia tra le due scritte.
  - **Impostazioni (v127):** blocco Backup su Google Drive riordinato: sotto il testo "Sincronizza" a sinistra (larghezza fissa, anche quando diventa "Sincronizzo…") con accanto "Ultimo backup" e gli avvisi; una riga sotto, a destra, "Scollega" e "Ripristina da Drive". Tutti nello stile dei tasti del blocco Intelligenza Artificiale (pillola 40 px, `#1f4d35`), compreso "Accedi con Google".
  - **Impostazioni (v128):** nel blocco Drive i tre tasti sono larghi uguali (150 × 40 px); "Scollega" è rosso. Accanto a "Sincronizza" c'è solo "Ultimo backup: data e ora" (tolti gli avvisi "Modifiche in attesa" ed errori); durante la sincronizzazione il tasto si disattiva e mostra "Sincronizzo…".
  - **Impostazioni (v129):** più spazio (22 px) tra "Sincronizza" e la riga "Scollega / Ripristina da Drive". Senza account collegato il blocco mostra il testo di spiegazione e solo "Accedi con Google".
  - **Impostazioni (v130):** testo del blocco Drive su tre righe: "Collegato come email" / "Alimenti, ricette e impostazioni si salvano subito;" / "il diario alla chiusura della giornata e una volta ogni 24 ore.". Accanto a Sincronizza: "Ultimo backup:" e sotto, su una riga, giorno, data e ora per esteso (es. "giovedì 26 novembre, 21:41").
  - **Impostazioni (v131):** in fondo alla pagina "* I Valori Nutrizionali Generici sono stime del modello" (arancione come "valore generico") e, a capo, "Versione NN". Per le prossime versioni si cambia solo il numero in "Versione NN".
  - **v132:** in fondo alle Impostazioni "Versione App: NN". **Storico nello stile degli Alimenti:** testata verde "Storico" con il conteggio ("8 giornate") fissa in alto, con la sfumatura sotto quando si scorre e quella in basso sopra la barra di navigazione; ogni giornata è una pillola verde scuro (bordo 4 px, raggio 34) con pallino colorato, giorno e data, kcal e "su obiettivo" in bianco; aperta torna con lo sfondo normale; tasti "Annulla" ed "Elimina" (prima "Elimina giornata") nel formato standard 2, anche nel pop-up di conferma (Elimina rosso).
  - **Storico (v133):** nella giornata aperta i nomi dei pasti sono in MAIUSCOLO e tutti i testi (macro, orari, kcal, alimenti) sono nel colore pieno del testo (bianco in scuro) e alla stessa grandezza. Il tasto/gesto Indietro di Android chiude la giornata aperta come negli Alimenti (CloseWatcher, funzione comune `bindCloseDetails()`); con il pop-up di conferma aperto, il primo Indietro chiude il pop-up e il secondo la giornata.
  - **Storico (v134):** titolo "Storico Giornate Alimentari" (20 px, con il conteggio accanto); tolte le sfumature (la pagina scorre normalmente). Nella giornata aperta, sotto la data: "RIEPILOGO: N kcal" e sotto i macro e gli orari; poi "COLAZIONE: N kcal", "PRANZO: …", "SPUNTINO 1: …" con gli alimenti. I titoletti sono verdi: `#1f4d35` (colore del bordo) in chiaro, `#4cc184` in scuro, perché il verde del bordo su fondo scuro non si leggeva.
  - **Storico (v135):** in modalità scura i titoletti (RIEPILOGO, COLAZIONE, PRANZO, SPUNTINO…) usano il verde di "Applica e torna al Diario" (`#2c6a49`); se risultasse troppo scuro si torna a `#4cc184` (v134). Le kcal in alto a destra restano verde acceso.
  - **Storico (v136):** il verde scuro era troppo scuro: in modalità scura i titoletti tornano a `#4cc184` (come nella v134).
  - **Riepilogo in chat (v137):** il totale kcal del pasto è nel verde chiaro di "Elimina pranzo/spuntino" (`#2f8f5c`); nell'elenco "Alimenti del pasto" ogni riga mostra anche le kcal dell'alimento in grassetto e nello stesso verde (es. "– Gallette di farro **8 g** — **30 kcal**").
  - **v138:** nel riepilogo "Alimenti del pasto" il nome è sulla prima riga ("– Nome") e quantità e kcal vanno a capo, rientrati. Nella Lista alimenti la X nel cerchio per togliere un alimento è **rossa** (`var(--bad)`, come i tasti Elimina).
  - **Tabella unica del pasto (v139):** la "Lista alimenti" in alto e il riepilogo in chat sono lo stesso riquadro largo e incorniciato (`mealBoxHTML()`): elenco alimenti (con X rossa), "Totale kcal PRANZO: N kcal" (verde chiaro) e tabella dei macro (Carboidrati, di cui zuccheri, Proteine, Grassi, di cui saturi, Fibre, Sale), più l'eventuale nota sui valori mancanti. In chat compare solo quando si chiede il totale/riepilogo, con Ascolta/Pausa sotto; tutte le tabelle della chat sono **sempre aggiornate** (eliminando un alimento da una si aggiornano tutte) e Ascolta legge i valori attuali. Nelle giornate archiviate lo stesso riquadro senza X.
  - **Domande di cucina (v140):** nel prompt `SYS_MEAL` regola fissa con esempi: temperature, tempi e modi di cottura (friggitrice ad aria, forno, padella…), livello del fuoco, preparazione, conservazione, sostituzioni sono sempre "domanda": la lista non si tocca, Gemini risponde da cuoco esperto; citare un alimento in una domanda di cucina non lo aggiunge (se è ambiguo chiede se aggiungerlo).
  - **Titolo della tabella (v141):** "LISTA ALIMENTI – TOTALE KCAL E MACRO", in grassetto, 17 px (come il nome del pasto nella barra), bianco in modalità scura.
  - **Tabella del pasto (v142):** titolo su due righe senza trattino ("LISTA ALIMENTI" / "TOTALE KCAL E MACRO"); riga "Totale kcal PRANZO:" grande come il titolo (17 px, grassetto, bianca in scuro) con il numero delle kcal nel verde dell'etichetta "valore sicuro" (`#2a7a4b` in chiaro, `#5cc58a` in scuro).
  - **Impostazioni (v143):** il tasto di Sicurezza si chiama "PIN Applicazione" ed è come "Sincronizza" (150 × 40 px, verde scuro); sotto Reset App: "Cancella solo i dati su questo telefono:" e a capo "i backup su Drive restano."
  - **Backup su file (v144):** "Esporta backup" apre il menu di condivisione di Android (File con scelta della cartella, Google Drive, email, WhatsApp…); il file condiviso si chiama `diario-kcal-AAAA-MM-GG.txt` (Android non permette di condividere i `.json`, il contenuto è lo stesso JSON). Se si chiude il menu senza scegliere, o la condivisione non è disponibile, il file `.json` va in Download come prima. "Importa backup" accetta sia `.json` sia `.txt`. Tasti "Esporta backup" (a sinistra) e "Importa backup" (a destra) nello stile di "Sincronizza".
  - **Tabella del pasto (v145):** i tasti **Ascolta / Pausa** sono dentro la tabella, sotto la riga del Sale (con un po' di spazio), sia nella "Lista alimenti" in alto sia nelle tabelle in chat; leggono solo il contenuto della tabella (alimenti, totale e macro). Tolta la nota piccola grigia di Gemini sotto le tabelle del riepilogo in chat.
  - **v146:** nello Storico, nella giornata aperta: "Annulla" a sinistra, a destra "Modifica" e poi "Elimina" (rosso, tutto a destra, v147). "Modifica" porta subito al Diario su quella giornata archiviata, con la barra marrone e "Modifica giornata" (se si sta già modificando un'altra giornata, avvisa). All'avvio e dopo ogni aggiornamento (anche "trascina per aggiornare") l'app riparte sempre dal **Diario, giornata in corso, nessun pasto selezionato** (se c'era una modifica di giornata archiviata non salvata, riapre quella).
  - **v147:** nello Storico l'ordine dei tasti è Annulla … Modifica, **Elimina** (rosso, tutto a destra). Ascolta nella tabella del pasto legge per ogni alimento anche le kcal ("Gallette di farro, 8 grammi, 30 chilocalorie").
  - **v148:** nello Storico più spazio tra il pallino colorato e la data (14 px). Documento di pianificazione riallineato in tutte le sezioni allo stato attuale.
  - **v149:** corretto il gesto Indietro sulle finestre (es. "Aggiungi un pasto" aperto con il +, conferme, "Nuova Giornata Alimentare") e sulle foto a tutto schermo: si chiudono in modo fluido, senza la schermata che scorre (CloseWatcher, come già per le schede di Alimenti e Storico).
  - **v150:** aggiornamento con pressione prolungata (≈0,5 s) sul tasto della sezione già selezionata nella barra in basso (Diario, Alimenti, Ricette, Storico): vibrazione e ricarica, che riporta al Diario come ogni aggiornamento. Il tocco normale resta invariato; premere a lungo un tasto non selezionato non fa nulla di speciale.
  - **v151:** la pressione prolungata per aggiornare vale su **tutti** i tasti della barra in basso, compresa Impostazioni, selezionati o no, e dura **1 secondo**.
  - **v152:** tenendo premuto **Ascolta** per 1 secondo il telefono vibra e la lettura **riparte dall'inizio** (anche se era in corso o in pausa); niente selezione del testo né menu sui tasti Ascolta/Pausa. Il tocco normale resta invariato (avvia o riprende dalla pausa).
  - **v153: lettura automatica (AUTO).** Accanto ad Ascolta e Pausa (sotto ogni risposta dell'IA e dentro la tabella del pasto) c'è un terzo pulsante **tondo**, alto come gli altri, con la testa di profilo rivolta a sinistra, tre onde della voce e la scritta "AUTO". Spento: contorno e icona verdi; acceso: pieno verde con icona bianca. Quando è acceso, ogni nuova risposta dell'IA (pasti e Ricette, compresa la tabella del totale) viene letta da sola appena arriva. È un'impostazione unica (`settings.autoRead`): accesa o spenta vale in tutte le chat, resta dopo la chiusura o l'aggiornamento dell'app ed entra nei backup.
  - **v154:** il tasto **Reset App** è nello stile degli altri tasti delle Impostazioni (pillola senza bordo, scritta bianca normale), rosso, più grande (48 px di altezza, testo 16 px), largo l'80% e centrato.
  - **v155:** solo nella sezione Alimenti e **solo in modalità chiara**, le sfumature in alto (sotto la lettera ferma) e in basso (sopra "Aggiungi alimento") sono dimezzate: 23 px invece di 46. In modalità scura invariate. Per distinguere le modalità l'app mette la classe `lightmode` su `<html>` quando l'aspetto effettivo è chiaro (anche con "Come il Telefono").
  - **v156:** Impostazioni, blocco Backup su Google Drive: "Scollega" (rosso) ora è tutto a sinistra, allineato con "Sincronizza" ed "Esporta backup"; "Ripristina da Drive" resta a destra, allineato con "Importa backup".
  - **v157:** sezione Alimenti, solo in modalità chiara: sfumature in alto e in basso dimezzate di nuovo, 12 px invece di 23 (in scuro restano 46).
  - **v158:** Diario, solo in modalità chiara: i messaggi dell'utente nella chat (scritti o dettati) hanno lo sfondo verde dei tasti microfono e fotocamera (`#436955`) con il testo bianco, al posto del verdino chiarissimo. In scuro e nella chat Ricette invariati.
  - **v159:** annullate la v155 e la v157: nella sezione Alimenti le sfumature in alto e in basso tornano a 46 px anche in modalità chiara, identiche a quelle del Diario. Resta la classe `lightmode` su `<html>` (usata dalla v158).
  - **v160:** Alimenti, in chiaro e in scuro: la barra "Cerca un alimento" ha sempre il bordo bianco (2 px), non solo quando la si tocca; toccandola non compare nessuna cornice in più, solo il cursore che lampeggia.
  - **v161:** nella barra "Cerca un alimento" (chiaro e scuro) c'è una lente di ingrandimento stilizzata, nello stesso bianco trasparente della scritta, seguita da un po' di spazio e poi dalla scritta. Solo in modalità chiara, le pillole chiuse di Alimenti e Storico hanno lo sfondo nel verde del tasto microfono (`#436955`); bordo e scritte invariati.
  - **v162:** sezione Alimenti, in chiaro e in scuro: **tolte del tutto le sfumature** in alto (sotto la lettera ferma) e in basso (sopra "Aggiungi alimento"): ora il taglio è netto. Le sfumature restano **solo nel Diario** (Storico e Ricette non ne hanno).
  - **v163:** Alimenti, solo in modalità chiara: le pillole chiuse sono più basse (padding 5 px invece di 12, circa 60 px invece di 78; due righe ci stanno comode), con sfondo **bianco** e bordo e scritte nello stesso verde scuro `#1f4d35` (variante A dell'anteprima). Scheda aperta e modalità scura invariate.
  - **v164:** solo in modalità chiara. **Impostazioni:** testata verde fissa in alto con il titolo "Impostazioni", alta come quella dello Storico; sotto la testata la stessa sfumatura che c'è in basso sopra "Applica e torna al Diario" (circa 21 px). **Alimenti:** tornano le sfumature, ma nello stile di quella delle Impostazioni: in basso sopra "Aggiungi alimento" (come la barra "Applica") e in alto sotto la lettera ferma (21 px). In modalità scura tutto invariato (Impostazioni con il titolo semplice, Alimenti senza sfumature).
  - **v165:** **Storico:** sotto la testata c'è la **legenda dei pallini** (in chiaro e in scuro): verde "Entro l'obiettivo", arancione "Nel margine bonus", rosso "Oltre il bonus". Solo in modalità chiara: le pillole delle giornate sono uguali a quelle degli Alimenti (più basse, sfondo bianco, bordo e scritte `#1f4d35`, pallino con contorno verde) e ci sono le sfumature da 21 px sotto la testata e in basso. **Ricette** (solo in chiaro): testata verde con il titolo "Ricette", alta come in Storico e Impostazioni, con le stesse sfumature sotto la testata e in basso, già pronte per quando la sezione verrà ristrutturata.
  - **v166:** **Alimenti:** le frecce rotonde ↑ ↓ sono alla stessa altezza che hanno nel Diario (prima stavano sopra "Aggiungi alimento", troppo in basso); vale in chiaro e in scuro. **Storico** (solo in chiaro): la testata verde è alta come quella degli Alimenti e contiene, al posto della ricerca, una pillola tutta bianca della stessa forma e misura di "Cerca un alimento" con dentro la legenda dei pallini (in scuro la legenda resta sotto la testata). **Nota dell'utente:** le modifiche di questa serie (v158–v166) sono pensate per la modalità chiara; più avanti si riadatterà tutto anche alla modalità scura.
  - **v167: modalità chiara conclusa e misure riportate anche in scuro.**
    - **Titoli uniformi:** Alimenti, Storico, Ricette e Impostazioni hanno la stessa testata verde (`.ahead`) con il titolo a 24 px, nella stessa posizione (16 px dal bordo, riga del titolo alta 36 px). Nello Storico il titolo "Storico Giornate Alimentari" a 24 px occupa tutta la riga, quindi il conteggio delle giornate accanto è stato nascosto.
    - **Storico:** frecce ↑ ↓ alla stessa altezza del Diario (come Alimenti e Impostazioni), sfumatura sotto la testata verde e sfumatura in basso sopra la barra di navigazione, pronte per quando le giornate sono tante.
    - **Ricette:** solo il titolo uniformato (testata verde); il resto della sezione è da definire.
    - **Modalità scura:** riprese tutte le misure della chiara, tenendo i colori attuali del tema scuro: pillole di Alimenti e Storico più basse, testate verdi di Storico (con la pillola della legenda, qui semitrasparente con bordo bianco come la ricerca), Ricette e Impostazioni, sfumature da 21 px in Alimenti, Storico, Ricette e Impostazioni. Restano solo in chiaro i colori: pillole bianche con bordo e scritte `#1f4d35`, pillola bianca della legenda, messaggi dell'utente nel Diario in `#436955`.
  - **v168: swipe tra le sezioni.** Uno swipe verso sinistra porta alla sezione successiva e verso destra alla precedente, a carosello: Diario → Alimenti → Ricette → Storico → Impostazioni → di nuovo Diario (e al contrario). Vale su tutta l'app tranne vicino ai bordi dello schermo (28 px, per non disturbare il gesto Indietro di Android), sulle barre che scorrono in orizzontale (es. la riga dei pasti quando è piena), sui cursori delle Impostazioni e con una finestra o una foto aperta. Serve uno spostamento orizzontale netto (almeno 70 px, molto più orizzontale che verticale, in meno di 0,7 s), così lo scorrimento normale su e giù non cambia sezione. **Testo del Diario vuoto:** "Tocca il + in basso a sinistra per Aggiungere un Pasto (…)" e "Per Vedere o Modificare un pasto, scorri la barra in basso e Tocca il suo Pulsante Pasto."
  - **v169:** testo del Diario vuoto definitivo, su tre paragrafi: "Tocca il + in basso a sinistra per **Aggiungere un Pasto** (Colazione, Pranzo, Cena o Spuntino), poi scrivi, detta o fotografa cosa hai mangiato." / "Per **Vedere o Modificare** un pasto, scorri la barra in basso e **Tocca il Pulsante dedicato**." / "A fine giornata **Tocca Nuova Giornata Alimentare** in alto: la giornata attuale viene salvata nello Storico e se ne apre una nuova." Swipe più fluido: la sezione nuova entra scorrendo dal lato dello swipe (230 ms, con dissolvenza); soglia dello swipe abbassata a 60 px. Se il telefono ha attivo "riduci animazioni" l'effetto non c'è.
  - **v170:** terzo paragrafo del Diario vuoto: "A fine giornata **Tocca Nuova Giornata Alimentare** in alto a destra: la giornata attuale viene **Salvata nello Storico** e se ne apre una nuova." **Prova:** il tasto "Nuova Giornata Alimentare" in testata ha un bordo bianco da 2 px, come i cerchi delle frecce ‹ › della data (misure 150 × 40 invariate, in chiaro e in scuro). Confermato dall'utente: si tiene.
  - **v171:** frecce ‹ › della data piene del verde di "Nuova Giornata Alimentare" (`#2f8f5c`), più chiare quando non si possono usare. **X per togliere un alimento** (Lista alimenti e tabelle in chat): più piccola (24 px invece di 30) e verde `#2f8f5c` invece che rossa; la conferma "Elimina" resta rossa. **Rimuovi foto** (Aggiungi/Modifica alimento): ora chiede conferma con una finestrella sopra la scheda: "Eliminare la foto?" / "Sei sicuro di voler eliminare la foto? Verrà cancellata.", con Annulla ed Elimina (rosso), formato standard 2 (funzione `miniConfirm()`). **Swipe:** la sezione cambia appena il dito ha percorso 60 px, senza aspettare che si stacchi dallo schermo; animazione d'ingresso più corta (180 ms). Valgono in chiaro e in scuro. Lo swipe così è confermato dall'utente.
  - **v172:** conferma Rimuovi foto su due righe: "Sei sicuro di voler eliminare la foto?" / "Verrà cancellata definitivamente.". Nello Storico, nella giornata aperta, il tasto **Elimina** è verde come Annulla e Modifica: rosso resta solo il tasto della conferma definitiva nel pop-up. **Regola:** il rosso si usa solo per il tasto che elimina davvero (quello della conferma).
  - **v173:** **titolo "Diario"** in cima alla testata verde, stesso carattere, grandezza (24 px) e posizione del titolo degli Alimenti; il resto della testata scende sotto. Scorrendo la testata esce dallo schermo e resta ferma solo la barra del pasto ("PRANZO … kcal"). **Ritorno al Diario** (con lo swipe o con la barra in basso): si riparte sempre dall'alto con tutta la testata visibile, come dopo un aggiornamento, anche se c'era un pasto selezionato.
  - **v174:** solo in modalità chiara, la pillola della testata che contiene data, frecce e "Nuova Giornata Alimentare" ha lo stesso verde dei riquadri dei macro (bianco al 10% sul verde della testata) invece di `#2c6a49`. In scuro invariata. Con questa modifica la grafica della modalità chiara è considerata conclusa.
  - **v175 (prova):** tolti i bordi bianchi da "Nuova Giornata Alimentare" e dalle frecce ‹ › della data. **Ricette:** sopra il campo di scrittura c'è la stessa barra verde della riga dei pasti del Diario (stesso colore, misure e distanza dal campo di scrittura), senza il + e con due pulsanti **segnaposto**: "Crea Nuova Ricetta" e "Ricettario" (stessi colori dei pasti: verde chiaro quando selezionati). Per ora toccandoli si evidenziano e in cima alla sezione compare solo il titolo verde corrispondente; il resto verrà fatto con la ristrutturazione delle Ricette. Il campo di scrittura delle Ricette non ha più il testo d'esempio e la riga "Chat ricette · non viene contata nel diario" è nascosta.
  - **v176:** la pillola della testata del Diario (data, frecce, "Nuova Giornata Alimentare") ha un bordo bianco da 2 px tutto intorno, come la pillola "Cerca un alimento", disegnato **verso l'esterno** (con `box-shadow`, quindi non toglie spazio all'interno e le misure restano uguali). In chiaro e in scuro.
  - **v177:** solo in modalità chiara, la pillola della data è **tutta bianca**, senza bordo, con la data scritta in verde scuro `#1f4d35` (frecce e "Nuova Giornata Alimentare" restano verdi). In scuro resta la pillola verde con il bordo bianco esterno della v176. Confermata dall'utente.
  - **v178: un unico ovale nelle testate.** La pillola della data (Diario), "Cerca un alimento" (Alimenti) e la pillola della legenda (Storico) hanno tutte la stessa misura: **alte 52 px e larghe uguali** (388 px su un telefono largo 412). La pillola della data non si rimpicciolisce più nelle giornate archiviate, dove manca "Nuova Giornata Alimentare". Misure valide in chiaro e in scuro. Solo in chiaro: "Cerca un alimento" è un ovale tutto bianco senza bordo, con lente e scritta in verde scuro `#1f4d35`; anche la legenda è un ovale bianco senza bordo.
  - **v179: modalità scura "ribaltata" dalla chiara.** Regola usata: in chiaro ovali e pillole hanno il fondo della scheda (bianco) con bordo e scritte nel verde scuro del marchio `#1f4d35`; in scuro hanno il fondo della scheda scuro (`var(--card)`, `#18201b`) con bordo e scritte nel verde acceso del tema scuro `#4cc184`. Quindi in scuro: pillola della data (senza bordo, data in `#4cc184`), "Cerca un alimento" (senza bordo, lente e scritta `#4cc184`), legenda dello Storico, pillole di Alimenti e Storico (fondo scuro, bordo e scritte `#4cc184`, pallino con contorno `#4cc184`); messaggi dell'utente nel Diario nel verde del tasto microfono del tema scuro (`#1f4d35`) con testo bianco. Misure, barre e sfumature erano già uguali dalla v167. Ora chiaro e scuro seguono le stesse regole.
  - **v180:** modalità scura, solo Alimenti: bordo e scritte delle pillole nel verde della testata (`#1f4d35`, lo sfondo di "Alimenti · N salvati"); le lettere C, F, G… restano verde acceso `#4cc184`. Verificato che misure delle pillole (60 px) e spessore del bordo (4 px) sono uguali in chiaro e in scuro. Nota: su fondo scuro le scritte `#1f4d35` sono poco leggibili, da valutare sul telefono.
  - **v181:** modalità scura, colori di fondo invertiti per coerenza in tutta l'app: lo **sfondo dell'app** è il grigio scuro `#18201b` (prima era il colore delle schede e delle pillole) e **finestre, schede, pillole e riquadri** (chat del Diario, tabella del pasto, pillole di Alimenti e Storico, ovali delle testate, blocchi delle Impostazioni) sono **nero assoluto** `#000` (variabili `--bg` e `--card` del tema scuro). In chiaro nulla cambia.
  - **v182:** modalità scura, sezione Alimenti in **bianco**: lente e scritta di "Cerca un alimento", bordo e testo delle pillole (al posto del verde della v180) e lettere dell'indice C, F, G…
  - Altri ritocchi della giornata (v64–v79): icone del composer in cerchi verde scuro, voce attiva della barra in basso con pillola verde, pulsanti in modalità chiara nello stesso verde, testi di aiuto con le parti in grassetto, tolti i bordi rossi.


**Stato:** online, **collaudo in corso dal 25/11/2026**. Il 26/11 sera (v91–v182) è stata rifinita la grafica di Diario, Alimenti, Storico e Impostazioni: interfaccia considerata finita dall'utente; resta da ristrutturare la sezione Ricette (vedi Cose da fare).

---

## 📋 STATO DELLE SEZIONI (25/11/2026, valutazione dell'utente)
- ✅ **Già funzionanti:** Diario, Alimenti, Storico, Impostazioni.
- 🔧 **Da implementare / completare:** **Ricette** (nel codice esiste già una prima versione con chat e ricettario, da rivedere e completare) e **Preimpostati** (oggi solo il segnaposto "Sezione in arrivo").
- ❓ Ricette e Preimpostati: **da decidere se resteranno** nell'app oppure no.
- **26/11 (v53):** tolto il pulsante **Preimpostati** dalla barra in basso, in attesa di capire se la sezione può essere utile. La barra ora ha 5 voci (Diario, Alimenti, Ricette, Storico, Impostazioni), più larghe e centrate. La sezione (oggi solo un segnaposto) e la fonte `preimpostato` restano nel codice: per rimetterla basta ripristinare il pulsante `data-v="pasti"` e tornare a 6 colonne.

## ✅ COSE DA FARE

### Da implementare
1. **Sezione Ricette, da ristrutturare** (non urgente, da fare in un secondo momento). Come dovrà funzionare:
   - **Chat per creare le ricette.** Si danno a Gemini gli ingredienti con le dosi e si indica in quante **porzioni** si divide la ricetta (es. un impasto da cui escono 4 piadine = 4 porzioni). A ogni ingrediente aggiunto o modificato si vede sempre, aggiornato:
     - il **totale della ricetta**: elenco di tutti gli ingredienti con le quantità, kcal totali e macro totali;
     - sotto, la **singola porzione**: ingredienti con le quantità per porzione, kcal e macro di una porzione (totale diviso per il numero di porzioni).
   - **Domande di cucina nella chat.** La chat risponde anche a domande pratiche di cucina (es. "quanto olio mi consigli di mettere?", tempi, cotture, sostituzioni), se conosce la risposta. Queste risposte **non toccano** la lista degli ingredienti né il conteggio di kcal e macro: cambia qualcosa solo quando l'utente aggiunge o modifica davvero un ingrediente.
   - **Ricettario.** Quando la ricetta è nella versione finale, dalla chat la si salva nel Ricettario, cioè l'elenco di tutte le ricette salvate.
   - **Salva come alimento.** Sia nella chat sia nel Ricettario, il blocco della **singola porzione** (ingredienti, kcal e macro per porzione) si può salvare come **singolo alimento** nella sezione Alimenti (es. "1 piadina").

### Futuro
1. Eventuale APK "autonoma" con tutto il codice dentro (Capacitor o simili): servirebbe solo per il Play Store o per non dipendere da GitHub. Richiede di rifare il login Google per Drive e la dettatura.
2. Possibilità di agganciare altri "cervelli" AI usando gli abbonamenti Pro (ChatGPT, Gemini Pro, Claude Pro), quando renderanno disponibile questa funzione nelle app di terze parti.
3. Possibilità di agganciare un'AI locale come "cervello" (per esempio Gemini Nano sul telefono), quando sarà possibile farlo.
4. ✅ *Fatta nella v165.* **Legenda del pallino colorato nello Storico** (idea, 26/11/2026): verde = entro l'obiettivo kcal, giallo/arancione = nel margine bonus, rosso = oltre il bonus. Da mostrare prima o poi nell'app (per esempio una riga piccola sotto il titolo dello Storico).

### Cose da vedere per far utilizzare l'applicazione ad altre persone
*Ipotesi del 26/11/2026: passare la stessa APK a un'amica, che usa una sua chiave API Gemini.*

**Cosa resta separato (nessun conflitto):**
- **Dati:** diario, storico, alimenti con foto, ricette e impostazioni stanno nel telefono di chi usa l'app. Nessuno vede i dati dell'altro.
- **Chiave API:** la sua chiave resta solo sul suo telefono; le richieste a Gemini vanno sul suo progetto Google e consumano la sua quota gratuita. Anche lei deve usare un progetto **senza fatturazione**.
- **Backup su Drive:** si salva nel **suo** Google Drive, nella sua cartella "KalRaf28 Backup".
- **Repository:** contiene solo il codice, uguale per tutti; l'app lo legge e non ci scrive niente.

**Cosa è condiviso (da sistemare prima):**
1. **PIN:** è unico e scritto nel codice (hash), quindi lei dovrebbe conoscere il PIN dell'utente. Se non lo si vuole condividere, va cambiato il sistema.
2. **Accesso a Google Drive:** il login passa dalla schermata di consenso OAuth del progetto Google Cloud dell'utente. Se è in modalità "test", va aggiunto il suo Gmail tra gli **utenti di prova**, altrimenti Google blocca il backup su Drive (il resto dell'app funziona comunque).
3. **Aggiornamenti:** ogni modifica pubblicata arriva anche a lei, comprese prove o errori. Conviene pubblicare solo versioni controllate.
4. **APK:** si passa lo stesso file `KalRaf28.apk` e lo si installa dal file; funziona uguale, anche senza la barra in alto.

**In sintesi:** l'uso da parte di un'altra persona è fattibile. Prima vanno sistemati il PIN (condividerlo o cambiare il sistema) e, se serve il backup su Drive, l'aggiunta del suo account agli utenti di prova su Google Cloud.

### Note
- **Blocco in verticale** (da sistemare alla prossima rigenerazione dell'APK, non urgente): l'app non ruota in orizzontale e non si può usare a schermo diviso. Soluzione: togliere `orientation` dal manifest e rigenerare l'APK (stesso keystore, **version code 4**). Rimandato dall'utente il 26/11.
  - **Idea dell'utente:** interruttore **"Blocca in verticale" sì/no** nelle Impostazioni, con `screen.orientation.lock()` / `unlock()`.
