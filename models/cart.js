// Cart Constructor
// gets the old cart when adding (first time the oldCart is an empty object)
// assign values of the old cart
// add a new item (check if it exists), increase quantity, price, totalQty, totalPrice


module.exports = function Cart(oldCart) {       // add old cart into new cart
    // gather data from the old cart
    this.items = oldCart.items || {};           // an object, stored with product id
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    // adding new item to the cart
    this.add = function(item, id) {
        // check if the item is already in the cart
        var storedItem = this.items[id];
        // if not, make a new entry
        if(!storedItem) {
            storedItem = this.items[id] = {item: item};
        }
        // after making a new entry, or if it already is in the cart
        this.totalQty += storedItem.item.qty;
        this.totalPrice += storedItem.item.price;
    };

    // update item
    this.update = function(id, persons) {
        // remove item qty from totalQty
        this.totalQty -= this.items[id].item.qty;
        // remove item price from totalPrice
        this.totalPrice -= this.items[id].item.price;
        // convert persons from string value to number
        persons.adult = Number(persons.adult);
        persons.senior = Number(persons.senior);
        persons.child = Number(persons.child);
        // sum new item qty
        var qty = persons.adult + persons.senior + persons.child;
        // reset item qty with new qty value
        this.items[id].item.qty = qty;
        // add new item qty back into totalQty
        this.totalQty += qty;
        // overwrite cart item's persons with updated values
        this.items[id].item.persons = persons;
        // calculate new price for persons in cart item
        var comboProduct = this.items[id].item.comboProduct;
        var price = (persons.adult * comboProduct.adult) + (persons.senior * comboProduct.senior) + (persons.child * comboProduct.child);
        // update cart item's price
        this.items[id].item.price = price;
        // update total price of cart
        this.totalPrice += price;
        // if user zeroed out item quantity then delete item from cart
        if(this.items[id].item.qty === 0) {
            delete this.items[id];
        }
    };

    // remove item
    this.removeItem = function(id) {
        this.totalQty -= this.items[id].item.qty;
        this.totalPrice -= this.items[id].item.price;
        delete this.items[id];
    };

    // transform it into an array for lists etc.
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};