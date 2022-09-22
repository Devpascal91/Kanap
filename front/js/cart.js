// récupérer le panier un tableau d'objet.
// objet défini
// Id,quantity et color;faire un parse

// Récupération du localStorage

// Séléction variable pour stocker les articles
let products = [];

// si le localstorage est vide

async function displayCart() {
  const cart = document.getElementById("cart__items");
  const shopCart = localStorage.getItem('cart')
  if (!shopCart) {
    cart.innerHTML = "Votre panier est vide"; 
  }
  let html='';
  const shopArray=JSON.parse(shopCart)

// Si le localstorage contient des produits

let totalPrice = 0 ;
const total = document.getElementById("totalPrice")
let totalQuantity = 0;
const quantity = document.getElementById("totalQuantity")

// Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale

for(i = 0; i < shopArray.length; i++) {
  const product = await getProductById(shopArray[i].id);
  totalPrice+= product.price *shopArray[i].quantity;
  totalQuantity+= shopArray[i].quantity;
  html += `<article class="cart__item" data-id="${product._id}" data-color="${shopArray[i].color}">
  <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="${product.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${product.name}</h2>
      <p>${shopArray[i].color}</p>
      <p>${product.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${shopArray[i].quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`
}
  cart.innerHTML = html;
  total.innerHTML = totalPrice;
  quantity.innerHTML = totalQuantity;
  changeQuantity();
  deleteItem();
}

async function getProductById(productId) {
  return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
      return response.json();
    })
}
displayCart();


// Modification de la quantité
function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");

  quantityInputs.forEach((quantityInput) => {
    console.log(quantityInput)
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      console.log(event.target.closest('article'));
      // const article = event.target.closest('article');
      const dataId = event.target.closest('article').getAttribute("data-id");
      const dataColor = event.target.closest('article').getAttribute("data-color");
      console.log(dataId, dataColor);
      let items = JSON.parse(localStorage.getItem("cart"));
      console.log(items);
      items = items.map((item) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });

      // Mise à jour du localStorage

      let itemsStr = JSON.stringify(items);
      localStorage.setItem("cart", itemsStr);

      // Refresh de la page Panier
      displayCart()
    });
  });
}


// Suppression d'un article

function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.closest('article').getAttribute("data-id");
      const deleteColor = event.target.closest('article').getAttribute("data-color");
      let cart = JSON.parse(localStorage.getItem("cart"));
      cart = cart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );
      console.log(cart);

      // Mise à jour du localStorage

      localStorage.setItem("cart", JSON.stringify(cart));

      // Refresh de la page Panier

      displayCart();
      alert("Article supprimé du panier.");
    });
  });
}

/* LE FORMULAIRE */

// sélection du bouton Valider
const btnValidate = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour pouvoir valider le formulaire
btnValidate.addEventListener("click", (event) => {
event.preventDefault();

const contact = {
  firstName: document.querySelector("#firstName").value,
  lastName: document.querySelector("#lastName").value,
  address: document.querySelector("#address").value,
  city: document.querySelector("#city").value,
  email: document.querySelector("#email").value,
};
console.log(contact);
// Contrôle validité formulaire avant de l'envoyer dans le local storage
if (
  firstName(contact) &&
  lastName(contact) &&
  address(contact) &&
  city(contact) &&
  mail(contact)
) {
  // Enregistrer le formulaire dans le local storage
  localStorage.setItem("contact", JSON.stringify(contact));
  const cart = JSON.parse(localStorage.getItem("cart"));
  document.querySelector("#order").value =
    "Articles et formulaire valide\n Passer commande !";
  sendToServer(contact, cart.map(product => product.id));
} else {
  alert("Veuillez bien remplir le formulaire");
}
/* FIN GESTION DU FORMULAIRE */
});

/* GESTION DU FORMULAIRE */

// Regex pour le contrôle des champs Prénom, Nom et Ville
const regExfirstNameLastNameCity = (value) => {
  // return /.test(value);
  return value.match(/^[A-Z][A-Za-z\é\è\ê\-]+$/)
};

// Regex pour le contrôle du champ Adresse
const regExAddress = (value) => {
  // return.test(value);
  return value.match(/^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/)
};

