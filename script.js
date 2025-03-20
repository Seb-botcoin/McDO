let donnees = []; // Contiendra les produits chargés depuis le fichier JSON

// Chargement des données depuis le fichier JSON
fetch('produits.json') // Récupère les données JSON du fichier "produits.json" situé dans le même dossier que le script
  .then(function (reponse) {
    return reponse.json(); // Convertit la réponse brute en objet JavaScript utilisable
    // Plus d'informations sur la méthode fetch : 
    // https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch
  })
  .then(function (data) {
    donnees = data; // Stocke les données dans la variable globale "donnees"
    afficherProduits(donnees); // Appelle la fonction pour afficher les produits dans le tableau
  })
  .catch(function (error) {
    // Affiche un message dans la console si une erreur survient (exemple : fichier introuvable)
    console.error("Erreur lors du chargement du fichier JSON :", error);
    // Documentation sur la gestion des promesses et les erreurs :
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
  });

// Fonction pour afficher les produits dans le tableau
function afficherProduits(produits) {
  // Sélection de l'élément <tbody> du tableau pour y insérer les lignes dynamiquement
  let tableauBody = document.querySelector('table tbody'); 
  tableauBody.innerHTML = ""; // Réinitialise le contenu pour éviter les doublons

  // Parcourt la liste des produits passés en paramètre
  for (let i = 0; i < produits.length; i++) {
    let produit = produits[i]; // Récupère le produit actuel

    // Crée une nouvelle ligne de tableau (<tr>) pour afficher le produit
    let ligne = document.createElement('tr'); 

    // Remplit la ligne avec les colonnes du tableau via innerHTML
    ligne.innerHTML = `
      <td>` + produit.reference + `</td>
      <td>` + produit.categorie + `</td>
      <td>` + produit.libelle + `</td>
      <td>` + produit.prix + ` €</td>
      <td class="text-center">
        <!-- Affiche une pastille colorée (verte/rouge) basée sur le stock -->
        <span class="badge rounded-pill ` + (produit.stock < 20 ? 'bg-danger' : 'bg-success') + `" 
              style="width: 20px; height: 20px; display: inline-block;"></span>
      </td>
      <td>
        <!-- Trois icônes avec des actions spécifiques : Détails, Modifier, Supprimer -->
        <i class="bi bi-eye text-primary me-2" style="cursor: pointer;" onclick="afficherDetail('` + produit.reference + `')"></i>
        <i class="bi bi-pencil-square text-warning me-2" style="cursor: pointer;" onclick="modifierProduit('` + produit.reference + `')"></i>
        <i class="bi bi-trash text-danger" style="cursor: pointer;" onclick="supprimerProduit('` + produit.reference + `')"></i>
      </td>
    `;

    // Ajoute cette ligne au tableau
    tableauBody.appendChild(ligne);
  }
}

