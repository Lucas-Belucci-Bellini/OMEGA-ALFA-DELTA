const products = [
    {
        id: 1,
        name: "Produto Alpha",
        description: "Um produto simples e de ótima qualidade.",
        price: 49.90,
        image: "📦"
    },

    {
        id: 2,
        name: "Produto Beta",
        description: "Uma excelente opção para o seu dia a dia.",
        price: 79.90,
        image: "🎧"
    },

    {
        id: 3,
        name: "Produto Gamma",
        description: "Produto moderno com ótimo custo-benefício.",
        price: 99.90,
        image: "⌚"
    },

    {
        id: 4,
        name: "Produto Delta",
        description: "Qualidade e praticidade em um só produto.",
        price: 129.90,
        image: "🎮"
    }
];


let cart = [];


const productsContainer =
    document.getElementById("products");

const cartCount =
    document.getElementById("cartCount");

const cartModal =
    document.getElementById("cartModal");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartButton =
    document.getElementById("cartButton");

const closeCart =
    document.getElementById("closeCart");

const checkoutButton =
    document.getElementById("checkoutButton");


/* MOSTRAR PRODUTOS */

function renderProducts() {

    productsContainer.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.classList.add("product-card");

        card.innerHTML = `
            <div class="product-image">
                ${product.image}
            </div>

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-price">
                    R$ ${product.price.toFixed(2).replace(".", ",")}
                </div>

                <button
                    class="add-button"
                    onclick="addToCart(${product.id})"
                >
                    Adicionar ao carrinho
                </button>

            </div>
        `;

        productsContainer.appendChild(card);

    });

}


/* ADICIONAR */

function addToCart(productId) {

    const product =
        products.find(item => item.id === productId);

    if (!product) {
        return;
    }

    cart.push(product);

    updateCart();

}


/* REMOVER */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


/* ATUALIZAR CARRINHO */

function updateCart() {

    cartCount.textContent = cart.length;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Seu carrinho está vazio.
            </p>
        `;

        cartTotal.textContent = "0,00";

        return;
    }


    let total = 0;


    cart.forEach((product, index) => {

        total += product.price;

        const item =
            document.createElement("div");

        item.classList.add("cart-item");

        item.innerHTML = `

            <div class="cart-item-info">

                <div class="cart-item-name">
                    ${product.name}
                </div>

                <div class="cart-item-price">
                    R$ ${product.price
                        .toFixed(2)
                        .replace(".", ",")}
                </div>

            </div>

            <button
                class="remove-button"
                onclick="removeFromCart(${index})"
            >
                Remover
            </button>

        `;

        cartItems.appendChild(item);

    });


    cartTotal.textContent =
        total.toFixed(2).replace(".", ",");
}


/* ABRIR CARRINHO */

cartButton.addEventListener("click", () => {

    cartModal.style.display = "flex";

});


/* FECHAR CARRINHO */

closeCart.addEventListener("click", () => {

    cartModal.style.display = "none";

});


/* FECHAR CLICANDO FORA */

cartModal.addEventListener("click", event => {

    if (event.target === cartModal) {

        cartModal.style.display = "none";

    }

});


/* FINALIZAR */

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Seu carrinho está vazio.");

        return;
    }

    alert(
        "Compra iniciada! Aqui você poderá conectar o sistema de pagamento."
    );

});


/* INICIALIZAÇÃO */

renderProducts();

updateCart();