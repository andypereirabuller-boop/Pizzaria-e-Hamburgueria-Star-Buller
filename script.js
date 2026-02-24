// 1. SELEÇÃO DE ELEMENTOS (ID's devem ser idênticos ao HTML)
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const spanItem = document.getElementById("date-span");


    

// 2. INICIALIZAÇÃO DO CARRINHO (LocalStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 3. FUNÇÃO DE ATUALIZAÇÃO DA INTERFACE
function updateCartVisuals() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
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
        
        total += (item.price * item.quantity);
        quantity += item.quantity;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

// 6. FINALIZAR PEDIDO (O ENVIO DEFINITIVO)
checkoutBtn.addEventListener("click", () => {
    // Validação de Horário
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

    // Gerar Mensagem
    const itensTexto = cart.map(i => `${i.name} (x${i.quantity})`).join(" | ");
    const totalPedido = cartTotal.innerText;
    const msg = `*NOVO PEDIDO*\n\n*Itens:* ${itensTexto}\n*Total:* ${totalPedido}\n*Endereço:* ${addressInput.value}`;



const cartItems = cart.map(item => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "61984752125"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

// 3. LIMPEZA TOTAL DO CARRINHO (A CORREÇÃO)
    cart = []; // Esvazia o array
    localStorage.removeItem("cart"); // Limpa o banco local
    updateCartVisuals(); // Zera os números na tela
    addressInput.value = ""; // Limpa o campo de endereço
    cartModal.style.display = "none"; // Fecha o modal



   



    
});

// 7. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    updateCartVisuals();
    const h = new Date().getHours();
    if (spanItem) {
        const aberto = h >= 18 || h < 7;
        spanItem.className = aberto ? "bg-green-600 px-4 py-1 rounded" : "bg-red-500 px-4 py-1 rounded";
    }
});


document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800, // duração da animação
        once: true     // anima apenas uma vez ao rolar
    });
    updateCartVisuals();
    // ... restante do seu código
});