// Regex pour le contrôle du champ Email
const regExEmail = (value) => {
  // return .test(
  //   value
  // );
  return value.match(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/)
};

// Fonctions de contrôle du champ Prénom:
function firstName(contact) {
  const prenom = contact.firstName;
  let inputFirstName = document.querySelector("#firstName");
  if (regExfirstNameLastNameCity(prenom)) {
    inputFirstName.style.backgroundColor = "green";

    document.querySelector("#firstNameErrorMsg").textContent = "";
    return true;
  } else {
    inputFirstName.style.backgroundColor = "#FF6F61";

    document.querySelector("#firstNameErrorMsg").textContent =
      "Champ Prénom de formulaire invalide, ex: Paul";
    return false;
  }
}
// Fonctions de contrôle du champ Nom:
function lastName(contact) {
  const nom = contact.lastName;

  let inputLastName = document.querySelector("#lastName");
  if (regExfirstNameLastNameCity(nom)) {
    inputLastName.style.backgroundColor = "green";

    document.querySelector("#lastNameErrorMsg").textContent = "";
    return true;
  } else {
    inputLastName.style.backgroundColor = "#FF6F61";

    document.querySelector("#lastNameErrorMsg").textContent =
      "Champ Nom de formulaire invalide, ex: Durand";
    return false;
  }
}
// Fonctions de contrôle du champ Adresse:
function address(contact) {
  const adresse = contact.address;
  let inputAddress = document.querySelector("#address");
  if (regExAddress(adresse)) {
    inputAddress.style.backgroundColor = "green";

    document.querySelector("#addressErrorMsg").textContent = "";
    return true;
  } else {
    inputAddress.style.backgroundColor = "#FF6F61";

    document.querySelector("#addressErrorMsg").textContent =
      "Champ Adresse de formulaire invalide, ex: 50 rue de la paix";
    return false;
  }
}
// Fonctions de contrôle du champ Ville:
function city(contact) {
  const ville = contact.city;
  let inputCity = document.querySelector("#city");
  if (regExfirstNameLastNameCity(ville)) {
    inputCity.style.backgroundColor = "green";

    document.querySelector("#cityErrorMsg").textContent = "";
    return true;
  } else {
    inputCity.style.backgroundColor = "#FF6F61";

    document.querySelector("#cityErrorMsg").textContent =
      "Champ Ville de formulaire invalide, ex: Paris";
    return false;
  }
}
// Fonctions de contrôle du champ Email:
function mail(contact) {
  const courriel = contact.email;
  let inputMail = document.querySelector("#email");
  if (regExEmail(courriel)) {
    inputMail.style.backgroundColor = "green";

    document.querySelector("#emailErrorMsg").textContent = "";
    return true;
  } else {
    inputMail.style.backgroundColor = "#FF6F61";

    document.querySelector("#emailErrorMsg").textContent =
      "Champ Email de formulaire invalide, ex: example@contact.fr";
    return false;
  }
}

/* REQUÊTE DU SERVEUR ET POST DES DONNÉES */
function sendToServer(contact, products) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify({ contact, products }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    // Récupération et stockage de la réponse de l'API (orderId)
    .then((response) => {
      return response.json();
    })
    .then((server) => {
      const orderId = server.orderId;
      // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
      if (orderId) {
        console.log(orderId);
        location.href = "confirmation.html?id=" + orderId;
      }
      
    });

  
}
/* FIN REQUÊTE DU SERVEUR ET POST DES DONNÉES */

// Maintenir le contenu du localStorage dans le champs du formulaire

let dataFormulaire = JSON.parse(localStorage.getItem("contact"));

console.log(dataFormulaire);
if (dataFormulaire) {
  document.querySelector("#firstName").value = dataFormulaire.firstName;
  document.querySelector("#lastName").value = dataFormulaire.lastName;
  document.querySelector("#address").value = dataFormulaire.address;
  document.querySelector("#city").value = dataFormulaire.city;
  document.querySelector("#email").value = dataFormulaire.email;
} else {
  console.log("Le formulaire est vide");
}
  
