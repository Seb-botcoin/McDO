# McDO
---------------Charger donnees ------------------------

1. Intention derrière le bloc de code
La fonction chargerDonnees a pour but principal de récupérer les données des produits à partir d’un fichier JSON (mcdo.json) et de les préparer pour l’affichage sur la borne. Elle initialise les données nécessaires à l'interface utilisateur.

2. Choix technique des propriétés utilisées
fetch : Cette méthode est choisie pour récupérer les données de manière asynchrone, ce qui permet à l’application de ne pas geler pendant le chargement des données.

.then() : Permet de chaîner les opérations, assurant une manipulation structurée des promesses.

.catch() : Gère les erreurs de récupération des données, crucial pour une application robuste et fiable.

3. Utilité et signification des variables
donnees : Variable globale qui stocke les données transformées, utile pour être réutilisée dans d'autres parties de l'application.

data : Représente les données brutes en JSON avant leur transformation. Son rôle est temporaire mais essentiel pour alimenter la variable donnees.

4. Fonctionnement technique
La fonction fetch envoie une requête HTTP pour récupérer le fichier mcdo.json.

Si la réponse est obtenue avec succès, elle est convertie en objet JSON grâce à .json().

Le tableau JSON est ensuite transformé à l’aide de la fonction transformerDonneesEnTableau, qui trie les produits selon les catégories définies (comme "burgers" ou "menus").

Enfin, la fonction afficherCategories est appelée pour générer dynamiquement l'affichage des catégories à l’écran.

En cas d’erreur (fichier manquant, problème réseau, etc.), un message d'erreur est enregistré dans la console grâce à .catch().


------------------transformerDonneesEnTableau------------------------

1. Intention derrière le bloc de code
La fonction transformerDonneesEnTableau a pour objectif de structurer les données brutes provenant du fichier JSON en un tableau organisé basé sur les catégories prédéfinies. Cela simplifie leur traitement ultérieur et garantit que seules les catégories nécessaires sont utilisées.

2. Choix technique des propriétés utilisées
while : Une boucle est utilisée ici pour parcourir les catégories fixées (liste categoriesFixes), car ce parcours est itératif et ordonné.

if (elements[categorie]) : Cette condition vérifie que la catégorie existe réellement dans les données JSON. Cela évite d’ajouter des catégories vides ou inexistantes, assurant ainsi la robustesse.

push : Méthode utilisée pour ajouter chaque catégorie valide et ses produits associés au tableau final.

3. Utilité et signification des variables
categoriesFixes : Liste explicite des catégories disponibles dans le fast-food (burgers, sides, menus, etc.). Elle agit comme un filtre pour structurer les données efficacement.

elements : Représente les données JSON brutes et sert de source pour vérifier si des catégories spécifiques existent.

tableau : La variable qui contient le tableau final, structuré et organisé par catégories, prêt à être utilisé dans d'autres parties du code.

4. Fonctionnement technique
La fonction initialise un tableau vide (tableau).

Elle boucle à travers la liste des catégories fixes (categoriesFixes).

Pour chaque catégorie, elle vérifie si elle existe dans les données JSON via la condition if.

Si la catégorie est trouvée, elle est ajoutée dans le tableau avec son nom et la liste de produits correspondante.

Enfin, le tableau structuré est retourné.

passe de 

{
  "burgers": [{ "id": 1, "name": "Cheeseburger" }],
  "drinks": [{ "id": 2, "name": "Coca-Cola" }]
}

à

[
  { categorie: "burgers", produits: [{ id: 1, name: "Cheeseburger" }] },
  { categorie: "drinks", produits: [{ id: 2, name: "Coca-Cola" }] }
]



---------------------creerRangee-------------------------

1. Intention derrière le bloc de code
La fonction creerRangee crée une rangée visuelle (dans le DOM) qui contient les colonnes pour afficher les différentes catégories de produits. Cela permet de structurer l’interface de manière lisible et alignée grâce à Bootstrap.

2. Choix technique des propriétés utilisées
document.createElement : Permet de créer dynamiquement des éléments HTML dans le DOM (ici, une div).

