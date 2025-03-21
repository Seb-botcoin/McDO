
// Déclaration des variables globales pour stocker les données JSON et les catégories fixes
let donnees = []; // Contiendra les produits chargés depuis le fichier JSON
let categoriesFixes = ["burgers", "sides", "drinks", "desserts", "menus", "happyMeal"]; // Liste explicite des catégories
let commande = []; // Chaque élément sera { id, name, quantity, unitPrice }

// Fonction pour charger les données depuis un fichier JSON
function chargerDonnees() {
  fetch('mcdo.json') // Charger le fichier JSON
      .then(function (reponse) {
          return reponse.json(); // Convertir la réponse en objet JSON
      })
      .then(function (data) {
          donnees = transformerDonneesEnTableau(data); // Transformer les données en tableau indexé basé sur les catégories fixes
          afficherCategories(); // Appeler la fonction pour afficher les catégories
      })
      .catch(function (erreur) {
          console.error("Erreur lors du chargement des données JSON :", erreur); // Gérer les erreurs
      });
}

// Fonction pour transformer les données en tableau indexé
function transformerDonneesEnTableau(elements) {
  let tableau = []; // Tableau pour stocker les données transformées
  let index = 0;

  while (index < categoriesFixes.length) {
    let categorie = categoriesFixes[index]; // Récupérer chaque catégorie fixe
    if (elements[categorie]) { // Vérifier si la catégorie existe dans les données
      tableau.push({
        categorie: categorie, // Ajouter le nom de la catégorie
        produits: elements[categorie] // Ajouter les produits associés
      });
    }
    index++;
  }

  return tableau; // Retourner le tableau indexé
}

// Fonction principale pour afficher les catégories
function afficherCategories() {
  let categoriesTableau = donnees; // Utiliser le tableau transformé dans la variable globale
  let conteneurCategories = document.getElementById('categories');
  conteneurCategories.innerHTML = ''; // Nettoyer le conteneur

  // Créer une rangée avec les catégories et l'ajouter au conteneur
  let ligne = creerRangee(categoriesTableau);
  conteneurCategories.appendChild(ligne);
}

// Fonction pour créer une rangée contenant les colonnes des catégories
function creerRangee(categoriesTableau) {
  let ligne = document.createElement('div');
  ligne.className = 'row'; // Classe Bootstrap pour mise en page

  let index = 0;
  while (index < categoriesTableau.length) {
    let colonne = creerColonne(categoriesTableau[index].categorie, categoriesTableau[index].produits);
    ligne.appendChild(colonne); // Ajouter chaque colonne à la rangée
    index++;
  }

  return ligne;
}

// Fonction pour créer une colonne pour une catégorie
function creerColonne(nomCategorie, produits) {
  let colonne = document.createElement('div');
  colonne.className = 'col-md-4 text-center mb-4'; // Classes Bootstrap

  // Contenu HTML de la colonne
  colonne.innerHTML =
    '<div class="category-card">' +
      '<a href="#" class="d-block text-decoration-none text-dark" data-category="' + nomCategorie + '">' +
        '<img src="/assets/' + produits[0].image + '" alt="' + nomCategorie + '" class="img-fluid mb-2" style="height: 150px; width: auto;">' +
        '<h5 class="m-0">' + nomCategorie + '</h5>' +
      '</a>' +
    '</div>';

  // Ajouter un gestionnaire d'événement pour afficher les produits de cette catégorie
  let lien = colonne.querySelector('a');
  lien.addEventListener('click', function (event) {
    event.preventDefault();
    afficherProduitsDansModale(nomCategorie, produits); // Appeler la fonction pour afficher les produits
  });

  return colonne;
}

// Appel de la fonction pour charger les données au démarrage du script
chargerDonnees();


function afficherProduitsDansModale(categorie, items) {
  mettreAJourTitreDeLaModale(categorie);

  let modalBody = document.querySelector('.modal-body');

  modalBody.innerHTML = ''; // Vide le contenu précédent
  let row = document.createElement('div'); // Crée une rangée
  row.className = 'row gy-5'; // Ajout d'espace entre les rangées

  items.forEach((item) => {
    let commandeItem = initialiserCommandePourProduit(item); // Initialise ou récupère l'article dans commande
    let col = creerCarteProduit(item, commandeItem); // Crée une carte produit avec les boutons et événements
    row.appendChild(col); // Ajout de la colonne à la rangée
  });

  modalBody.appendChild(row); // Ajout de la rangée au corps de la modale
  afficherEtConfigurerModale(); // Affiche la modale avec configuration supplémentaire
}

function mettreAJourTitreDeLaModale(categorie) {
  let modalTitle = document.getElementById('produitsModalLabel');

  modalTitle.textContent = 'Produits - ' + categorie;
}