// Fonction pour afficher les détails d'un produit dans une modale Bootstrap
function afficherDetail(reference) {
  // Recherche le produit correspondant à la référence dans le tableau global "donnees"
  // Utilisation de Array.prototype.find() :
  // - Objectif : retourner le premier produit du tableau "donnees" dont la propriété "reference" correspond à la valeur du paramètre "reference".
  // - Résultat : un objet produit si trouvé, ou "undefined" si aucun produit ne correspond.
  // Plus d'informations sur Array.find() : 
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  let produit = donnees.find(function (p) {
    // Comparaison entre la référence de l'élément actuel (p.reference)
    // et la valeur fournie au paramètre "reference"
    return p.reference === reference; 
  });
  // Vérifie si un produit correspondant a été trouvé
  if (produit) {
    // Mise à jour dynamique des champs de la modale avec les informations du produit :
    // - Chaque champ dans la modale est identifié par son "id" correspondant.
    // - La valeur ou le contenu de ces champs est mis à jour pour refléter les données du produit sélectionné.
    document.getElementById('articleImage').src = '/images/' + produit.photo; 
    // Définit l'image à afficher. Le dossier "/images/" doit contenir les photos des produits.

    document.getElementById('articleReference').textContent = produit.reference; 
    // Affiche la référence unique du produit, ex. : "PHN001".

    document.getElementById('articleLibelle').textContent = produit.libelle; 
    // Affiche le nom ou la description courte du produit, ex. : "Téléphone iPhone 13".

    document.getElementById('articleDescription').textContent = produit.description; 
    // Affiche la description détaillée du produit.

    document.getElementById('articlePrix').textContent = produit.prix; 
    // Affiche le prix du produit, ex. : "1099.99 €".

    document.getElementById('articleStock').textContent = produit.stock; 
    // Affiche la quantité de stock disponible.

    document.getElementById('articleCategorie').textContent = produit.categorie; 
    // Affiche la catégorie associée au produit, ex. : "Téléphones".

    // Initialisation et affichage de la modale avec Bootstrap :
    // - Utilisation de Bootstrap.Modal pour contrôler l'affichage dynamique.
    // - show() : méthode qui affiche la modale à l'utilisateur.
    // Plus d'informations sur les modales Bootstrap :
    // https://getbootstrap.com/docs/5.3/components/modal/
    let modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show(); 
  } else {
    // Si aucun produit correspondant n'a été trouvé, loggue un message d'erreur dans la console
    console.error("Produit introuvable pour la référence : " + reference);
    // Plus d'informations sur console.error :
    // https://developer.mozilla.org/fr/docs/Web/API/Console/error
  }
}


// Fonction pour ouvrir la modale en mode "Ajouter"
function ajouterProduit() {
  // Réinitialise les champs de la modale
  document.getElementById('productId').value = ''; // Champ caché utilisé pour identifier l'action
  document.getElementById('productReference').value = ''; // Réinitialise le champ Référence
  document.getElementById('productLibelle').value = ''; // Réinitialise le champ Libellé
  document.getElementById('productDescription').value = ''; // Réinitialise le champ Description
  document.getElementById('productPrix').value = ''; // Réinitialise le champ Prix
  document.getElementById('productStock').value = ''; // Réinitialise le champ Stock
  document.getElementById('productCategorie').value = ''; // Réinitialise le champ Catégorie

  // Modifie le titre de la modale
  document.getElementById('productModalLabel').textContent = 'Ajouter un produit';

  // Initialise et affiche la modale Bootstrap
  let productModal = new bootstrap.Modal(document.getElementById('productModal'));
  productModal.show(); 
  // Documentation Bootstrap sur les modales : https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
}