.className = 'row' : Associe une classe Bootstrap pour aligner les colonnes horizontalement.

appendChild : Ajoute chaque colonne à la rangée pour construire progressivement la structure.

3. Utilité et signification des variables
categoriesTableau : Contient les catégories et leurs produits, ce qui permet de générer dynamiquement des colonnes pour chaque catégorie.

ligne : Représente la rangée globale où toutes les colonnes seront ajoutées.

colonne : Variable temporaire pour chaque colonne, associée à une catégorie spécifique.

4. Fonctionnement technique
La fonction crée une div avec la classe Bootstrap row, destinée à contenir les colonnes alignées.

Elle parcourt le tableau des catégories (argument categoriesTableau).

Pour chaque catégorie, une colonne est générée via creerColonne, qui contient un élément visuel interactif représentant la catégorie.

Les colonnes sont ajoutées une par une à la rangée grâce à appendChild.

La rangée complète est retournée pour être utilisée par l’interface.


------------------------creerColonne--------------------

1. Intention derrière le bloc de code
La fonction creerColonne crée un élément visuel interactif pour représenter une catégorie. Elle affiche une image et un nom pour chaque catégorie, permettant à l'utilisateur d'explorer les produits.

2. Choix technique des propriétés utilisées
document.createElement : Utilisé pour créer des div et autres éléments HTML.

.className : Classes Bootstrap telles que col-md-4 sont utilisées pour définir la taille et le positionnement des colonnes.

.innerHTML : Génère le contenu HTML de chaque colonne, incluant une image, un titre, et un lien interactif.

addEventListener : Permet d’ajouter un gestionnaire d’événements au lien pour afficher les produits.

3. Utilité et signification des variables
nomCategorie : Nom de la catégorie affichée (ex. : burgers, sides, etc.).

produits : Liste des produits associés à cette catégorie, utilisée pour extraire l’image et gérer les interactions.

colonne : Représente l’élément HTML final (une div) qui sera ajouté à la rangée.

4. Fonctionnement technique
La fonction initialise une div pour la colonne avec une classe Bootstrap pour le style.

Elle génère dynamiquement le contenu HTML (image, lien, et titre) basé sur les données des produits.

Un événement est ajouté au lien pour afficher les produits de la catégorie dans une modale.

La colonne complète est retournée pour être ajoutée à une rangée.


--------------------afficherProduitsDansModale------------------

1. Intention derrière le bloc de code
Cette fonction vise à afficher tous les produits associés à une catégorie donnée dans une modale. Elle crée dynamiquement une présentation claire et interactive pour que les utilisateurs puissent explorer les détails des produits avant de les sélectionner.

2. Choix technique des propriétés utilisées
document.querySelector : Permet d'accéder rapidement à des éléments spécifiques dans le DOM (comme le corps de la modale).

.innerHTML = '' : Vide le contenu précédent de la modale pour éviter des doublons lors de la mise à jour.

.className = 'row gy-5' : Applique des classes Bootstrap pour une mise en page propre avec un espacement entre les rangées.

forEach : Simplifie l'itération sur les produits pour générer une carte pour chaque produit.

appendChild : Ajoute chaque colonne produit à la rangée principale.

3. Utilité et signification des variables
categorie : Le nom de la catégorie sélectionnée par l'utilisateur, utilisé pour personnaliser l'affichage et les informations.

items : La liste des produits associés à cette catégorie, fournie comme argument pour générer le contenu de la modale.

modalBody : Référence au conteneur de la modale où les cartes des produits seront ajoutées.

commandeItem : Représente l’état individuel d’un produit (quantité commandée, prix unitaire) dans la commande.

4. Fonctionnement technique
La fonction met à jour le titre de la modale pour refléter le nom de la catégorie sélectionnée (via mettreAJourTitreDeLaModale).

Elle vide le contenu précédent du corps de la modale pour préparer un nouvel affichage.

Une nouvelle rangée (div avec classe row) est créée pour organiser les produits visuellement.

Pour chaque produit dans la catégorie, une carte est générée grâce à creerCarteProduit, qui contient l’image, le nom, et les options d’ajustement des quantités.

La rangée complète est ajoutée à la modale, puis affichée grâce à afficherEtConfigurerModale.


