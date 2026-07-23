import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Informativa Privacy — Onboarding Brand Identity",
  description:
    "Informativa sul trattamento dei dati personali raccolti tramite il questionario di onboarding brand identity.",
};

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-neutral-900">
        {number}. {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-600">
        {children}
      </div>
    </section>
  );
}

function SubSection({
  letter,
  title,
  children,
}: {
  letter: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 pl-4">
      <h3 className="text-base font-semibold text-neutral-800">
        {letter}. {title}
      </h3>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-neutral-600">
        {children}
      </div>
    </div>
  );
}

export default function InformativaPrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-8">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna al questionario
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-neutral-900">
          Informativa Privacy
        </h1>
        <p className="text-sm text-neutral-400">
          Data di entrata in vigore: 23/07/2026 — Ultimo aggiornamento: 23/07/2026
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <Section number="1" title="Introduzione alla Privacy Policy">
          <p>
            Ai sensi dell&apos;art. 13 del Regolamento (UE) n. 679/2016 (&quot;GDPR&quot;) e del D.
            Lgs. 196/2003, come modificato dal D.Lgs. 101/2018, con la presente informativa
            Arianna Dal Monte (in seguito il &quot;Titolare&quot;) intende informare l&apos;utente (in
            seguito l&apos;&quot;Interessato&quot;) sulla tutela della riservatezza dei dati personali,
            sulla tipologia di dati raccolti e sulle modalità di trattamento adottate in
            relazione al questionario di onboarding per progetti di brand identity, nel
            rispetto della normativa vigente.
          </p>
          <p>
            Il trattamento dei dati è improntato ai principi di liceità, correttezza e
            trasparenza e alla tutela della riservatezza e dei diritti dell&apos;Interessato.
          </p>

          <SubSection letter="a" title="Titolare del trattamento">
            <p>Arianna Dal Monte — UX/UI, Brand &amp; Graphic Designer freelance (ADM Design &amp; Digital)</p>
            <ul className="flex flex-col gap-1">
              <li>C.F.: DLMRNN00P47G224D</li>
              <li>P.IVA: 04509970242</li>
              <li>Sede: Via Alessandro Manzoni, 25 — 36065 Mussolente (VI)</li>
              <li>
                E-mail di riferimento:{" "}
                <a
                  href="mailto:dalmontearianna.96@gmail.com"
                  className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
                >
                  dalmontearianna.96@gmail.com
                </a>
              </li>
            </ul>
            <p>
              Il Titolare è contattabile per qualsiasi richiesta relativa al trattamento dei
              dati personali tramite l&apos;indirizzo e-mail sopra indicato.
            </p>
          </SubSection>
        </Section>

        <Section number="2" title="Categorie di dati oggetto del trattamento">
          <p>Compilando il questionario, il Titolare raccoglie i seguenti dati:</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>
              <strong>Dati anagrafici e di contatto:</strong> nome dell&apos;azienda/referente,
              indirizzo e-mail, numero di telefono (facoltativo);
            </li>
            <li>
              <strong>Dati forniti volontariamente sul progetto:</strong> le risposte al
              questionario relative a storia, valori, posizionamento, riferimenti visivi,
              preferenze estetiche e altre informazioni utili alla definizione dell&apos;identità
              visiva del brand;
            </li>
            <li>
              <strong>Eventuali file allegati:</strong> immagini o documenti (loghi di
              riferimento, esempi, asset esistenti) allegati direttamente nel form oppure
              forniti tramite link a servizi di terze parti scelti liberamente
              dall&apos;Interessato (es. Google Drive, WeTransfer);
            </li>
            <li>
              <strong>Dati tecnici minimi:</strong> data e ora di invio del questionario,
              generati automaticamente al momento della submission.
            </li>
          </ul>
          <p>
            Non vengono richieste né raccolte categorie particolari di dati personali ai sensi
            dell&apos;art. 9 GDPR (es. dati sanitari, origine etnica, opinioni politiche). Il sito
            non utilizza cookie di profilazione o di terze parti.
          </p>
        </Section>

        <Section number="3" title="Base giuridica e finalità del trattamento">
          <p>
            Il trattamento si fonda sul <strong>consenso esplicito</strong> dell&apos;Interessato,
            manifestato tramite l&apos;apposita casella di conferma prima dell&apos;invio del
            questionario, e sulla necessità di dare seguito alla richiesta di un progetto di
            brand identity. I dati raccolti sono utilizzati esclusivamente per:
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>valutare e organizzare il progetto di brand identity richiesto;</li>
            <li>
              contattare l&apos;Interessato per approfondire le risposte fornite o proporre un
              preventivo/appuntamento;
            </li>
            <li>adempiere a eventuali obblighi di legge o contabili connessi al rapporto.</li>
          </ul>
          <p>
            I dati non sono utilizzati per finalità di marketing, newsletter o profilazione, e
            non vengono in alcun caso ceduti, venduti o comunicati a terzi per finalità
            commerciali.
          </p>

          <SubSection letter="a" title="Periodo di conservazione dei dati">
            <p>
              I dati sono conservati per il tempo necessario a valutare e, in caso di
              accordo, gestire il progetto richiesto, e successivamente per il periodo
              previsto dalla normativa fiscale/amministrativa applicabile ai rapporti
              professionali. Se il progetto non prosegue, i dati vengono conservati solo per
              il tempo necessario a rispondere alla richiesta, salvo diversa richiesta di
              cancellazione anticipata da parte dell&apos;Interessato.
            </p>
          </SubSection>

          <SubSection letter="b" title="Modalità di raccolta">
            <p>
              I dati sono raccolti esclusivamente tramite la compilazione volontaria del
              questionario online. Non vengono raccolti dati di navigazione, tracciamento o
              analytics: il sito non utilizza cookie non tecnici né strumenti di terze parti
              con finalità statistiche o pubblicitarie.
            </p>
          </SubSection>
        </Section>

        <Section number="4" title="Modalità del trattamento dei dati">
          <p>
            I dati personali sono trattati con strumenti informatici, per il tempo
            strettamente necessario a conseguire gli scopi per cui sono raccolti, ad opera
            del solo Titolare, in ottemperanza a quanto previsto dall&apos;art. 5 e dall&apos;art. 29
            del GDPR.
          </p>

          <SubSection letter="a" title="Gestione della richiesta di progetto">
            <p>
              Le risposte del questionario vengono salvate in un foglio di calcolo Google
              Sheets ad accesso riservato e inviate via e-mail al Titolare per la
              valutazione e la presa in carico del progetto. Un&apos;e-mail di conferma di
              avvenuta ricezione viene inviata anche all&apos;indirizzo fornito
              dall&apos;Interessato.
            </p>
          </SubSection>

          <SubSection letter="b" title="Sicurezza informatica">
            <p>
              Il Titolare adotta misure tecniche adeguate a prevenire la perdita dei dati,
              usi illeciti o non corretti e accessi non autorizzati, anche avvalendosi di
              fornitori di servizi (Google, per l&apos;archiviazione e l&apos;invio delle e-mail) che
              garantiscono un livello di sicurezza conforme alla normativa vigente in materia
              di protezione dei dati personali.
            </p>
          </SubSection>
        </Section>

        <Section number="5" title="Comunicazione e diffusione dei dati">
          <p>
            I dati dell&apos;Interessato non vengono diffusi pubblicamente. Possono essere trattati
            dai seguenti fornitori terzi, in qualità di responsabili o autonomi titolari del
            trattamento per i servizi tecnici che erogano:
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>
              <strong>Google LLC:</strong> archiviazione delle risposte (Google Sheets) e
              invio delle e-mail di notifica/conferma (Gmail);
            </li>
            <li>
              <strong>Fornitore di hosting</strong> del sito web, per il solo funzionamento
              tecnico dell&apos;applicazione.
            </li>
          </ul>
          <p>
            I dati sono conservati su server situati all&apos;interno dell&apos;Unione Europea o
            comunque gestiti da fornitori che garantiscono un livello di protezione conforme
            al GDPR. Il Titolare non effettua trasferimenti sistematici di dati extra-UE.
          </p>
        </Section>

        <Section number="6" title="Tutela dei minori">
          <p>
            Il questionario è rivolto a soggetti maggiorenni che agiscono in qualità di
            titolari o referenti di un&apos;attività economica. Non è pensato per la raccolta di
            dati di minori. Qualora il Titolare venisse a conoscenza che sono stati raccolti
            dati riferiti a un minore senza il consenso di chi ne esercita la responsabilità
            genitoriale, provvederà alla loro tempestiva cancellazione.
          </p>
        </Section>

        <Section number="7" title="Diritti dell'interessato">
          <p>
            L&apos;Interessato può in qualsiasi momento esercitare i propri diritti scrivendo a{" "}
            <a
              href="mailto:dalmontearianna.96@gmail.com"
              className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
            >
              dalmontearianna.96@gmail.com
            </a>
            :
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>
              <strong>Diritto di accesso (art. 15):</strong> ottenere conferma dell&apos;esistenza
              di dati personali che lo riguardano e accedervi;
            </li>
            <li>
              <strong>Diritto di rettifica (art. 16):</strong> ottenere la correzione di dati
              inesatti o incompleti;
            </li>
            <li>
              <strong>Diritto alla cancellazione (art. 17):</strong> richiedere la
              cancellazione dei propri dati; il Titolare fornisce riscontro entro 30 giorni;
            </li>
            <li>
              <strong>Diritto di limitazione (art. 18):</strong> richiedere la limitazione del
              trattamento dei propri dati;
            </li>
            <li>
              <strong>Diritto alla portabilità (art. 20):</strong> ricevere i propri dati in
              un formato strutturato e leggibile da dispositivo automatico;
            </li>
            <li>
              <strong>Diritto di opposizione (art. 21):</strong> opporsi in qualsiasi momento
              al trattamento dei propri dati;
            </li>
            <li>
              <strong>Diritto di reclamo (art. 77):</strong> proporre reclamo all&apos;autorità di
              controllo competente, secondo le indicazioni pubblicate su{" "}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
              >
                www.garanteprivacy.it
              </a>
              .
            </li>
          </ul>
          <p>
            Eventuali aggiornamenti a questa informativa verranno comunicati tempestivamente
            tramite il sito.
          </p>
        </Section>
      </div>
    </main>
  );
}
