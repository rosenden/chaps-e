# Generateur de mascotte robot (web app)

Ce README decrit une implementation complete pour creer une app web qui assemble les SVG du dossier `assets/` en une mascotte robot configurable.

## 1. Objectif

L'app doit permettre de choisir:
- le bras gauche
- le bras droit
- les yeux
- l'inclinaison de la tete (`head`)
- l'ombre au sol active/inactive (`shadow`)

Et elle doit pouvoir reproduire au moins les robots de reference:
- `assets/example/1.svg`
- `assets/example/2.svg`

## 2. Ce qui existe deja

Assets disponibles:
- `assets/left_arm/variant=*.svg` (8 variantes)
- `assets/arm_right/variant=*.svg` (8 variantes)
- `assets/eyes/expression=*.svg` (7 expressions)
- `assets/head/inclination=default.svg`
- `assets/head/inclination=tilted.svg`
- `assets/torso/torso_upper.svg`
- `assets/torso/torso_lower.svg`
- `assets/example/1.svg`
- `assets/example/2.svg`

Canvas final de reference: `88 x 101`.

## 3. Architecture recommandee

Stack simple:
- Vite
- TypeScript
- rendu SVG (pas canvas)

Pourquoi:
- les pieces sont deja en SVG
- export final en SVG facile
- comparaison pixel/reference facile

## 4. Structure de projet conseillee

```txt
.
|- assets/
|- src/
|  |- main.ts
|  |- robot/
|  |  |- assetLoader.ts
|  |  |- robotConfig.ts
|  |  |- robotRenderer.ts
|  |  `- presets.ts
|  `- ui/
|     `- controls.ts
|- index.html
`- README.md
```

## 5. Modele de donnees

```ts
export type RobotConfig = {
  leftArm: string;      // ex: "rest_open_down_side"
  rightArm: string;     // ex: "hold_grip_down_in"
  eyes: string;         // ex: "default" | "love" | ...
  head: "default" | "tilted";
  shadowEnabled: boolean; // true = ombre visible
};
```

Les noms de variantes doivent etre derives automatiquement depuis les noms de fichiers:
- `variant=xxx.svg` pour les bras
- `expression=xxx.svg` pour les yeux
- `inclination=xxx.svg` pour la tete

## 6. Regles de composition

Les valeurs suivantes sont extraites des deux fichiers de reference `assets/example/1.svg` et `assets/example/2.svg` (pas des estimations).

Ordre des calques (important):
1. `torso_lower`
2. `torso_upper`
3. `left_arm`
4. `right_arm`
5. `head`
6. `eyes` (si expression != `default`)
7. ombre au sol

Constantes de scene:

```ts
export const SCENE = { width: 88, height: 101 };
```

Placement de base (calibre sur les examples):

```ts
export const BASE_POS = {
  torsoUpper: { x: 28.5246, y: 42.0354 },
  torsoLower: { x: 33.5312, y: 71.2239 },
  headDefault: { x: 14.0398, y: 0 },
  // tete tilted: centre horizontal sur 88px
  headTilted: { x: (88 - 63) / 2, y: 0 },
  shadow: { cx: 44, cy: 97.1197, rx: 13.803, ry: 3.00065, opacity: 0.2 },
};
```

Placement des bras (exact pour les presets des examples):

```ts
export const ARM_OFFSETS_EXACT = {
  left: {
    rest_open_down_side: { x: 0, y: 46.7990 },     // example 1
    rest_open_down_in: { x: 0, y: 46.4623 },       // example 2
  },
  right: {
    rest_open_down_side: { x: 48.0000, y: 46.8500 },  // example 1
    hold_grip_down_in: { x: 22.1781, y: 46.8426 },    // example 2
  },
  fallback: {
    left: { x: 0, y: 46.8426 },
    right: { x: 48, y: 46.8426 },
  },
} as const;
```