--------------mettreAJourTitreDeLaModale---------------------

1. Intention derrière le bloc de code
Cette fonction met à jour dynamiquement le titre de la modale en fonction de la catégorie sélectionnée. Elle améliore l’expérience utilisateur en indiquant clairement quelle catégorie est affichée.

2. Choix technique des propriétés utilisées
textContent : Une propriété simple et efficace pour mettre à jour le texte d’un élément sans inclure de HTML.

3. Utilité et signification des variables
categorie : Le nom de la catégorie affichée, utilisé pour personnaliser le titre.

4. Fonctionnement technique
La fonction sélectionne l’élément correspondant au titre de la modale (produitsModalLabel).

Elle met à jour son contenu pour inclure le nom de la catégorie, par exemple : "Produits - burgers".

Souhaitez-vous que je passe directement à l’analyse du bloc suivant creerCarteProduit, ou préférez-vous approfondir un point spécifique avant ? 😊


---------------creerCarteProduit-----------------------
1. Intention derrière le bloc de code
La fonction creerCarteProduit génère dynamiquement une carte pour chaque produit. Cette carte présente visuellement les informations du produit (image, nom) et permet à l’utilisateur d’ajuster la quantité grâce à des boutons interactifs.

2. Choix technique des propriétés utilisées
document.createElement : Pour créer chaque élément composant la carte (div, img, buttons, etc.).

.innerHTML : Injecte le contenu HTML structuré dans la carte, facilitant l’ajout d'éléments interactifs.

addEventListener : Ajoute des comportements interactifs aux boutons (+, -) et aux images, en liant les actions à des événements utilisateur.

.className : Utilisé pour appliquer des classes CSS, en particulier Bootstrap, pour garantir une mise en page visuellement attrayante.

3. Utilité et signification des variables
item : L'objet représentant un produit spécifique, incluant ses propriétés (nom, prix, image, etc.).

commandeItem : Une référence au produit dans la commande, qui suit les quantités et les détails associés.

col : La carte complète pour un produit, prête à être insérée dans le DOM.

btnMinus, btnPlus : Boutons d’interaction permettant d’ajuster la quantité commandée d’un produit.

quantityDisplay : Élément visuel qui montre le nombre de produits sélectionnés.

4. Fonctionnement technique
La fonction commence par créer une colonne (div) et configure les classes pour une mise en page Bootstrap.

Elle génère une carte HTML contenant :

Une image cliquable qui affiche les détails du produit dans une modale.

Un titre pour le nom du produit.

Deux boutons ("+" et "-") pour ajuster la quantité commandée.

Elle récupère les références aux boutons et au compteur de quantité, puis leur associe des gestionnaires d’événements :

btnMinus : Diminue la quantité et met à jour l’affichage.

btnPlus : Augmente la quantité et met à jour l’affichage.

L'image est rendue interactive via un événement click, qui ouvre une modale de détails produit grâce à afficherDetailsProduit.

La carte est renvoyée sous forme de col, prête à être ajoutée à une rangée.


----------attacherEvenementsAuxBoutons--------------
1. Intention derrière le bloc de code
Cette fonction ajoute les comportements interactifs nécessaires pour les boutons "+" et "-" des produits. Elle gère les mises à jour de la quantité, les sous-totaux, et l’état global de la commande.

2. Choix technique des propriétés utilisées
addEventListener : Attache des fonctions spécifiques aux événements click sur les boutons.

closest : Identifie si le bouton est dans une modale de récapitulatif pour mettre à jour les sous-totaux contextuellement.

.disabled : Active ou désactive le bouton "-" lorsque la quantité est à 0 pour éviter des valeurs négatives.

3. Utilité et signification des variables
btnMinus / btnPlus : Boutons pour réduire ou augmenter la quantité commandée.

quantityDisplay : Indique visuellement la quantité actuelle.

commandeItem : Lien entre le produit et son état dans la commande, permettant une mise à jour en temps réel.

4. Fonctionnement technique
Pour le bouton "-" :

Réduit la quantité dans commandeItem et met à jour l’affichage.

