// 1. SELEÇÃO DE ELEMENTOS
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartSubtotal = document.getElementById('cart-subtotal'); // Novo
const deliveryDisplay = document.getElementById('cart-delivery-display'); // Novo
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const spanItem = document.getElementById("date-span");

// CONFIGURAÇÃO DE TAXA
const deliveryFee = 5.00; 

// 2. INICIALIZAÇÃO DO CARRINHO
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 3. FUNÇÃO DE ATUALIZAÇÃO DA INTERFACE
function updateCartVisuals() {
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;
    let quantity = 0;

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-between mb-4 flex-col border-b pb-2";
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium">R$ ${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <button class="remove-btn text-red-500 font-bold" data-name="${item.name}">Remover</button>
            </div>`;
        
        subtotal += (item.price * item.quantity);
        quantity += item.quantity;
        cartItemsContainer.appendChild(div);
    });

    // Lógica da Taxa: Só aplica se houver itens
    const taxaAplicada = cart.length > 0 ? deliveryFee : 0;
    const totalComTaxa = subtotal + taxaAplicada;

    // ATUALIZAÇÃO DOS TEXTOS NO MODAL
    if(cartSubtotal) cartSubtotal.innerText = subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    if(deliveryDisplay) deliveryDisplay.innerText = taxaAplicada.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    
    cartTotal.innerText = totalComTaxa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    
    cartCounter.innerText = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 4. LÓGICA DE ADICIONAR E REMOVER
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    updateCartVisuals();
}

function removeItem(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartVisuals();
    }
}

// 5. EVENTOS DE INTERAÇÃO
cartBtn.addEventListener("click", () => {
    updateCartVisuals();
    cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => cartModal.style.display = "none");

cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
});

menu.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (btn) {
        addToCart(btn.dataset.name, btn.dataset.price);
    }
});

cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        removeItem(e.target.dataset.name);
    }
});

addressInput.addEventListener("input", (e) => {
    if (e.target.value !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

// 6. FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", () => {
    const h = new Date().getHours();
    const isOpen = h >= 18 || h < 7;

    if (!isOpen) {
        if(typeof Toastify !== 'undefined') {
            Toastify({ text: "Pizzaria Fechada!", duration: 3000, style: { background: "#ef4444" } }).showToast();
        } else { alert("Pizzaria Fechada!"); }
        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Mensagem WhatsApp
    const cartItemsText = cart.map(item => `*${item.name}* (x${item.quantity})`).join("\n");
    const totalFinal = cartTotal.innerText;
    const phone = "61984752125";

    const message = encodeURIComponent(
        `*NOVO PEDIDO*\n` +
        `--------------------------\n` +
        `${cartItemsText}\n` +
        `--------------------------\n` +
        `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n` +
        `*TOTAL:* ${totalFinal}\n\n` +
        `*Endereço:* ${addressInput.value}`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    localStorage.removeItem("cart");
    updateCartVisuals();
    addressInput.value = "";
    cartModal.style.display = "none";
});

// 7. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
    updateCartVisuals();
    
    const h = new Date().getHours();
    if (spanItem) {
        const aberto = h >= 18 || h < 7;
        spanItem.className = aberto ? "bg-green-600 px-4 py-1 rounded" : "bg-red-500 px-4 py-1 rounded";
    }
});
