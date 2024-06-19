document.addEventListener('DOMContentLoaded', () => {
    const pizzaMenu = document.getElementById('pizza-menu');
    const numOfPizza = document.querySelector('.numOfPizza');
    const savedCategory = localStorage.getItem('selectedCategory');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const pizzaInfo = data;

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
                            <button class="buy-small">Купити</button>
                        </div>
                        <div class="large">
                            <p>⦰${pizza.big_size.size}</p>
                            <p>${pizza.big_size.weight}г</p>
                            <h2>${pizza.big_size.price} грн</h2>
                            <button class="buy-large">Купити</button>
                        </div>
                    </div>` : `
                    <div class="sizes">
                        <div class="large">
                            <p>⦰${pizza.big_size.size}</p>
                            <p>${pizza.big_size.weight}г</p>
                            <h2>${pizza.big_size.price} грн</h2>
                            <button class="buy-large">Купити</button>
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
        })
        .catch(error => console.error('Error loading data:', error));
});