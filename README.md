EventBook

*EventBook* egy eseménykezelő és jegyértékesítő webalkalmazás Laravel és React alapon, 
Docker konténerizálással. Támogatja a különböző felhasználói szerepköröket (Felhasználó, Szervező, Adminisztrátor), események létrehozását, jegyek vásárlását és adminisztratív feladatokat.

---

## Tech stack

- *Backend*: Laravel 10+
- *Frontend*: React (Vite bundler)
- *Konténerizálás*: Docker + Docker Compose
- *UI*: Bootstrap, Animate.css
- *Hitelesítés / Jogosultságkezelés*: Laravel auth

---

## Felhasználói csoportok & Jogosultságok

### Felhasználó
- Publikált események listázása (szűrés: esemény neve, dátum, helyszín, jegyár min / max)
- Esemény részleteinek megtekintése
- Jegyek kosárba helyezése, mennyiség módosítása
- Jegyvásárlás (kapacitás és felhasználói limit ellenőrzése alapján)
- Saját jegyek listázása

### Szervező
- Saját események létrehozása, módosítása
- Saját események listázása (szűrés: esemény neve, dátum (kezdés, létrehozés), helyszín)
- Beállíthatja:
  - Email értesítés vásárlásról
  - Jegy kapacitás
  - Jegylimit / felhasználó
  - Jegyár
  - Rövid és részletes leírás
  - Esemény státusza

### Adminisztrátor
- Összes esemény megtekintése, szerkesztése (státusztól függetlenül)
- Felhasználók listázása (névre vagy "blocked" státuszra szűrés)
- Felhasználók blokkolása / feloldása
- Szűrés eseményekre dátum (kezdés, létrehozás), státusz, szervező, név alapján

---

## Események státuszai

- Vázlat (draft)
- Publikált (published)
- Törölt (cancelled)

---

## Kosár működése

- Jegyek kosárba helyezése → mennyiség módosítható
- Ellenőrzés: kapacitás és felhasználói limit
- Ha a jegymennyiség 0-ra csökken, automatikusan törlődik a kosárból

---

Felhasználók (seed)

Admin - admin@example.com
Organizer - organizer@example.com
User - user@example.com

Jelszavak: Admin1 

## Telepítés (Docker)

### Klónozd a repót

```bash
git clone https://github.com/RoTTeN3013/eventsmgr.git
cd eventbook
```

Adatbázis

cd backend vagy docker exec -it events-mgr-backend-1 bash

```bash
php artisan migrate --seed 
```
vagy php artisan db:seed

Indítás

```bash
docker compose up --back
```

A .env file-ban az APP_DEBUG részt csak fejlesztés alatt hagyd true értékkel (hibakódok megjelnítése kliens oldalon -> devtools).