// Fonction pour ouvrir la modale en mode "Modifier"
function modifierProduit(reference) {
  // Recherche le produit correspondant à la référence fournie
  let produit = donnees.find(function (p) {
    return p.reference === reference; 
    // Utilise Array.prototype.find pour localiser le produit à modifier
    // Documentation : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  });

  // Si un produit correspondant est trouvé
  if (produit) {
    // Pré-remplit les champs avec les informations du produit
    document.getElementById('productId').value = produit.reference; // Référence utilisée pour identifier le produit à modifier
    document.getElementById('productReference').value = produit.reference;
    document.getElementById('productLibelle').value = produit.libelle;
    document.getElementById('productDescription').value = produit.description;
    document.getElementById('productPrix').value = produit.prix;
    document.getElementById('productStock').value = produit.stock;
    document.getElementById('productCategorie').value = produit.categorie;

    // Met à jour l'image du produit
    document.getElementById('productImage').src = '/images/' + produit.photo;
    // Modifie le titre de la modale pour indiquer qu'on est en mode "Modification"
    document.getElementById('productModalLabel').textContent = 'Modifier un produit';

    // Affiche la modale Bootstrap
    let productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();

    // Documentation Bootstrap pour afficher une modale : https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
  }
}

// Fonction pour supprimer un produit de la liste et mettre à jour le tableau
function supprimerProduit(reference) {
  // Filtre les produits pour exclure celui correspondant à la référence
  donnees = donnees.filter(function (p) {
    return p.reference !== reference; // Retourne tous les produits sauf celui à supprimer
    // Documentation sur la méthode filter : 
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  });

  // Met à jour le tableau affiché après suppression
  afficherProduits(donnees); 
  // Appelle la fonction pour recharger le tableau avec la liste mise à jour

  // Affiche un message dans la console pour confirmer la suppression
  console.log("Produit avec la référence " + reference + " supprimé.");
  // Plus d'informations sur console.log : 
  // https://developer.mozilla.org/fr/docs/Web/API/Console/log
}

// Gestion de l'événement pour le bouton "Enregistrer" dans la modale
// - Cette partie du code est exécutée lorsqu'on clique sur le bouton "Enregistrer" dans la modale.
// - Elle permet soit d'ajouter un nouveau produit, soit de modifier un produit existant.
document.getElementById('saveProductButton').addEventListener('click', function () {
  // Étape 1 : Récupérer les valeurs des champs du formulaire dans la modale
  // - Chaque champ de la modale est identifié par un "id".
  // - On utilise "document.getElementById()" pour récupérer la valeur saisie par l'utilisateur.

  let id = document.getElementById('productId').value; // Identifiant caché pour savoir si on modifie un produit existant
  let reference = document.getElementById('productReference').value; // Référence unique du produit
  let libelle = document.getElementById('productLibelle').value; // Nom ou libellé du produit
  let description = document.getElementById('productDescription').value; // Description détaillée du produit
  let prix = parseFloat(document.getElementById('productPrix').value); // Prix du produit (converti en nombre décimal)
  let stock = parseInt(document.getElementById('productStock').value); // Stock disponible (converti en entier)
  let categorie = document.getElementById('productCategorie').value; // Catégorie du produit

  // Étape 2 : Vérifier si on modifie un produit existant ou si on en ajoute un nouveau
  // - On utilise la méthode "find()" pour chercher un produit dans le tableau "donnees" qui a la même référence que "id".
  // - Si un produit est trouvé, cela signifie qu'on est en mode "Modification".
  let produit = donnees.find(function (p) {
    return p.reference === id; // Compare la référence du produit avec l'identifiant récupéré
  });

  if (produit) {
    // Si un produit correspondant est trouvé, on met à jour ses propriétés avec les nouvelles valeurs saisies
    produit.reference = reference; // Met à jour la référence
    produit.libelle = libelle; // Met à jour le libellé
    produit.description = description; // Met à jour la description
    produit.prix = prix; // Met à jour le prix
    produit.stock = stock; // Met à jour le stock
    produit.categorie = categorie; // Met à jour la catégorie
  } else {
    // Sinon, si aucun produit n'est trouvé, cela signifie qu'on est en mode "Ajout"
    // - On crée un nouvel objet produit avec les valeurs saisies dans le formulaire
    let nouveauProduit = {
      reference: reference, // Référence unique du nouveau produit
      libelle: libelle, // Libellé du nouveau produit
      description: description, // Description du nouveau produit
      prix: prix, // Prix du nouveau produit
      stock: stock, // Stock initial du nouveau produit
      categorie: categorie, // Catégorie du nouveau produit
      photo: 'airpod.jpg' // Image par défaut pour le nouveau produit
    };

    // On ajoute le nouvel objet produit au tableau global "donnees"
    donnees.push(nouveauProduit); // La méthode "push()" ajoute un élément à la fin du tableau
  }

  // Étape 3 : Mettre à jour l'affichage du tableau HTML
  // - On appelle la fonction "afficherProduits()" pour recharger le tableau avec les données mises à jour
  afficherProduits(donnees);

  // Étape 4 : Fermer la modale Bootstrap
  // - Une fois que l'action (ajout ou modification) est terminée, on ferme la fenêtre modale
  let productModal = bootstrap.Modal.getInstance(document.getElementById('productModal')); // Récupère l'instance de la modale
  if (productModal) {
    productModal.hide(); // Ferme la modale
  }
});


/* 
===========================
 RÉCAPITULATIF DU CODE JS
===========================

1. **Chargement des données JSON :**
   - Utilisation de la fonction `fetch` pour lire les données du fichier `produits.json`.
   - Conversion des données JSON en un objet JavaScript pour être manipulé dans l'application.
   - Gestion des erreurs si le fichier JSON est manquant ou inaccessible.

2. **Affichage dynamique des produits :**
   - La fonction `afficherProduits()` utilise les données pour créer dynamiquement des lignes de tableau HTML.
   - Les données de chaque produit sont insérées dans des colonnes (<td>), y compris des icônes pour "Détails", "Modifier", "Supprimer".

3. **Gestion des actions :**
   - **Afficher Détails :** La fonction `afficherDetail()` ouvre une modale Bootstrap avec les détails d'un produit spécifique.
   - **Modifier :** La fonction `modifierProduit()` préremplit les champs de la modale avec les données du produit existant.
   - **Ajouter :** La fonction `ajouterProduit()` ouvre la modale en mode vide pour ajouter un nouveau produit.
   - **Supprimer :** La fonction `supprimerProduit()` met à jour la liste après suppression d'un produit.

4. **Enregistrement des modifications ou ajout :**
   - Le bouton "Enregistrer" dans la modale gère à la fois les ajouts (nouveau produit) et les modifications (produit existant).
   - Les données mises à jour sont immédiatement reflétées dans l'interface utilisateur.

5. **Bootstrap et interactions utilisateur :**
   - Les modales sont gérées avec `bootstrap.Modal` pour afficher/fermer les fenêtres contextuelles.
   - Les classes Bootstrap (comme `badge`, `text-primary`) et les icônes (Bootstrap Icons) ajoutent des styles visuels et des actions interactives.

Ressources utilisées :
- Fetch API : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API
- Bootstrap Modals : https://getbootstrap.com/docs/5.3/components/modal/
- Bootstrap Icons : https://icons.getbootstrap.com/
- Array Methods (`find`, `filter`, etc.) : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array
*/


/*
===========================
 SYNTHÈSE DU FONCTIONNEMENT
===========================

1. **Principales variables :**
   - `donnees` : Tableau global contenant les produits chargés depuis le fichier JSON. Toutes les opérations (ajout, suppression, modification) modifient directement cette variable.
   - `productModal` : Représente une instance de la modale Bootstrap. Elle est utilisée pour ouvrir ou fermer la modale.

2. **Rôles des fonctions et variables importantes :**
   - `fetch('produits.json')` :
     Chargement initial des données depuis le fichier JSON et stockage dans `donnees`.
   - `afficherProduits(produits)` :
     Génère et insère dynamiquement les lignes du tableau à partir de la liste de produits.
   - `afficherDetail(reference)` :
     Ouvre une modale avec les détails d'un produit spécifique (champ par champ).
   - `ajouterProduit()` :
     Réinitialise les champs et ouvre la modale pour ajouter un nouveau produit.
   - `modifierProduit(reference)` :
     Pré-remplit les champs de la modale avec les données du produit correspondant pour modification.
   - `supprimerProduit(reference)` :
     Supprime un produit du tableau `donnees` en utilisant la méthode `filter`.
   - `document.getElementById('saveProductButton').addEventListener('click', ...)` :
     Gère les événements du bouton "Enregistrer" dans la modale, pour ajouter ou modifier un produit.

3. **Structure Bootstrap utilisée :**
   - Classes utilisées : 
     - `modal`, `fade`, `modal-dialog`, `modal-content` pour la gestion des modales.
     - `badge` pour les indicateurs visuels (rouge/vert pour le stock).
     - `bi-eye`, `bi-pencil-square`, `bi-trash` pour les icônes d'actions interactives.

Conclusion :
L'application repose sur la mise à jour dynamique de `donnees` et sur la synchronisation avec l'interface utilisateur (tableau HTML). Chaque action utilisateur (cliquer sur "Détails", "Modifier", ou "Supprimer") déclenche une fonction qui effectue les changements en temps réel.

*/