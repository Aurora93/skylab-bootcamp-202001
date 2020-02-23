module.exports = function ( props = {}) {
    const { query, vehicle: { id, name, year, price, image, color, maker, collection, description, isFav }} =props
    return `<li>
        <a href='/search?query=${query}'>BACK</a>
        <h3> ${name} (${year}) ${isFav ? `<form action ="vehicle/fav/${id}" method ="GET"><input type ="hidden"><button>💖</button></form>`: `<form action ="fav/${id}" method ="GET"><input type ="hidden"><button>🤍</button></form>`}</h3>
        <img src=${image} />
        <span>${price} €</span>
        <p>${color}</p>
        <p>${maker}</p>
        <p>${collection}</p>
        <p>${description}</p>
    </li>`
}