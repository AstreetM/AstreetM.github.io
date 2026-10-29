# astreetm.github.io

Le site portfolio d'Astrit Mustafa, data engineer junior à Liège : [astreetm.github.io](https://astreetm.github.io).

Le site est pensé comme un carnet de croquis. Les étapes du pipeline et les projets sont d'abord dessinés au crayon, puis passent à l'encre quand on clique dessus.

## Ce qu'il contient

- **Le pipeline du projet SPW** : le trajet d'un dossier MonEspace dans l'entrepôt, en cinq étapes (sources, bronze, silver, gold, prédiction).
- **Les projets**, chacun en quatre temps (le besoin, ce que j'ai fait, la preuve, ce que ça permet) : la prédiction de l'abandon des démarches, l'entrepôt de données et l'audience web pour le SPW, les rapports Odoo des services de Wavenet et leur mise en production, la ponctualité des trains belges sur Databricks, et les projets publiés sur GitHub.
- **Les compétences, le CV en français et en anglais, et le contact.**

## Technique

- HTML, CSS et JavaScript, sans framework ni étape de compilation.
- Polices hébergées sur le site (Caveat, DM Mono, Figtree, licence SIL OFL dans `assets/fonts/licences`) : aucune requête vers un service tiers.
- Sans JavaScript, tout le contenu reste lisible : les étapes sont déjà encrées et tous les projets sont affichés.
- Les animations s'arrêtent si le système demande moins de mouvement.

```
index.html              la page
404.html                la page d'erreur
assets/css/style.css    les styles
assets/js/main.js       le pipeline, le choix des projets, la copie de l'adresse
assets/cv/              les CV en PDF
assets/fonts/           les polices et leurs licences
assets/img/             l'icône, l'image de partage et les images des projets
```

## Voir le site en local

```bash
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Mettre à jour

- **Un texte** : modifier `index.html`.
- **Un CV** : remplacer le PDF dans `assets/cv/` en gardant le même nom de fichier.
- **La mise en ligne** : chaque push sur la branche `main` republie le site avec GitHub Pages.
