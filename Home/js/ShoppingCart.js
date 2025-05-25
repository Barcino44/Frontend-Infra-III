document.addEventListener('DOMContentLoaded', loadCart);
let carrito = [];
let clientId = localStorage.getItem("client");
async function loadCart(){
    
    let response = await fetch(`http://localhost:8080/shoppingCart/getItems/clientId/${clientId}`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }, 
    }); 
    carrito = await response.json()
    console.log(carrito)
    if(response.ok) {
        showCart();
    }
}
 function showCart() {
    const container = document.getElementById('carrito-container');
    const totalSpan = document.getElementById('total-carrito');
    container.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        container.innerHTML = '<p>Tu carrito está vacío.</p>';
        totalSpan.textContent = '0';
        return;
    }

    carrito.forEach((item, index) => {
        const product = item.product;
        const subtotal = product.price * item.quantity;
        total += subtotal;

        const row = document.createElement('div');
        row.className = 'row align-items-center mb-3';
        row.innerHTML = `
            <div class="col-md-2">
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                </a>
            </div>
            <div class="col-md-3"><strong>${product.name}</strong><br><small>${product.description}</small></div>
            <div class="col-md-2">$${product.price.toFixed(2)}</div>
            <div class="col-md-2">
                <span class="cantidad-text">Cantidad: ${item.quantity}</span>
            </div>
            <div class="col-md-2">$${subtotal.toFixed(2)}</div>
            <div class="col-md-1">
                <button class="btn btn-danger btn-sm eliminar" data-index="${index}" data-name="${item.name}" data-id="${item.id}">X</button>
            </div>
        `;
        container.appendChild(row);
    });

    totalSpan.textContent = total.toFixed(2);

    // Mover los eventos AQUÍ para que se apliquen después de renderizar el HTML
    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            const nuevaCantidad = parseInt(e.target.value);
            if (nuevaCantidad > 0) {
                carrito[index].quantity = nuevaCantidad;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                showCart(); // Refrescar vista del carrito
            }
        });
    });

    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const itemId = e.target.dataset.id; // ID del ítem o del producto
            console.log("Eliminar item con ID:", itemId);
            eliminateItem(itemId)
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            showCart();
        });
    });

}
async function eliminateItem(itemId){
    let response = await fetch(`http://localhost:8080/shoppingCart/deleteItem/item/${itemId}/client/${clientId}`,{
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json'
        }, 
    }); 
    

}

