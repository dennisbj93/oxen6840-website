# Værtshuset Oxen – hjemmeside

Filer:
- `index.html` – hele siden
- `oxen-logo.svg` – logoet som vektor (header, forside og faviconikon)
- `oxen-logo.jpg` – det originale logo (bruges som delingsbillede på Facebook)
- `README.md` – denne vejledning

## Udgivelse via GitHub og Cloudflare Pages
Siden ligger i GitHub-repoet, og Cloudflare bygger den automatisk ved hvert push til `main`.

Første gang:
1. Log ind på https://dash.cloudflare.com
2. Gå til **Workers & Pages** → **Create** → fanen **Pages** → **Connect to Git**.
3. Vælg GitHub, giv Cloudflare adgang til repoet, og vælg det.
4. Indstillinger:
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: lad feltet være tomt
   - Build output directory: `/`
5. Tryk **Save and Deploy**. Siden kommer på `<projektnavn>.pages.dev`.

Senere ændringer: ret filerne i repoet (også direkte på github.com) og commit til `main`. Cloudflare udgiver selv den nye version efter et minuts tid. Pull requests får automatisk deres eget preview-link.

## Domænet oxen6840.dk
Siden er sat op til at bo på `https://oxen6840.dk` (canonical-link og delingsbillede peger dertil).

1. **Køb domænet** hos en dansk registrar (fx Simply, One.com eller Dandomain). Cloudflare kan ikke selv sælge .dk-domæner.
2. **Tilføj domænet i Cloudflare**: dash.cloudflare.com → **Add a domain** → skriv `oxen6840.dk` → vælg **Free**-planen.
3. **Skift navneservere**: Cloudflare viser to navneservere (fx `xxx.ns.cloudflare.com`). Ret navneserverne til dem hos din registrar, eller via selvbetjening på punktum.dk hvis registraren ikke selv tilbyder det. Det tager typisk fra få minutter til et døgn, før Cloudflare melder domænet "Active".
4. **Kobl domænet på siden**: Workers & Pages → dit Pages-projekt → **Custom domains** → **Set up a custom domain** → `oxen6840.dk`. Cloudflare laver selv DNS-posten og HTTPS-certifikatet.
5. **www (valgfrit)**: gentag punkt 4 med `www.oxen6840.dk`, så begge adresser virker.

Bruger du et andet domæne, så ret `oxen6840.dk` i toppen af `index.html` (canonical og og:-felterne).

## Åbningstider
Åbningstiderne står ét sted nederst i `index.html` under `ÅBNINGSTIDER: ret kun her`. Siden viser selv de næste 7 dage med dato, fremhæver i dag og viser "Åbent nu" eller "Lukket" efter dansk tid.

- Almindelig uge: `AABNINGSTIDER`, fx `5: ["14:00", "02:00"]` for fredag 14 til 02, eller `1: "lukket"`.
- Helligdage og events: `SAERLIGE_DAGE`, fx `"2026-12-24": { tid: "lukket", note: "Juleaften" }`.

## Felter der skal udfyldes
Gule felter med stiplet kant på siden mangler info. Søg efter `class="todo"` i `index.html`:
- Link til Facebook-gruppen
