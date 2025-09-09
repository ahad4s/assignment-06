/* mobile menu */
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

/* elements */
const categoryList = document.getElementById("category-list");
const treesList = document.getElementById("trees-list");
const loading = document.getElementById("loading");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

let cart = [];

/* helpers */
const fetchJSON = async (url) => (await fetch(url)).json();
const showLoading = () => { loading.classList.remove("hidden"); treesList.innerHTML = ""; };
const hideLoading = () => loading.classList.add("hidden");

const resetActiveButtons = (activeBtn) => {
    [...categoryList.children].forEach((b) => b.classList.remove("bg-primary", "text-white"));
    activeBtn && activeBtn.classList.add("bg-primary", "text-white");
};

/* categories */
async function loadCategories() {
    const data = await fetchJSON("https://openapi.programming-hero.com/api/categories");
    displayCategories(data.categories);
}

function displayCategories(categories) {
    categoryList.innerHTML = "";

    /* All Trees button */
    const allBtn = document.createElement("button");
    allBtn.className = "px-4 py-2 rounded bg-primary text-white font-semibold";
    allBtn.textContent = "All Trees";
    allBtn.onclick = () => loadAllTrees(allBtn);
    categoryList.appendChild(allBtn);

    /* Category buttons */
    categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "px-4 py-2 rounded bg-emerald-100 text-primary hover:bg-primary hover:text-white transition";
        btn.textContent = cat.category_name;
        btn.onclick = () => loadTreesByCategory(cat.id, btn);
        categoryList.appendChild(btn);
    });

    /*Load all trees by default*/
    loadAllTrees(allBtn);
}

/* trees */
async function loadAllTrees(activeBtn) {
    showLoading();
    resetActiveButtons(activeBtn);
    const data = await fetchJSON("https://openapi.programming-hero.com/api/plants");
    displayTrees(data.plants);
    hideLoading();
}

async function loadTreesByCategory(id, btn) {
    showLoading();
    resetActiveButtons(btn);
    const data = await fetchJSON(`https://openapi.programming-hero.com/api/category/${id}`);
    displayTrees(data.plants);
    hideLoading();
}

function displayTrees(trees) {
    treesList.innerHTML = trees.map((t) => `
      <div class="bg-white rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md">
        <img src="${t.image}" alt="${t.name}" class="h-44 w-full object-cover rounded mb-3" />
        <h4 class="font-semibold cursor-pointer text-lg hover:underline text-primary" onclick="showDetails(${t.id})">${t.name}</h4>
        <p class="mt-2 text-sm text-emerald-600 flex-1">${t.description.slice(0, 70)}...</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-xs px-2 py-1 bg-emerald-50 rounded text-emerald-700">${t.category}</span>
          <div class="text-primary font-bold">৳${t.price}</div>
        </div>
        <button class="mt-3 bg-primary text-white py-2 rounded-full" onclick="addToCart('${t.name}', ${t.price})">Add to Cart</button>
      </div>`).join("");
}

/* modal */
async function showDetails(id) {
    const data = await fetchJSON(`https://openapi.programming-hero.com/api/plant/${id}`);
    const t = data.plants;
    modalContent.innerHTML = `
      <img src="${t.image}" alt="${t.name}" class="w-full h-48 object-cover rounded mb-3" />
      <h2 class="text-xl font-bold text-primary">${t.name}</h2>
      <p class="mt-2 text-sm text-gray-600">${t.description}</p>
      <p class="mt-3 font-semibold text-primary">Price: ৳${t.price}</p>
    `;
    modal.classList.remove("hidden");
}
modalClose.onclick = () => modal.classList.add("hidden");
modal.onclick = (e) => e.target === modal && modal.classList.add("hidden");

/* cart */
const updateCart = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartList.innerHTML = cart.length
        ? cart.map((item, i) => `
            <li class="flex justify-between items-center bg-primary/10 px-3 py-2 rounded">
              <div>
                <p class="font-medium text-primary">${item.name}</p>
                <p class="text-xs text-gray-600">৳${item.price}</p>
              </div>
              <button class="text-gray-400 hover:text-red-500 text-xs font-bold ml-2 leading-none" onclick="removeFromCart(${i})">&times;</button>
            </li>`).join("")
        : `<li class="text-gray-500 text-center">No items in cart</li>`;
    cartTotal.textContent = `৳${total}`;
};

const addToCart = (name, price) => {
    cart.push({ name, price });
    updateCart();
    alert(`${name} Added to Cart`);
};

const removeFromCart = (i) => {
    cart.splice(i, 1);
    updateCart();
};

/* init */
loadCategories();