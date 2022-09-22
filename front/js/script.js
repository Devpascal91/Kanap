// on recupère les id avec tous les champs des images kanap

const products =document.querySelector("#items");

fetch('http://localhost:3000/api/products')
.then(function(response) {
  // console.log(response.json())
  return response.json();
})
.then(function(items) {
  // console.log(items)
  const html = items.map(function(item){
    console.log(item)
      
    return `<a href="./product.html?id=${item._id}">
      <article>
        <img src="${item.imageUrl}" alt="${item.altTxt}">
        <h3 class="productName">${item.name}</h3>
        <p class="productDescription">${item.description}</p>
      </article>
    </a>`
  })
  // console.log(html)
  products.innerHTML=html.join('');
})