function initialiserCommandePourProduit(item) {
  let commandeItem = commande.find(cmdItem => cmdItem.id === item.id);
  if (!commandeItem) {
    commande.push({
      id: item.id,
      name: item.name,
      quantity: 0,
      unitPrice: item.price
    });
    commandeItem = commande[commande.length - 1];
  }
  return commandeItem;
}

function creerCarteProduit(item, commandeItem) {
  let col = document.createElement('div');
  col.className = 'col-md-4';

  col.innerHTML = `
    <div class="card" style="border-radius: 10px; height: 350px;">
      <img src="/assets/${item.image}" class="card-img-top produit-image" alt="${item.name}" 
        style="height: 200px; object-fit: cover; cursor: pointer;">
      <div class="card-body text-center">
        <h5 class="card-title">${item.name}</h5>
      </div>
      <div class="card-footer d-flex justify-content-between align-items-center">
        <button class="btn btn-outline-secondary btn-minus" data-id="${item.id}" ${commandeItem.quantity === 0 ? 'disabled' : ''}>-</button>
        <span class="quantity" data-id="${item.id}">${commandeItem.quantity}</span>
        <button class="btn btn-outline-primary btn-plus" data-id="${item.id}">+</button>
      </div>
    </div>
  `;

  // Ajout des événements
  const btnMinus = col.querySelector(`.btn-minus[data-id="${item.id}"]`);
  const btnPlus = col.querySelector(`.btn-plus[data-id="${item.id}"]`);
  const quantityDisplay = col.querySelector(`.quantity[data-id="${item.id}"]`);
  const imageElement = col.querySelector('.produit-image');

  imageElement.addEventListener('click', () => afficherDetailsProduit(item)); // Affiche les détails du produit

  attacherEvenementsAuxBoutons(btnMinus, btnPlus, quantityDisplay, commandeItem); // Gère les événements sur les boutons

  return col;
}

function attacherEvenementsAuxBoutons(btnMinus, btnPlus, quantityDisplay, commandeItem) {
  // Gérer le clic sur le bouton "moins"
  btnMinus.addEventListener('click', () => {
    if (commandeItem.quantity > 0) {
      commandeItem.quantity--;
      quantityDisplay.textContent = commandeItem.quantity;

      // Désactiver le bouton "moins" si la quantité atteint 0
      if (commandeItem.quantity === 0) {
        btnMinus.disabled = true;
      }

      // Mettre à jour les totaux
      mettreAJourTotalArticles();
      mettreAJourTotalValeurCommande();
    }
  });

  // Gérer le clic sur le bouton "plus"
  btnPlus.addEventListener('click', () => {
    commandeItem.quantity++;
    quantityDisplay.textContent = commandeItem.quantity;

    // Activer le bouton "moins" si la quantité dépasse 0
    if (commandeItem.quantity > 0) {
      btnMinus.disabled = false;
    }

    // Mettre à jour les totaux
    mettreAJourTotalArticles();
    mettreAJourTotalValeurCommande();
  });
}

function afficherEtConfigurerModale() {
  let modalElement = document.getElementById('produitsModal');
  if (modalElement) {
    modalElement.querySelector('.modal-content').classList.add('blur-self');

    let modal = new bootstrap.Modal(modalElement);
    modal.show();

    modalElement.addEventListener('hidden.bs.modal', () => {
      modalElement.querySelector('.modal-content').classList.remove('blur-self');
    });
  }
}


// Fonction pour afficher les détails d'un produit dans une modale centrée
function afficherDetailsProduit(item) {
  let detailsModalElement = document.getElementById('produitDetailsModal');
  if (!detailsModalElement) {
    console.error("L'élément 'produitDetailsModal' est introuvable.");
    return;
  }

  // Flouter la modale des produits
  let produitsModal = document.getElementById('produitsModal');
  if (produitsModal) {
    produitsModal.querySelector('.modal-content').classList.add('blur-background');
  }

  // Récupère les éléments de la modale de détails
  const produitImage = document.getElementById('produitDetailsImage');
  const produitName = document.getElementById('produitDetailsName');
  const produitDescription = document.getElementById('produitDetailsDescription');
  const produitPrix = document.getElementById('produitDetailsPrix');
  const produitCalories = document.getElementById('produitDetailsCalories');

  if (!produitImage || !produitName || !produitDescription || !produitPrix || !produitCalories) {
    console.error("Certains éléments de la modale des détails sont introuvables.");
    return;
  }

  // Remplir les infos
  produitImage.src = `/assets/${item.image}`;
  produitImage.alt = item.name;
  produitName.textContent = item.name;
  produitDescription.textContent = item.description || "Description non disponible.";
  produitPrix.textContent = `Prix : ${item.price.toFixed(2)} €`;
  produitCalories.textContent = `Calories : ${item.calories || 'N/A'} kcal`;

  // Afficher la modale
  let detailsModal = new bootstrap.Modal(detailsModalElement);
  detailsModal.show();

  // Supprimer le flou quand on ferme la modale
  detailsModalElement.addEventListener('hidden.bs.modal', function () {
    if (produitsModal) {
      produitsModal.querySelector('.modal-content').classList.remove('blur-background');
    }
  });
}


