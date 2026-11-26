# Kügelibahn Winti

A static website using HTML, CSS and JavaScript. No framework, package installation or build step is required.

## Files

- `index.html` — project overview
- `petition.html` — petition demo
- `spenden.html` — donation demo
- `transparenz.html` — project status, budget and FAQ
- `styles.css` — shared styling, including responsive layouts
- `script.js` — mobile menu, demo forms, local storage and sharing
- `bilder/` and `videoplayback.mp4` — existing media

Each HTML page is a complete document. The header, sharing section and footer are repeated deliberately so the site works on any static host without templates or JavaScript-rendered content. When editing these shared sections, update all four pages.

Navigation uses ordinary page links. The original native “Mehr zum Projektstand” button uses JavaScript to navigate while retaining its browser appearance. Previously shared hash links (`/#petition`, `/#spenden`, `/#transparenz`) redirect to the corresponding page.

## Local preview

Run this command in the project directory:

```sh
python3 -m http.server 4173
```

Open <http://localhost:4173>. All files can be deployed directly to a static host.

## Demo behavior

Petition signatures and donation totals are simulated and stored only in the browser under the existing `kuegelibahn-winti-demo-v1` key. No signatures or payments are transmitted. Sharing opens WhatsApp or an email draft; copying a link uses the clipboard when available.

## Checking changes

Compare all four pages at desktop, tablet and phone widths. Include the open mobile menu, donation amounts, petition confirmation and expanded FAQ items. For screenshot comparisons, freeze animation and video at the same point on both versions.

The refactor preserves the existing design and includes the newer Stefan Ott portrait copy from GitHub. That approved copy update is the intentional difference from the live site at the time of the refactor.
