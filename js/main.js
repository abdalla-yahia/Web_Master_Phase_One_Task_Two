const noInternet        = document.querySelector(".noInternet");
const AddToCart         = document.querySelector(".AddToCart");
const RemoveFromCart    = document.querySelector(".RemoveFromCart");
const badge             = document.querySelector(".badge");
const totalPrice        = document.querySelector(".total .totalPrice");
const shoppingCartIcon  = document.querySelector(".shoppingCart");
const cartsProudect     = document.querySelector(".cartsProudect");
const search            = document.getElementById('search');
const searchOption      = document.getElementById('searchOption');
let BuyProduct          = document.querySelector(".BuyProduct");
let productsContainer   = document.querySelector(".Products_Container");

let total = localStorage.getItem("totalPrice") ? +(localStorage.getItem("totalPrice")) : 0;
let addItemStorage = localStorage.getItem("proudectInCart") ? JSON.parse(localStorage.getItem("proudectInCart")): [];

let modeSearch = 'title';
let quantity = 1;

// Check if the user is online or offline
window.addEventListener("load", () => toggleInternetStatus(navigator.onLine));
window.addEventListener("online", () => toggleInternetStatus(true));
window.addEventListener("offline", () => toggleInternetStatus(false));
const toggleInternetStatus = (isOnline) => {
  noInternet.style.display = isOnline ? "none" : "block";
};
//Fetch Products Data From DB File
const fetchProducts = async () => {
  try {
    const res = await fetch("/DB/products_List.json");
    const data = await res.json();
    products = data.data;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Fetch products and draw them on the page
const DrawProduct =  async ()=> {
      const allProducts = await fetchProducts();

  productsContainer.innerHTML = allProducts
    .map((item) => {
      const isFavorite = checkFavorite(item.id);
      const heartIconClass = isFavorite ? "fas" : "far";

      const heightImage =
        item.category === "phone"
          ? "330px"
          : item.category === "smart watch"
          ? "240px"
          : "200px";

      return `
                <div class="product-item mb-4 p-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5"> 
                <div class="card border border-info pt-3 w-full"> 
                <img class="product-item-img card-img-top m-auto" src="./${item.imageURL}" alt="Card image" style="width:80%; height:${heightImage};"> 
                <div class="product-itm-desc card-body pb-0 pl-4"> 
                <p class="card-title">Product: <span class="text-2xl text-orange-500">${item.title}</span></p> 
                <p class="card-text">Category :${item.category}.</p> 
                <div class="color w-full  flex justify-start items-center gap-2">Color: <p class="w-[12px] h-[12px] rounded-full" style="background:${item.color}"></p></div> 
                <p class="card-price">Price: <span> <del>${item.price} EGP</del> <span class="text-lg text-green-500">${item.salePrice} EGP</span></span></p> 
                </div> <div class="product-item-action d-flex justify-content-between pr-4 pl-4"> 
                <button id="add-btn-${item.id}" class="AddToCart btn btn-primary mb-2" onClick="addTOCartEvent(${item.id})">Add To Cart</button> 
                <button id="remove-btn-${item.id}" class="RemoveFromCart btn btn-danger mb-2 hidden" onClick="removeFromCart(${item.id})">Remove From Cart</button> 
                <i id="fav-${item.id}" class="${heartIconClass} fa-heart text-green-500" onClick="AddToFaveroites(${item.id})"></i> </div> </div> </div>
        `;
    })
    .join("");
}
 DrawProduct();

 // Draw Cart Items Function
const DrowCartItems= (item)=> {
    if (!document.getElementById(`BuyProductItem-${item.id}`)) {
        let quantity = +(localStorage.getItem(`quantity-${item.id}`)) || 1;

        BuyProduct.innerHTML += `<div id="BuyProductItem-${item.id}" class="row my-2 pr-2">
        <span class="col-6">${item.title}</span>
        <span class="col-2" id="quantity-${item.id}">${quantity}</span>
        <span class="text-danger mins col-2" onClick="mins(${item.id},${item.salePrice})">-</span>
        <span class="text-success pls col-2" onClick="pls(${item.id},${item.salePrice})">+</span>
      </div>`;
    }
}

// Check The Item Put In The Storage
if (addItemStorage) {
    addItemStorage.map((item) => {
        DrowCartItems(item);
       const addBtn =  document.getElementById(`add-btn-${item.id}`)
       const removeBtn =  document.getElementById(`remove-btn-${item.id}`)
        removeBtn &&  (addBtn.style.display = "none");
        
        removeBtn && (removeBtn.style.display = "inline-block");

        total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));
    })
    totalPrice.innerHTML = total / 2 +" EGP";

    if (addItemStorage.length != 0) {
        badge.style.display = "block";
        badge.innerHTML = addItemStorage.length;
    }
    else {
        badge.style.display = "none";
    }

}

