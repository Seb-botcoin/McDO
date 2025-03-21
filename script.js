
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


// Fonction pour afficher les produits dans la modale
function afficherProduitsDansModale(categorie, items) {
  let modalTitle = document.getElementById('produitsModalLabel');



  if (!modalTitle) {
    console.error("L'élément 'produitsModalLabel' est introuvable.");
    return;
  }
  modalTitle.textContent = 'Produits - ' + categorie;

  let modalBody = document.querySelector('.modal-body');
  if (!modalBody) {
    console.error("L'élément 'modal-body' est introuvable.");
    return;
  }

  modalBody.innerHTML = ''; // Vide le contenu précédent

  let row = document.createElement('div'); // Crée une rangée
  row.className = 'row gy-5'; // Ajout d'espace entre les rangées

  let index = 0;
  while (index < items.length) {
    let item = items[index];
    let productId = item.id;

    // Initialise la commande pour ce produit si elle n'existe pas encore
    let existeDeja = false;
    let i = 0;
    
    // Parcourt la commande pour vérifier si le produit existe déjà
    while (i < commande.length) {
      if (commande[i].id === productId) {
        existeDeja = true;
        break;
      }
      i++;
    }
    
    // Si le produit n'existe pas, on l'ajoute
    if (!existeDeja) {
      commande.push({
        id: productId,
        name: item.name,
        quantity: 0,
        unitPrice: item.price
      });
    }

    let col = document.createElement('div'); // Colonne pour chaque carte
    col.className = 'col-md-4';

    col.innerHTML = `
      <div class="card" style="border-radius: 10px; height: 350px;">
        <img src="/assets/${item.image}" class="card-img-top produit-image" alt="${item.name}" 
          style="height: 200px; object-fit: cover; cursor: pointer;">
        <div class="card-body text-center">
          <h5 class="card-title">${item.name}</h5>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <button class="btn btn-outline-secondary btn-minus" data-id="${productId}" disabled>-</button>
          <span class="quantity" data-id="${productId}">0</span>
          <button class="btn btn-outline-primary btn-plus" data-id="${productId}">+</button>
        </div>
      </div>
    `;

    // Ajout des événements
    const btnMinus = col.querySelector(`.btn-minus[data-id="${productId}"]`);
    const btnPlus = col.querySelector(`.btn-plus[data-id="${productId}"]`);
    const quantityDisplay = col.querySelector(`.quantity[data-id="${productId}"]`);
    const imageElement = col.querySelector('.produit-image');


    imageElement.addEventListener('click', function () {
      afficherDetailsProduit(item); // Affiche les détails du produit dans une nouvelle modale
    });

    // Gérer le clic sur le bouton "moins"
    btnMinus.addEventListener('click', function () {
      let commandeItem = commande.find(item => item.id === productId);
      if (commandeItem.quantity > 0) {
        commandeItem.quantity--;
        quantityDisplay.textContent = commandeItem.quantity;

        // Désactive le bouton "moins" si la quantité atteint 0
        if (commandeItem.quantity === 0) {
          btnMinus.disabled = true;
        }
        // Mettre à jour le total des articles dans le footer
        mettreAJourTotalArticles();
        mettreAJourTotalValeurCommande(); // Met à jour la valeur totale
      }
    });

    // Gérer le clic sur le bouton "plus"
    btnPlus.addEventListener('click', function () {
      let commandeItem = commande.find(item => item.id === productId);

      // Ajouter le produit si non présent
      if (!commandeItem) {
        commande.push({
          id: productId,
          name: item.name,
          quantity: 1,
          unitPrice: item.price
        });
      } else {
        commandeItem.quantity++;
      }

      quantityDisplay.textContent = commande.find(item => item.id === productId).quantity;

      // Activer le bouton "moins" si la quantité dépasse 0
      if (commande.find(item => item.id === productId).quantity > 0) {
        btnMinus.disabled = false;
      }
        // Mettre à jour le total des articles dans le footer
      mettreAJourTotalArticles();
      mettreAJourTotalValeurCommande(); // Met à jour la valeur totale
    });

    row.appendChild(col); // Ajout de la colonne à la rangée
    index++;
  }


  modalBody.appendChild(row); // Ajout de la rangée au corps de la modale

  let modalElement = document.getElementById('produitsModal');
  if (modalElement) {
    let modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// Fonction pour afficher les détails d'un produit dans une modale centrée
function afficherDetailsProduit(item) {
  // Vérifie que la modale existe
  let detailsModalElement = document.getElementById('produitDetailsModal');
  if (!detailsModalElement) {
    console.error("L'élément 'produitDetailsModal' est introuvable.");
    return;
  }

  // Récupère les éléments à l'intérieur de la modale
  const produitImage = document.getElementById('produitDetailsImage');
  const produitName = document.getElementById('produitDetailsName');
  const produitDescription = document.getElementById('produitDetailsDescription');
  const produitPrix = document.getElementById('produitDetailsPrix');
  const produitCalories = document.getElementById('produitDetailsCalories');

  // Vérifie que tous les éléments requis sont présents
  if (!produitImage || !produitName || !produitDescription || !produitPrix || !produitCalories) {
    console.error("Certains éléments de la modale des détails sont introuvables.");
    return;
  }

  // Met à jour les éléments de la modale avec les données du produit
  produitImage.src = `/assets/${item.image}`;
  produitImage.alt = item.name;
  produitName.textContent = item.name;
  produitDescription.textContent = item.description || "Description non disponible.";
  produitPrix.textContent = `Prix : ${item.price.toFixed(2)} €`;
  produitCalories.textContent = `Calories : ${item.calories || 'N/A'} kcal`;

  // Affiche la modale avec Bootstrap
  let detailsModal = new bootstrap.Modal(detailsModalElement);
  detailsModal.show();
}



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

// Associe le bouton à l'affichage du récapitulatif
document.getElementById('btnRecapCommande').addEventListener('click', afficherRecapitulatifCommande);


///////////////   maj dans le footer /////////////
function mettreAJourTotalArticles() { 
  let totalArticles = 0;
  let cmd = 0;

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