Désactive le bouton lorsque la quantité atteint zéro.

Si l'action se produit dans la modale de récapitulatif, elle met à jour le sous-total associé.

Pour le bouton "+" :

Augmente la quantité dans commandeItem et met à jour l’affichage.

Réactive le bouton "-" si la quantité est passée de 0 à 1.

Met à jour le sous-total dans la modale de récapitulatif si nécessaire.

Les totaux globaux des articles et de la commande sont recalculés après chaque action.


Exemple d'interaction utilisateur
Lorsqu’un utilisateur clique sur "+", la quantité passe de 0 à 1, le bouton "-" est activé, et le compteur est mis à jour.

Si "-1" est cliqué lorsque la quantité est à 1, le bouton "-" se désactive et la quantité reste à 0.


----------------afficherEtConfigurerModale----------------
1. Intention derrière le bloc de code
Ce bloc affiche et configure la modale des produits. Il applique également des effets visuels, comme le floutage temporaire, pour améliorer l'expérience utilisateur.

2. Choix technique des propriétés utilisées
getElementById : Localise la modale des produits (produitsModal) dans le DOM.

classList.add et classList.remove : Ajoutent ou suppriment la classe CSS blur-self pour un effet visuel (par exemple, un léger flou) pendant l'affichage de la modale.

bootstrap.Modal : Permet d'interagir avec la modale à l'aide des fonctionnalités intégrées de Bootstrap (par exemple, afficher ou masquer la modale).

addEventListener('hidden.bs.modal') : Attache un gestionnaire d'événement pour exécuter une action (comme retirer le flou) lorsque la modale est fermée.

3. Utilité et signification des variables
modalElement : Représente l'élément HTML de la modale, sur lequel les actions (comme l'affichage) sont effectuées.

modal : Instance Bootstrap de la modale, utilisée pour afficher la fenêtre via modal.show().

4. Fonctionnement technique
La fonction localise l'élément HTML correspondant à la modale (produitsModal).

Une classe CSS (blur-self) est ajoutée pour appliquer un effet visuel.

Une nouvelle instance de modale Bootstrap est créée et affichée via modal.show().

Un gestionnaire d'événement est attaché à la fermeture de la modale (hidden.bs.modal), supprimant l'effet visuel appliqué précédemment.


-----------------afficherDetailsProduit-----------------
1. Intention derrière le bloc de code
Cette fonction affiche les détails d’un produit spécifique dans une modale dédiée, permettant à l’utilisateur de consulter ses informations avant de l’ajouter au panier.