//Actions Function 
const pls = (id, salePrice)=> {

    let quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = +(quantityElement.innerHTML);

    quantity++;
    quantityElement.innerHTML = quantity;
    localStorage.setItem(`quantity-${id}`, quantity.toString());
    total += (+salePrice);
    totalPrice.innerHTML = total +" EGP";
    localStorage.setItem("totalPrice", JSON.stringify(total));
    openCart();
}
const mins = (id, salePrice)=> {
    const quantityElement = document.getElementById(`quantity-${id}`);
    const quantity = +(quantityElement.innerHTML);

    if (quantity > 1) {
        quantity--;
        quantityElement.innerHTML = quantity;
        localStorage.setItem(`quantity-${id}`, quantity.toString());
        total -= (+salePrice);
        totalPrice.innerHTML = total +" EGP";
        localStorage.setItem("totalPrice", JSON.stringify(total));
    }
    else {
        removeFromCart(id);
    }
    openCart();
}
const removeFromCart= (id)=> {
    const itemIndex = addItemStorage.findIndex((item) => item.id === id);
    const quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = +(quantityElement.innerHTML);

    if (itemIndex !== -1) {
        addItemStorage.splice(itemIndex, 1);
        localStorage.setItem("proudectInCart", JSON.stringify(addItemStorage));

        total = 0;
        document.getElementById(`add-btn-${id}`).style.display = "inline-block";
        document.getElementById(`remove-btn-${id}`).style.display = "none";

        let BuyProductItem = document.getElementById(`buyProudectItem-${id}`);
        if (BuyProductItem) {
            BuyProductItem.remove();
        }

        addItemStorage.forEach((item) => {
            DrowCartItems(item);
            total += +item.salePrice * quantity;

        });

        totalPrice.innerHTML = total +" EGP";
        localStorage.setItem("totalPrice", JSON.stringify(total));

        if (addItemStorage.length !== 0) {
            badge.style.display = "block";
            badge.innerHTML = addItemStorage.length;
        } else {
            badge.style.display = "none";
        }
    }
}
const addTOCartEvent= (id)=> {
    if (localStorage.getItem("userName")) {
        let choosenItem = products.find((item) => item.id === id);
        let itemIndex = addItemStorage.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            DrowCartItems(choosenItem);

            addItemStorage = [...addItemStorage, choosenItem];
            localStorage.setItem("proudectInCart", JSON.stringify(addItemStorage));

            let quantity = localStorage.getItem(`quantity-${choosenItem.id}`) ? +(localStorage.getItem(`quantity-${choosenItem.id}`)) : 1;

            total += (+choosenItem.salePrice) * quantity;
            totalPrice.innerHTML = total +" EGP";
            localStorage.setItem("totalPrice", JSON.stringify(total));

            document.getElementById(`add-btn-${id}`).style.display = "none";
            document.getElementById(`remove-btn-${id}`).style.display = "inline-block";

            if (addItemStorage.length != 0) {
                badge.style.display = "block";
                badge.innerHTML = addItemStorage.length;
            }
        } else {
            badge.style.display = "none";
        }
    } else {
        window.location = "login.html";
    }
}


// Favorites Actions Functions

const checkFavorite =(itemId)=> {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.includes(itemId);

    return isFavorite;
}

const AddToFaveroites = (id) => {
    if (localStorage.getItem("userName")) {
        const heartIcon = document.getElementById(`fav-${id}`);
        if (heartIcon.classList.contains("far")) {
            heartIcon.classList.remove("far");
            heartIcon.classList.add("fas");
            addToFavorites(id);
        } else {
            heartIcon.classList.remove("fas");
            heartIcon.classList.add("far");
            removeFromFavorites(id);
        }
    } else {
        window.location = "login.html";
    }
}

const addToFavorites =(itemId)=> {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(itemId)) {
        favorites.push(itemId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

const removeFromFavorites =(itemId)=> {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(itemId);
    if (index !== -1) {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

const openCart =() =>{
    if (BuyProduct.innerHTML != "") {
        if (cartsProudect.style.display == "block") {
            cartsProudect.style.display = "none"
        } else {
            cartsProudect.style.display = "block"
        }
    }
}

// Fail Cart By Products
shoppingCartIcon.addEventListener("click", openCart)

//Search Event
searchOption.addEventListener('change', function () {
    let selectedValue = this.value;

    if (selectedValue === "searchTittle") {
        modeSearch = 'title';
    } else if (selectedValue === "searchCategory") {
        modeSearch = 'category';
    }

    search.placeholder = `search by ${modeSearch}`;
    search.focus();
    search.value = '';
    drawData();
});

const searchData=(value)=> {
    let filteredProducts = products.filter((item) => {
        if (modeSearch === 'title') {
            return item.title.toLowerCase().includes(value.toLowerCase());
        } else if (modeSearch === 'category') {
            return item.category.toLowerCase().includes(value.toLowerCase());
        }
    });
    let product = filteredProducts.map((item) => {

        let isFavorite = checkFavorite(item.id);

        let heartIconClass = isFavorite ? "fas" : "far";
        let heightImage;
        switch (item.category) {
            case 'phone':
                heightImage = '330px';
                break;

            case 'smart watch':
                heightImage = '240px';
                break;
            default:
                heightImage = '200px';
                break;
        }


        return `
            <div class="product-item col-4 mb-4 p-4">
                <div class="card border border-info pt-3">
                    <img class="product-item-img card-img-top m-auto" src="/${item.imageURL}" alt="Card image" style="width:80%; height:${heightImage};">
                    <div class="product-itm-desc card-body pb-0 pl-4">
                        <p class="card-title">Product: ${item.title}.</p>
                        <p class="card-text">Category :${item.category}.</p>
                        <p class="color">Color: ${item.color}.</p>
                        <p class="card-price">Price: <span> <del>${item.price} EGP</del> ${item.salePrice} EGP</span></p>
                    </div>
                    <div class="product-item-action d-flex justify-content-between pr-4 pl-4">
                    <button id="add-btn-${item.id}" class="AddToCart btn btn-primary mb-2" onClick="addTOCartEvent(${item.id})">Add To Cart</button>
                    <button id="remove-btn-${item.id}" class="RemoveFromCart btn btn-primary mb-2" onClick="removeFromCart(${item.id})">Remove From Cart</button>
                        <i id="fav-${item.id}" class="${heartIconClass} fa-heart" onClick="AddToFaveroites(${item.id})"></i>
                    </div>
                </div>
            </div>
        `;

    });


    productsContainer.innerHTML = product.join('');
}
