const pizzaInfo = [
    {
        id:1,
        icon:'images\\Impresa.jpg',
        title: "Імпреза",
        type: 'М’ясна піца',
        content: {
            meat: ['балик', 'салямі'],
            chicken: ['куриця'],
            cheese: ['сир моцарелла', 'сир рокфорд'],
            pineapple: ['ананаси'],
            additional: ['томатна паста', 'петрушка']
        },
        small_size:{
            weight: 370,
            size: 30,
            price: 99
        },
        big_size:{
            weight: 660,
            size: 40,
            price: 169
        },
        is_new:true,
        is_popular:true

    },
    {
        id:2,
        icon:'images\\BBQ.jpg',
        title: "BBQ",
        type: 'М’ясна піца',
        content: {
            meat: ['мисливські ковбаски', 'ковбаски папероні', 'шинка'],
            cheese: ['сир домашній'],
            mushroom: ['шампінйони'],
            additional: ['петрушка', 'оливки']
        },
        small_size:{
            weight: 460,
            size: 30,
            price: 139
        },
        big_size:{
            weight: 840,
            size: 40,
            price: 199
        },
        is_popular:true
    },
    {
        id:3,
        icon:'images\\mix.jpg',
        title: "Міксовий поло",
        type: 'М’ясна піца',
        content: {
            meat: ['вітчина', 'куриця копчена'],
            cheese: ['сир моцарелла'],
            pineapple: ['ананаси'],
            additional: ['кукурудза', 'петрушка', 'соус томатний']
        },
        small_size:{
            weight: 430,
            size: 30,
            price: 115
        },
        big_size:{
            weight: 780,
            size: 40,
            price: 179
        }
    },
    {
        id:4,
        icon:'images\\siciliano.jpg',
        title: "Сициліано",
        type: 'М’ясна піца',
        content: {
            meat: ['вітчина', 'салямі'],
            cheese: ['сир моцарелла'],
            mushroom: ['шампінйони'],
            additional: ['перець болгарський',  'соус томатний']
        },
        small_size:{
            weight: 450,
            size: 30,
            price: 111
        },
        big_size:{
            weight: 790,
            size: 40,
            price: 169
        }
    },
    {
        id:5,
        icon:'images\\margarita.jpg',
        title: "Маргарита",
        type: 'Вега піца',
        content: {
            cheese: ['сир моцарелла', 'сир домашній'],
            tomato: ['помідори'],
            additional: ['базилік', 'оливкова олія', 'соус томатний']
        },
        small_size:{
            weight: 370,
            size: 30,
            price: 89
        },
        big_size:{
            weight: 790,
            size: 40,
            price: 169
        }
    },
    {
        id:6,
        icon:'images\\mixTastes.jpg',
        title: "Мікс смаків",
        type: 'М’ясна піца',
        content: {
            meat: ['ковбаски'],
            cheese: ['сир моцарелла'],
            mushroom: ['шампінйони'],
            pineapple: ['ананаси'],
            additional: ['цибуля кримська', 'огірки квашені', 'соус гірчичний']
        },
        small_size:{
            weight: 470,
            size: 30,
            price: 115
        },
        big_size:{
            weight: 780,
            size: 40,
            price: 180
        }
    },
    {
        id:7,
        icon:'images\\dolceMare.jpg',
        title: "Дольче Маре",
        type: 'Морська піца',
        content: {
            ocean: ['криветки тигрові', 'мідії', 'ікра червона', 'філе червоної риби'],
            cheese: ['сир моцарелла'],
            additional: ['оливкова олія', 'вершки']
        },
        big_size:{
            weight: 845,
            size: 40,
            price: 399
        }
    },
    {
        id:8,
        icon:'images\\rossoGusto.jpg',
        title: "Россо Густо",
        type: 'Морська піца',
        content: {
            ocean: ['ікра червона', 'лосось копчений'],
            cheese: ['сир моцарелла'],
            additional: ['оливкова олія', 'вершки']
        },
        small_size:{
            weight: 400,
            size: 30,
            price: 189
        },
        big_size:{
            weight: 700,
            size: 40,
            price: 299
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const pizzaMenu = document.getElementById('pizza-menu');
    const numOfPizza = document.querySelector('.numOfPizza');
    const savedCategory = localStorage.getItem('selectedCategory');

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

//  Для створення картки для піци
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
        console.log(numOfPizza);
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

    
        
});
