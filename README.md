# PriceKit

PriceKit to lekki, mobilny kalkulator zakupowy działający jako statyczna aplikacja webowa i PWA. Nie korzysta z frameworków, bundlera, backendu ani zewnętrznych bibliotek.

## Funkcje

- promocja N + M: cena zakupu, cena efektywna, oszczędność i rabat;
- procent: wartość procentu, cena po obniżce i po podwyżce;
- cena za jednostkę: przeliczanie g/ml ↔ kg/l w obrębie tego samego rodzaju miary;
- polskie przecinki dziesiętne, natychmiastowe przeliczanie i zachowanie wartości przy zmianie zakładki;
- jasny/ciemny motyw zgodny z ustawieniami systemu;
- Service Worker i manifest do działania offline oraz instalacji jako PWA.

## GitHub Pages

1. Umieść zawartość repozytorium w repozytorium GitHub i wypchnij ją do wybranej gałęzi.
2. W ustawieniach repozytorium otwórz **Settings → Pages**.
3. W sekcji **Build and deployment** wybierz **Deploy from a branch**, wskaż gałąź i folder `/ (root)`, a następnie zapisz.
4. Po publikacji otwórz adres w formie `https://USERNAME.github.io/NAZWA-REPOZYTORIUM/`.

Pliki używają ścieżek względnych, więc działają także pod ścieżką repozytorium. Service Worker ogranicza czyszczenie cache do cache'ów zaczynających się od `pricekit-`.

## Instalacja na Androidzie

1. Otwórz opublikowany adres w Chrome na Androidzie.
2. Poczekaj na pierwsze załadowanie aplikacji, aby zasoby zapisały się do cache.
3. Otwórz menu Chrome i wybierz **Dodaj do ekranu głównego** lub **Zainstaluj aplikację**.
4. Potwierdź instalację. Po pierwszej wizycie kalkulator działa również bez połączenia z internetem.

## Testy logiki

Podstawowe przypadki znajdują się w `tests/calculations.test.js` i używają wbudowanego test runnera Node.js. Nie są wymagane do działania aplikacji.

## Struktura

- `index.html` — semantyczny interfejs;
- `styles.css` — responsywny styl mobile-first;
- `js/calculations.js` — czyste funkcje obliczeniowe;
- `js/app.js` — obsługa DOM, zakładek i formatowania;
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA/offline;
- `tests/` — podstawowe testy funkcji obliczeniowych.
