function createCategoryButtonHTML(category, index, categoryId, tabId) {
    return `
    <div class="px-2 mb-lg-3 mb-2 mx-auto my-2">
        <button id="${categoryId}" 
                class="btn-default btn-category h-100 w-fit ${index === 0 ? "active" : ""}" 
                data-bs-toggle="tab" 
                data-bs-target="#${tabId}" 
                type="button" 
                role="tab" 
                aria-controls="${tabId}" 
                aria-selected="${index === 0}">
            <img src="${category.icon}" alt="${category.name} kategória ikonja" width="50">
            <span class="text-nowrap text-uppercase text-left">${category.name}</span>
        </button>
    </div>`;
}

function createCategoryPaneHTML(key, index, categoryId, tabId, productHTML) {
    return `
    <div id="${tabId}" 
         class="tab-pane fade ${index === 0 ? "show active" : ""}" 
         role="tabpanel" 
         aria-labelledby="${categoryId}">
         <div class="row">
            ${productHTML}
         </div>
    </div>`;
}

function createProductHTML(item) {
    return `
    <div class="col-lg-4 col-md-6 col-12">
        <article class="product-container">
            <div class="product-img-container">
                <img src="${item.img}" class="w-100 product-img" alt="${item.name} termék képe">
            </div>
            <div class="product-desc-bg">
                <div class="product-name-container">
                    <h3 class="mb-2">${item.name}</h3>
                </div>
                <div class="product-desc p-lg-3 p-2">
                    <span>${item.description}</span>

                    <div class="d-flex justify-content-end">
                        <div class="price-box">
                            <span>${item.price} Ft</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>`;
}

function populateMenu() {
    const categoriesContainer = document.getElementById('product-categories');
    const productsContainer = document.getElementById('products');

    categoriesContainer.innerHTML = "";
    productsContainer.innerHTML = "";

    $.ajax({
        url: "http://localhost:5000/api/menu",
        method: "GET",
        dataType: "json",

        success: (menu) => {
            const categoryKeys = Object.keys(menu);

            categoryKeys.forEach((key, index) => {
                const category = menu[key];
                const categoryId = `category-${index + 1}`;
                const tabId = `${key}-products`;

                categoriesContainer.insertAdjacentHTML(
                    "beforeend",
                    createCategoryButtonHTML(category, index, categoryId, tabId)
                );

                const productHTML = category.items
                    .map(item => createProductHTML(item))
                    .join("");

                productsContainer.insertAdjacentHTML(
                    "beforeend",
                    createCategoryPaneHTML(key, index, categoryId, tabId, productHTML)
                );
            });
        },

        error: (error) => {
            console.error("Hiba történt a menü betöltésekor:", error);
        }
    });
}

document.addEventListener("DOMContentLoaded", populateMenu);