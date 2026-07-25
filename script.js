import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-tyul-vEKA1tzaVrpKvs0ysNkSfpbFY4",
  authDomain: "raghad-product-manager-b7147.firebaseapp.com",
  projectId: "raghad-product-manager-b7147",
  storageBucket: "raghad-product-manager-b7147.firebasestorage.app",
  messagingSenderId: "802770260120",
  appId: "1:802770260120:web:8fd2d517ce53ca942a40ed"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productQuantity = document.getElementById("productQuantity");
let productImage = document.getElementById("productImage");
let productCategory = document.getElementById("productCategory");
let saveBtn = document.getElementById("saveBtn");
let resetBtn = document.getElementById("resetBtn");
let clearBtn = document.getElementById("clearBtn");
let message = document.getElementById("message");
let productList = document.getElementById("productList");
let searchInput = document.getElementById("searchInput");
let sortSelect = document.getElementById("sortSelect");
let totalProducts = document.getElementById("totalProducts");
let totalQuantity = document.getElementById("totalQuantity");
let totalValue = document.getElementById("totalValue");

let products = [];
let editIndex= null;

let savedProducts = localStorage.getItem("products");



if(savedProducts !==null){
        products = JSON.parse(savedProducts);
    }

function saveProducts(){
  localStorage.setItem("products",JSON.stringify(products));      
}

function resetForm() {
    productName.value = "";
    productPrice.value = "";
    productQuantity.value = "";
    productCategory.value = "";
    productImage.value = "";

    editIndex = null;
    saveBtn.textContent = "Save Product";

    message.textContent = "";
}


function showMessage(text, type) {

    message.style.display = "block";
    message.textContent = text;
  alert(text);

    if (type === "success") {
    message.style.background = "#E8F5E9";
    message.style.color = "#2E7D32";
    message.style.border = "1px solid #81C784";
} else {
    message.style.background = "#FFEBEE";
    message.style.color = "#C62828";
    message.style.border = "1px solid #EF9A9A";
}

    setTimeout(function () {
        message.style.display = "none";
    }, 3000);
}

function updateStats() {

    totalProducts.textContent = products.length;

    let quantity = 0;
    let value = 0;

    products.forEach(function(product) {
        quantity += product.quantity;
        value += product.price * product.quantity;
    });

    totalQuantity.textContent = quantity;
    totalValue.textContent = "$" + value;

}

function displayProducts() {
    productList.innerHTML = "";
    let search = searchInput.value.toLowerCase();

     if (sortSelect.value === "name") {
    products.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
         
}

if (sortSelect.value === "priceLow") {
    products.sort(function (a, b) {
        return a.price - b.price;
    });
}

if (sortSelect.value === "priceHigh") {
    products.sort(function (a, b) {
        return b.price - a.price;
    });
}

if (sortSelect.value === "quantityLow") {
    products.sort(function (a, b) {
        return a.quantity - b.quantity;
    });
}

if (sortSelect.value === "quantityHigh") {
    products.sort(function (a, b) {
        return b.quantity - a.quantity;
    });
}
        
    products.forEach(function(product, index) {
        if (product.name.toLowerCase().includes(search)) {
                let quantityText;

if (product.quantity === 0) {
    quantityText = "❌ Out of Stock";
} else {
    quantityText = `📦 Quantity: ${product.quantity}`;
}
            productList.innerHTML += `
                <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                <p>💰 Price: $${product.price}</p>
                <p>${quantityText}</p>
<p>🏷️ Category: ${product.category}</p>
                    <div class="button-group">
    <button onclick="editProduct(${index})">✏️ Edit</button>
    <button onclick="deleteProduct(${index})">🗑️ Delete</button>
</div>
                </div>
            `;
}
});
updateStats();
}

saveBtn.addEventListener("click" ,function(){
        let name = productName.value.trim();
let price = Number(productPrice.value);
let quantity = Number(productQuantity.value);

if (name === "") {
    showMessage("❌ Please enter a product name", "error");
    return;
}

if (price <= 0) {
    showMessage("❌ Price must be greater than 0", "error");
    return;
}

if (quantity < 0) {
    showMessage("❌ Quantity cannot be negative", "error");
    return;
}
        
if (productCategory.value === "") {
    showMessage("❌ Please select a category", "error");
    return;
}  
        
let file = productImage.files[0];

if (editIndex !== null && !file) {

    products[editIndex].name = name;
    products[editIndex].price = price;
    products[editIndex].quantity = quantity;
    products[editIndex].category = productCategory.value;

    editIndex = null;
    saveBtn.textContent = "Save Product";
  
        

    saveProducts();
displayProducts();
resetForm();
showMessage("✏️ Product Updated Successfully", "success");

    return;
}

if (!file) {
    showMessage("❌ Please choose an image", "error");
    return;
}

let reader = new FileReader();

reader.onload = function () {

    let product = {
        name: name,
        price: price,
        quantity: quantity,
        category: productCategory.value,
        image: reader.result
    };

    if (editIndex === null) {
        products.push(product);
        showMessage("✅ Product Added Successfully", "success");
            
    } else {
        products[editIndex] = product;
        editIndex = null;
        saveBtn.textContent = "Save Product";
    showMessage("✏️ Product Updated Successfully", "success");
    }

    saveProducts();
    displayProducts();
    resetForm();
};

reader.readAsDataURL(file);

return;
        
});

function editProduct(index){
        productName.value = products[index].name;
        productPrice.value = products[index].price;
        productQuantity.value = products[index].quantity;
        
        editIndex = index;
        productCategory.value = products[index].category;
        saveBtn.textContent = "Update Product";
}

function deleteProduct(index) {

    if (confirm("Are you sure you want to delete this product?")) {

        products.splice(index, 1);

        saveProducts();
        displayProducts();

        showMessage("🗑️ Product Deleted Successfully", "success");
    }

}

function clearAllProducts() {

    let confirmDelete = confirm("Are you sure you want to delete all products?");

    if (confirmDelete) {

        products = [];

        saveProducts();

        displayProducts();

        resetForm();

        showMessage("🗑️ All Products Deleted Successfully", "success");
    }
}

displayProducts();
searchInput.addEventListener("input", function () {
    displayProducts();
});

sortSelect.addEventListener("change", function () {
    displayProducts();
});

resetBtn.addEventListener("click", resetForm);

clearBtn.addEventListener("click", clearAllProducts);

let loginPage = document.getElementById("loginPage");
let appPage = document.querySelector(".app");

let email = document.getElementById("email");
let password = document.getElementById("password");

let loginBtn = document.getElementById("loginBtn");
let signupBtn = document.getElementById("signupBtn");

loginBtn.addEventListener("click", function () {

    if (email.value === "" || password.value === "") {
        alert("Please enter your email and password");
        return;
    }

    loginPage.style.display = "none";
    appPage.style.display = "block";
});

signupBtn.addEventListener("click", function () {

    if (email.value === "" || password.value === "") {
        alert("Please enter your email and password");
        return;
    }

    alert("Account Created Successfully");

    loginPage.style.display = "none";
    appPage.style.display = "block";
});

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;