/*

// Fonction pour afficher le récapitulatif de commande
function afficherRecapitulatifCommande() {
  let listeCommande = document.getElementById('commandeListe');
  let prixTotalElement = document.getElementById('prixTotal');
  
  listeCommande.innerHTML = ''; // Vide la liste
  let prixTotal = 0;

  let index = 0;
  while (index < commande.length) {
    const item = commande[index];

    if (item.quantity > 0) {
      const sousTotal = item.quantity * item.unitPrice;
      prixTotal += sousTotal;

      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.innerHTML = `
        <span class="fw-bold">${item.name}</span>
        <span>${item.quantity} x ${item.unitPrice.toFixed(2)} €</span>
        <span>${sousTotal.toFixed(2)} €</span>
      `;
      listeCommande.appendChild(listItem);
    }
    index++;
  }

  prixTotalElement.textContent = `Prix total : ${prixTotal.toFixed(2)} €`;

  let modal = new bootstrap.Modal(document.getElementById('recapModal'));
  modal.show();
}
*/


function afficherRecapitulatifCommande() {
  let listeCommande = document.getElementById('commandeListe');
  let prixTotalElement = document.getElementById('prixTotal');

  listeCommande.innerHTML = ''; // Vide le contenu précédent
  let prixTotal = 0;

  // Crée un tableau pour afficher la commande
  let tableau = document.createElement('table');
  tableau.className = 'table table-striped';

  // Ajouter l'en-tête du tableau
  tableau.innerHTML = `
    <thead>
      <tr>
        <th style="text-align: left;">Produit</th>
        <th style="text-align: center;">Quantité</th>
        <th style="text-align: right;">Sous-total</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  let tbody = tableau.querySelector('tbody');

  // Parcourt les éléments de la commande
  commande.forEach(item => {
    if (item.quantity > 0) {
      const sousTotal = item.quantity * item.unitPrice;
      prixTotal += sousTotal;

      // Crée une ligne pour chaque produit
      let ligne = document.createElement('tr');
      ligne.innerHTML = `
        <td>${item.name}</td>
        <td class="text-center">
          <button class="btn btn-outline-secondary btn-sm btn-minus" data-id="${item.id}">-</button>
          <span class="mx-2 quantity" data-id="${item.id}">${item.quantity}</span>
          <button class="btn btn-outline-primary btn-sm btn-plus" data-id="${item.id}">+</button>
        </td>
        <td class="text-end">${sousTotal.toFixed(2)} €</td>
      `;

      tbody.appendChild(ligne);

      // Ajouter les gestionnaires d'événements aux boutons
      const btnMinus = ligne.querySelector(`.btn-minus[data-id="${item.id}"]`);
      const btnPlus = ligne.querySelector(`.btn-plus[data-id="${item.id}"]`);
      const quantityDisplay = ligne.querySelector(`.quantity[data-id="${item.id}"]`);

      attacherEvenementsAuxBoutons(btnMinus, btnPlus, quantityDisplay, item);
    }
  });

  listeCommande.appendChild(tableau); // Ajoute le tableau au conteneur

  // Met à jour le prix total
  prixTotalElement.textContent = `Prix total : ${prixTotal.toFixed(2)} €`;

  // Affiche la modale
  let modal = new bootstrap.Modal(document.getElementById('recapModal'));
  modal.show();
}




// Associe le bouton à l'affichage du récapitulatif
document.getElementById('btnRecapCommande').addEventListener('click', afficherRecapitulatifCommande);


///////////////   maj dans le footer /////////////
function mettreAJourTotalArticles() { 
  let totalArticles = 0;
  let index = 0;

  // Parcourt les éléments de la commande pour calculer le total des quantités
  while (index < commande.length) { 
    totalArticles += commande[index].quantity;
    index++;
  }

  // Met à jour le contenu de l'élément avec l'id "order-items"
  let orderItemsElement = document.getElementById('order-items');
  if (orderItemsElement) {
    orderItemsElement.textContent = totalArticles;
  }
}

function mettreAJourTotalValeurCommande() {
  let totalValeur = 0;
  let index = 0;

  // Parcourt les éléments de la commande pour calculer la valeur totale
  while (index < commande.length) {
    totalValeur += commande[index].quantity * commande[index].unitPrice;
    index++;
  }

  // Met à jour le contenu de l'élément avec l'id "order-total"
  let orderTotalElement = document.getElementById('order-total');
  if (orderTotalElement) {
    orderTotalElement.textContent = totalValeur.toFixed(2); // Format à deux décimales
  }
}