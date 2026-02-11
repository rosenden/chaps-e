# Chaps-e Generator by ChapsVision

Application web statique (GitHub Pages) pour assembler les pieces SVG de `assets/` et generer une mascotte robot "Chaps-e" exportable en SVG / PNG / JPG.

## Fonctionnalites

- Generator (skin Light/Dark, bras gauche/droit, yeux, tete, shadow)
- Presets (boutons avec emoji = emotion)
- Export: SVG, PNG, JPG
- Bibliotheque cloud (Supabase): sauvegarde/lecture/suppression des Chap-e
- Guide d'usage (do/don't)
- Admin:
  - creation d'utilisateurs (Edge Function `admin-create-user`)
  - stats globales (Edge Function `admin-stats`)

## Stack

- Front: `index.html` + `onechaps.css` + `app.js` (pas de build)
- Deploiement: GitHub Pages via `.github/workflows/deploy-pages.yml`
- Back: Supabase
  - Auth email/password (Supabase Auth)
  - DB Postgres + RLS
  - Edge Functions (admin-only)

## Lancer en local

L'app etant statique, tu peux la servir avec n'importe quel serveur HTTP.

Exemples:

```bash
python3 -m http.server 5173
```

Puis ouvrir `http://localhost:5173`.

## Configuration Supabase (obligatoire pour login + bibliotheque + admin)

### 1) Creer les tables + policies RLS

Dans Supabase Dashboard -> SQL Editor, executer:

- `supabase/0001_init.sql`

Cela cree:
- `public.users` (profil: `user_id`, `email`, `nom`, `prenom`, `role`)
- `public.chapse` (bibliotheque)
- `public.export_events` (tracking exports PNG/JPG)

Note:
- On ne stocke pas le mot de passe dans `public.users` (c'est gere par Supabase Auth, hashed).

### 2) Creer l'admin dans Supabase Auth

Dans Supabase Dashboard -> Auth -> Users:

- Email: `mparrino@chapsvision.com`
- Mot de passe: `admin`

Le role `admin` est applique automatiquement via un trigger SQL (voir `supabase/0001_init.sql`).

### 3) Configurer le front (URL + anon key)

Modifier `config.js`:

```js
window.CHAPSE_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_KEY",
};
```

L'`anon key` est publique (cote navigateur). Les acces a la DB sont securises par RLS.

### 4) Deployer les Edge Functions (admin)

Deux fonctions doivent etre deployees sur Supabase:

- `supabase/functions/admin-create-user`
- `supabase/functions/admin-stats`

Et ajouter le secret suivant dans Supabase -> Edge Functions -> Secrets:

- `SUPABASE_SERVICE_ROLE_KEY` (ne jamais le mettre dans le front)

## Deploiement GitHub Pages

Le workflow `Deploy GitHub Pages` se declenche sur `push` vers `main`.

Important:
- GitHub Pages ne deploie que le front.
- Les tables, policies RLS et Edge Functions doivent etre deployees/configurees dans Supabase.

Si vous voulez rester dans ce repo sans sous-dossier, creez directement les fichiers Vite a la racine et gardez `assets/` tel quel.