Note: pour `arm_right/variant=hold_grip_down_in.svg`, `x = 22.1781` est la valeur qui matche l'exemple; `88 - 66 = 22` ne suffit pas pour une reproduction exacte.

Placement des yeux:
- si `eyes === "default"`: ne pas superposer d'asset yeux (la tete contient deja les yeux par defaut)
- sinon: superposer l'asset yeux

Placement de l'ombre:
- si `shadowEnabled === true`: afficher l'ellipse d'ombre (`BASE_POS.shadow`)
- si `shadowEnabled === false`: ne rien rendre pour l'ombre
- valeur par defaut conseillee: `true` (pour correspondre aux examples)

Zone des yeux `default` (translation simple):

```ts
export const EYES_ZONE_DEFAULT = {
  x: 28.6556,
  y: 16.5398,
};
```

Cas exact qui matche `example/2.svg` avec `eyes=love`:

```ts
export const EYES_TRANSFORM = {
  default: { type: "none" }, // deja dessine dans la tete
  love: {
    // x' = s*x + tx, y' = s*y + ty
    s: 0.9245404,
    tx: 28.0284,
    ty: 16.7158,
  },
  fallback: {
    // pour stars / happy / wink / error / loading:
    // commencer par une translation simple puis ajuster finement
    tx: 28.6556,
    ty: 16.5398,
    s: 1,
  },
} as const;
```

Pour les autres expressions, commencer avec une translation simple (zone par defaut), puis ajuster si besoin pour votre direction artistique.

## 7. Presets obligatoires

Preset pour `assets/example/1.svg`:

```ts
export const PRESET_EXAMPLE_1 = {
  leftArm: "rest_open_down_side",
  rightArm: "rest_open_down_side",
  eyes: "default",
  head: "default",
  shadowEnabled: true,
} as const;
```

Preset pour `assets/example/2.svg`:

```ts
export const PRESET_EXAMPLE_2 = {
  leftArm: "rest_open_down_in",
  rightArm: "hold_grip_down_in",
  eyes: "love",
  head: "default",
  shadowEnabled: true,
} as const;
```

## 8. Strategie de rendu

1. Charger chaque fichier SVG en texte (`fetch`).
2. Extraire:
- `width`, `height`, `viewBox`
- `innerHTML` (contenu interne du `<svg>`)
3. Assembler un seul SVG final `88x101` avec des `<g transform="translate(...)" ...>`.
4. Appliquer les offsets de bras depuis `ARM_OFFSETS_EXACT` (ou fallback).
5. Appliquer la transformation des yeux via `EYES_TRANSFORM` (`love` = scale + translate).
6. Rendre l'ombre uniquement si `config.shadowEnabled` est active.
7. Mettre a jour le SVG final a chaque changement de controle.
8. Ajouter un bouton d'export (`download`) du SVG final.

## 9. UI minimale

Controles obligatoires:
- select `leftArm`
- select `rightArm`
- select `eyes`
- select `head`
- checkbox `shadowEnabled` (Afficher l'ombre)
- boutons preset (`example 1`, `example 2`)
- bouton `Exporter SVG`

## 10. Verification (Definition of Done)

La fonctionnalite est validee si:
1. l'utilisateur peut choisir bras gauche, bras droit, yeux, tete inclinee/non inclinee
2. l'utilisateur peut activer/desactiver l'ombre au sol
3. le preset `example 1` reproduit visuellement `assets/example/1.svg`
4. le preset `example 2` reproduit visuellement `assets/example/2.svg`
5. l'export SVG produit le robot visible a l'ecran

## 11. Commandes de demarrage (Vite)

```bash
pnpm create vite robot-web --template vanilla-ts
cd robot-web
pnpm install
cp -R ../assets ./public/assets
pnpm dev
```

Si vous voulez rester dans ce repo sans sous-dossier, creez directement les fichiers Vite a la racine et gardez `assets/` tel quel.
