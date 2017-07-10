// Cart Constructor
// gets the old cart when adding (first time the oldCart is an empty object)
// assign values of the old cart
// add a new item (check if it exists), increase quantity, price, totalQty, totalPrice

module.exports = function Cart(oldCart) {       // add old cart into new cart
    // gather data from the old cart
    this.items = oldCart.items || [];           // an object, stored with product id
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    // adding new item to the cart
    this.add = function(item) {
        this.items.push(item);
        this.totalQty += item.qty;
        this.totalPrice += item.price;
    };

    // remove item
    this.removeItem = function(index) {
        this.totalQty -= this.items[index].qty;
        this.totalPrice -= this.items[index].price;
        this.items.splice(index, 1);
    };
};