2. Choix technique des propriétés utilisées
getElementById : Utilisé pour accéder aux éléments nécessaires à la modale des détails (comme l'image, le nom, et le bouton "Ajouter au panier").

.textContent et .src : Mettent à jour dynamiquement le contenu textuel et visuel de la modale.

addEventListener : Ajoute un événement au bouton "Ajouter au panier" pour gérer l’interaction.

3. Utilité et signification des variables
detailsModalElement : Représente l'élément HTML de la modale des détails, dans lequel les informations sur le produit sont affichées.

item : Représente le produit sélectionné, contenant ses propriétés (nom, image, prix, etc.).

4. Fonctionnement technique
La fonction vérifie l'existence de l'élément HTML de la modale des détails (produitDetailsModal).

Elle met à jour les éléments de la modale avec les informations du produit (item) :

L’image est mise à jour avec .src et .alt.

Le nom, la description, le prix et les calories sont affichés via .textContent.

Un bouton "Ajouter au panier" est créé et configuré :

Lorsqu’il est cliqué, il augmente la quantité du produit dans la commande et met à jour les totaux affichés.

La modale est affichée via bootstrap.Modal().show().

Un gestionnaire d’événement rétablit l’arrière-plan lorsque la modale est fermée.

Exemple d'interaction utilisateur
Lorsqu’un utilisateur clique sur un produit "Cheeseburger" :

La modale des produits devient floue.

Les détails du "Cheeseburger" (image, nom, description, prix, calories) sont affichés dans une nouvelle modale.

L’utilisateur peut ajouter le produit au panier via le bouton dédié.



--------------afficherRecapitulatifCommande------------------

1. Intention derrière le bloc de code
Cette fonction affiche une vue récapitulative de la commande, regroupant tous les produits ajoutés au panier avec leurs quantités, sous-totaux, et un prix total global. Elle offre à l’utilisateur une vue d’ensemble avant de finaliser sa commande.

2. Choix technique des propriétés utilisées
getElementById : Accède aux conteneurs spécifiques (commandeListe pour la liste et prixTotal pour le prix total).

.innerHTML = '' : Vide tout contenu précédent dans le conteneur avant de générer un nouveau tableau.

document.createElement : Crée dynamiquement les éléments pour le tableau (comme <table>, <tr>, et <td>).

.className : Applique des classes Bootstrap pour un style de tableau cohérent et moderne (comme table table-striped).

appendChild : Ajoute chaque ligne au tableau final.

.toFixed(2) : Formate les nombres pour afficher deux décimales, ce qui est essentiel pour afficher des prix clairs.

3. Utilité et signification des variables
listeCommande : Élément HTML où la liste récapitulative des produits sera affichée.

prixTotalElement : Élément HTML où le prix total sera affiché.

prixTotal : Variable locale pour calculer la somme totale des sous-totaux.

tableau : Table HTML qui contiendra les informations structurées des produits de la commande.

tbody : Partie du tableau où les lignes de produits sont ajoutées.

4. Fonctionnement technique
Le conteneur commandeListe est sélectionné et vidé de tout contenu précédent.

Un tableau HTML est créé, avec des en-têtes (Produit, Quantité, Sous-total) pour organiser les informations.

La commande est parcourue pour générer une ligne pour chaque produit dont la quantité est supérieure à 0 :

Le nom du produit est ajouté dans une cellule.

La quantité est affichée dans une cellule, accompagnée de boutons "+" et "-".

Le sous-total est calculé (quantité x prix unitaire) et ajouté dans une cellule.

Chaque ligne est ajoutée au tableau, qui est ensuite inséré dans le conteneur listeCommande.

Le prix total est calculé et mis à jour dans l’élément prixTotalElement.

La modale de récapitulatif est affichée grâce à Bootstrap (bootstrap.Modal).



-----------------mettreAJourTotalArticles-----------------

1. Intention derrière le bloc de code
Cette fonction met à jour dynamiquement l’affichage du total d’articles dans la commande, pour informer l’utilisateur en temps réel.

2. Choix technique des propriétés utilisées
.textContent : Met à jour le texte de l’élément HTML pour afficher le total des articles.

while : Utilisé pour parcourir la commande et additionner les quantités.

3. Utilité et signification des variables
totalArticles : Accumule le total des quantités commandées.

orderItemsElement : Élément HTML où le total est affiché.

4. Fonctionnement technique
La commande est parcourue pour additionner toutes les quantités.

Le total obtenu est affiché dans l’élément HTML identifié par order-items.

Bloc : mettreAJourTotalValeurCommande
1. Intention derrière le bloc de code
Mettre à jour le prix total de la commande en temps réel, pour refléter les modifications de quantités.

2. Choix technique des propriétés utilisées
.textContent : Modifie dynamiquement le texte de l’élément order-total avec le prix formaté.

while : Parcourt la commande pour calculer la somme totale des sous-totaux.

3. Utilité et signification des variables
totalValeur : Accumule le prix total de la commande (quantité x prix unitaire).

orderTotalElement : Élément HTML où le prix total est affiché.

4. Fonctionnement technique
La commande est parcourue pour calculer le total (quantité x prix unitaire pour chaque produit).

Ce total est formaté avec deux décimales et affiché dans l’élément order-total.


------------- mettreAJourTotalArticles  et mettreAJourTotalValeurCommande ----------------

mettreAJourTotalArticles : Gère le calcul du nombre total d’articles pour garder une vue dynamique dans l’interface utilisateur.

mettreAJourTotalValeurCommande : Recalcule le montant total des commandes à tout moment pour assurer une cohérence des prix affichés.

Ces blocs maintiennent en permanence une synchronisation entre l’état interne des commandes (commande) et les éléments visuels de l’interface (affichage des totaux dans le footer).

