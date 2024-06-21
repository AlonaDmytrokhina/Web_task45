document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    let cartData = [];

    if (savedCart) {
        const cart = JSON.parse(savedCart);
        Object.keys(cart).forEach(key => {
            const item = cart[key];
            cartData.push({
                "Піца": item.pizza.title,
                "Розмір": item.size === 'small' ? 'Мала' : 'Велика',
                "Ціна": item.size === 'small' ? item.pizza.small_size.price : item.pizza.big_size.price,
                "Кількість": item.quantity
            });
        });
    }

    new WebDataRocks({
        container: "#report-container",
        toolbar: true,
        report: {
            dataSource: {
                data: cartData
            },
            slice: {
                rows: [
                    { uniqueName: "Піца" }
                ],
                columns: [
                    { uniqueName: "Розмір" }
                ],
                measures: [
                    { uniqueName: "Кількість"},
                    { uniqueName: "Ціна"}
                ]
            }
        }
    });
});