

// Sélection des id 
const price = document.querySelector("#price");

const title = document.querySelector("#title");

const description = document.querySelector("#description");

const image = document.querySelector("#img");

const colors = document.querySelector("#colors");

const quantity = document.querySelector("#quantity");

const addToCart = document.querySelector("#addToCart");

const message = document.querySelector("#message");

const cart = document.querySelector("#cart_items");


// récupération de l'id du produit

const getProductId = () => {
  return new URL(window.location.href).searchParams.get("id");
};
const productId = getProductId();
console.log(window.location.href)

fetch(`http://localhost:3000/api/products/${productId}`)
.then(function(response) {
  //  console.log(response.json)
  return response.json();
})
.then(function(product){
  price.innerHTML = product.price
  title.innerHTML = product.name
  description.innerHTML = product.description
  product.colors.forEach(color => {
    const option = document.createElement("option")
    option.value = color
    option.text = color
    colors.add(option)
  });
  image.src = product.imageUrl
  image.alt = product.altTxt
 
})
// intégrer,ajouter un élément au panier

addToCart.addEventListener('click',() =>{
  if (colors.value ==="") {
    message.innerHTML = "Veuillez choisir une couleur"
    return;
  }
  const storedCart = localStorage.getItem('cart')
  console.log(storedCart);
  let cart;
  if (!storedCart) {
     cart = []
  } else {
     cart =  JSON.parse(storedCart)
  }
  const index = cart.findIndex((item)=>item.id === getProductId() && item.color === colors.value)
  console.log(index);

  // Boucles pour eviter la duplication
  
  if (index === -1) {
    cart.push({
      id:getProductId(),
      quantity:parseInt(quantity.value),
      color:colors.value,
    })
  } else {
    cart[index].quantity += parseInt(quantity.value) 
    console.log(cart[index])
  }
 
  localStorage.setItem('cart',JSON.stringify(cart))
  console.log(cart);
  message.innerHTML = "Votre article à bien été ajouté au panier";
})



