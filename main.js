document.addEventListener('DOMContentLoaded', () => {
    const pizzaMenu = document.getElementById('pizza-menu');
    const numOfPizza = document.querySelector('.numOfPizza');
    const cartItems = document.querySelector('.order-list');
    const cartTotal = document.getElementById('sum').querySelector('span');
    const clearCartButton = document.querySelector('.clean');
    const savedCategory = localStorage.getItem('selectedCategory');
    let pizzaInfo = [];
    // Кошик
    let cart = {};

    // Завантаження даних про піцу з data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            pizzaInfo = data;
            initializePage();
        })
        .catch(error => console.error('Error loading data:', error));

    // Ініціалізація сторінки
    function initializePage() {
        loadCartFromLocalStorage();

        if (savedCategory) {
            loadPizzasByCategory(savedCategory);
            document.querySelectorAll('.category').forEach(button => {
                if (button.dataset.category === savedCategory) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        } else {
            loadAllPizzas();
        }

        // Обробники подій на кнопках категорій
        document.querySelectorAll('.category').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                localStorage.setItem('selectedCategory', category);
                loadPizzasByCategory(category);
                document.querySelectorAll('.category').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
        });

        clearCartButton.addEventListener('click', clearCart);
    }

    // Для створення картки для піци
    function createPizzaCard(pizza) {
        const card = document.createElement('div');
        card.classList.add('pizza-card');

        let label = '';
        if (pizza.is_new) {
            label = `<div class="label">Нова</div>`;
        } else if (pizza.is_popular) {
            label = `<div class="label popular">Популярна</div>`;
        }

        const imgSrc = pizza.icon.replace(/\\/g, '/'); // Заміна зворотних слешів на прямі
        const sizes = pizza.small_size ? `
            <div class="sizes">
                <div class="small">
                    <p>⦰${pizza.small_size.size}</p>
                    <p>${pizza.small_size.weight}г</p>
                    <h2>${pizza.small_size.price} грн</h2>
                    <button class="buy-small" data-id="${pizza.id}" data-size="small">Купити</button>
                </div>
                <div class="large">
                    <p>⦰${pizza.big_size.size}</p>
                    <p>${pizza.big_size.weight}г</p>
                    <h2>${pizza.big_size.price} грн</h2>
                    <button class="buy-large" data-id="${pizza.id}" data-size="large">Купити</button>
                </div>
            </div>` : `
            <div class="sizes">
                <div class="large">
                    <p>⦰${pizza.big_size.size}</p>
                    <p>${pizza.big_size.weight}г</p>
                    <h2>${pizza.big_size.price} грн</h2>
                    <button class="buy-large" data-id="${pizza.id}" data-size="large">Купити</button>
                </div>
            </div>`;

        const content = Object.values(pizza.content).flat();

        card.innerHTML = `
            <div class="meat-pizza">
                ${label}
                <img src="${imgSrc}" alt="${pizza.title}">
                <h2>${pizza.title}</h2>
                <p>${content.join(', ')}</p>
                ${sizes}
            </div>`;

        pizzaMenu.appendChild(card);

        card.querySelectorAll('.buy-small, .buy-large').forEach(button => {
            button.addEventListener('click', () => {
                const size = button.dataset.size;
                addToCart(pizza.id, size);
            });
        });
    }

    // Для завантаження відфільтрованих піц
    function loadPizzas(pizzas) {
        pizzaMenu.innerHTML = '';
        pizzas.forEach(createPizzaCard);
        numOfPizza.textContent = pizzas.length;
    }

    // Функція для завантаження піц за категорією
    function loadPizzasByCategory(category) {
        let filteredPizzas;

        if (category === 'all') {
            filteredPizzas = pizzaInfo;
        } else if (category === 'З ананасами') {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.pineapple && pizza.content.pineapple.length > 0);
        } else if (category === 'З грибами') {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.mushroom && pizza.content.mushroom.length > 0);
        } else if (category === 'З морепродуктами') {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.content.ocean && pizza.content.ocean.length > 0);
        } else {
            filteredPizzas = pizzaInfo.filter(pizza => pizza.type === category);
        }

        loadPizzas(filteredPizzas);
    }

    // Функція для завантаження всіх піц 
    function loadAllPizzas() {
        loadPizzas(pizzaInfo);
        numOfPizza.textContent = pizzaInfo.length;
    }

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(pizzaId, size) {
        const pizzaKey = `${pizzaId}-${size}`;
        if (cart[pizzaKey]) {
            cart[pizzaKey].quantity += 1;
        } else {
            const pizza = pizzaInfo.find(p => p.id === pizzaId);
            cart[pizzaKey] = {
                pizza,
                size,
                quantity: 1
            };
        }
        saveCartToLocalStorage();
        updateCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        Object.keys(cart).forEach(pizzaKey => {
            const cartItem = cart[pizzaKey];
            const sizeInfo = cartItem.size === 'small' ? cartItem.pizza.small_size : cartItem.pizza.big_size;
            total += sizeInfo.price * cartItem.quantity;
            totalItems += cartItem.quantity;

            const cartItemElement = document.createElement('li');
            cartItemElement.classList.add('cart-item');

            cartItemElement.innerHTML = `
                <div class="elements">
                    <h3>${cartItem.pizza.title} (${cartItem.size === 'small' ? 'Мала' : 'Велика'})</h3>
                    <div class="prop">
                        <img src="images/size-icon.svg" alt="">
                        <span>${sizeInfo.size}</span>
                        <img src="images/weight.svg" alt="">
                        <span>${sizeInfo.weight}</span>
                    </div>
                    <div class="changing-elements">
                        <p>${sizeInfo.price} грн</p>
                        <div class="change">
                            <button class="minus" data-key="${pizzaKey}">-</button>
                            <span class="quantity">${cartItem.quantity}</span>
                            <button class="plus" data-key="${pizzaKey}">+</button>
                        </div>
                        <button class="delete" data-key="${pizzaKey}">✖</button>
                    </div>
                </div>
                <img class="boughtPizza" src="${cartItem.pizza.icon.replace(/\\/g, '/')}" alt="${cartItem.pizza.title}">
            `;

            cartItems.appendChild(cartItemElement);

            cartItemElement.querySelector('.minus').addEventListener('click', () => {
                decreaseQuantity(pizzaKey);
            });

            cartItemElement.querySelector('.plus').addEventListener('click', () => {
                increaseQuantity(pizzaKey);
            });

            cartItemElement.querySelector('.delete').addEventListener('click', () => {
                removeFromCart(pizzaKey);
            });
        });

        cartTotal.textContent = `${total} грн`;
        document.querySelector('.nBought').textContent = totalItems;
    }

    function decreaseQuantity(pizzaKey) {
        if (cart[pizzaKey].quantity > 1) {
            cart[pizzaKey].quantity -= 1;
        } else {
            delete cart[pizzaKey];
        }
        saveCartToLocalStorage();
        updateCart();
    }

    function increaseQuantity(pizzaKey) {
        cart[pizzaKey].quantity += 1;
        saveCartToLocalStorage();
        updateCart();
    }

    function removeFromCart(pizzaKey) {
        delete cart[pizzaKey];
        saveCartToLocalStorage();
        updateCart();
    }

    function clearCart() {
        cart = {};
        saveCartToLocalStorage();
        updateCart();
    }
});