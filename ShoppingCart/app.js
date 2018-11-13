/** ===== OBJECTS ===== */

// Item Object
var Item= function(name,price) {
    
    this.name= name, this.price= price;

    this.getPrice= function() { return this.price; };
};

// Category Object
var Category= function(name) {
    
    this.name= name, this.catArray= [], this.size= 0;

    this.addItem= function(itemName,price) {
        var toAddItem= {
            img: `imgs/${this.name}/${itemName}.jpg`,
            name: itemName.charAt(0).toUpperCase()+itemName.slice(1),
            price: `${price}`
        };
        this.catArray.push(toAddItem);
        this.size++;
    };

    this.getItems= function() { return this.catArray; };

    this.getItemAt= function(index) {
        if (index<0 || index>=this.size) return null;
        return this.catArray[index];
    };
}

// ShoppingCart Object
var ShoppingCart= function() {
    
    this.cart= [], this.size= 0, this.total= 0;

    this.addItem= function(obj) {
        this.cart.push(obj);
        this.total+= obj.getPrice();
        this.size++;
    };

    this.removeItem= function(index) {
        if (index<0 || index>=this.size) { return; }
        var toDelete= this.cart.splice(index,1)[0];
        this.total-= toDelete.getPrice();
        this.size--;
    };
 
    this.getSize= function() { return this.size; };

    this.getTotal= function() { return this.total.toFixed(2); };
};

/** ===== FUNCTIONS ===== */

// create Category
function createCategory(category) {

    var catName= category.name;

    // create navbar button
    var navbar= document.getElementById('navbar');
    var navButton= document.createElement('button');
    navButton.setAttribute('name','btn-'+catName);
    navButton.setAttribute('type','button');
    navButton.setAttribute('class','category');
    navButton.innerHTML= catName.charAt(0).toUpperCase()+catName.slice(1);
    navbar.appendChild(navButton);

    // create Category div
    var divCategory= document.createElement('div');
    divCategory.setAttribute('name','div-'+catName);
    divCategory.setAttribute('class','category-panel');
    
    // create category div container
    var divContainer= document.createElement('div');
    divContainer.setAttribute('class','category-container');

    // populate category items to the div
    var categoryItems= category.getItems();
    for (var i=0;i<categoryItems.length;i++) {
        // add item as article
        var article= document.createElement('article');
        // add image
        var img= document.createElement('img');
        img.setAttribute('src',categoryItems[i].img);
        article.appendChild(img);
        // add text and price
        var text= document.createElement('p');
        var price= document.createElement('p');
        text.innerHTML= categoryItems[i].name;
        price.innerHTML= '$'+categoryItems[i].price;
        // append text and price to item
        article.appendChild(text);
        article.appendChild(price);
        divContainer.appendChild(article);
    }
    // add the div to html
    divCategory.appendChild(divContainer);
    document.getElementsByTagName('section')[0].appendChild(divCategory);
}


/** ===== initiate variables ===== **/

var itemsValues= [['water','0.99'],['tea','1.99'],['coffee','2.99'],['milk','1.99'],['cola','0.99'],['beer','1.59']];
var drinks= new Category('drinks');
for (var i=0;i<itemsValues.length;i++) {
    drinks.addItem(itemsValues[i][0],itemsValues[i][1]);
}

var itemsValues= [['apple','0.59'],['banana','0.19'],['blackberry','3.99'],['coconut','1.99'],['kiwi','0.99'],['lemon','0.29'],['orange','0.69']];
var fruits= new Category('fruits');
for (var i=0;i<itemsValues.length;i++) {
    fruits.addItem(itemsValues[i][0],itemsValues[i][1]);
}

var itemsValues= [['beef','9.99'],['chicken','5.99'],['pork','7.99'],['lamb','9.99'],['turkey','6.99']];
var meat= new Category('meat');
for (var i=0;i<itemsValues.length;i++) {
    meat.addItem(itemsValues[i][0],itemsValues[i][1]);
}

// create categories
createCategory(drinks);
createCategory(fruits);
createCategory(meat);

/** ===== create HTML DOM elements ===== **/

// create event listener for category button click
var buttons= document.getElementsByClassName('category');
for (var i=0;i<buttons.length;i++) {
    buttons[i].addEventListener('click',function(i){

        // get the current name of selected and this items
        var currActiveNav= document.getElementsByClassName('selected')[0];
        var currActiveDiv= document.getElementsByClassName('active')[0];
        var name= this.name;

        // hide the panels
        if (currActiveNav!=null && currActiveDiv!=null) {
            currActiveNav.className= currActiveNav.className.replace(' selected','');
            currActiveDiv.className= currActiveDiv.className.replace(' active','');
        }

        // change selected category to active
        this.className+= ' selected';
        document.getElementsByName(name.replace('btn','div'))[0].className+= ' active';
    });
}

// create shopping cart
var shoppingCart= new ShoppingCart();

// create event listener for adding items to shopping cart
var cartContainerUL= document.querySelector('.cart-container').querySelector('ul');
var cartSize= document.querySelector('.cart-size');
var cartPrice= document.querySelector('.cart-price');

var itemsList= document.getElementsByTagName('article');
//var items= [];
for (var i=0;i<itemsList.length;i++) {
    (function () {
    
    //retrieve <p> tags for name and price
    var pTag= itemsList[i].getElementsByTagName('p');
    var itemName= pTag[0].innerHTML;
    var itemPrice= parseFloat(pTag[1].innerHTML.replace('$',''));
    
    // create new item object and push to list
    var newItem= new Item(itemName,itemPrice);
    //items.push(newItem);
    
    // for each object create a click event function
    itemsList[i].addEventListener('click',function(){
        
        // add item to cart
        shoppingCart.addItem(newItem);
        
        // create new element to append to cart
        var li= document.createElement('li');
        var newItemInCart= document.createElement('p');
        var button= document.createElement('button');
        
        button.setAttribute('type','button');
        button.innerHTML= 'Remove';
        button.addEventListener('click',function(curNode){
            // find parentNode and current index
            var parent= this.parentNode;
            var index= Array.prototype.indexOf.call(parent.parentNode.children, parent);
            // remove from shopping cart and its html
            shoppingCart.removeItem(index);
            parent.parentNode.removeChild(parent);
            // change the innerHTML for the cart display
            var size= shoppingCart.getSize();
            cartSize.innerHTML= size>0? 'Number of items: '+size : 'Empty Cart';
            cartPrice.innerHTML= 'Total= $'+shoppingCart.getTotal();
        });
        newItemInCart.innerHTML= itemName+' $'+itemPrice;
        li.appendChild(newItemInCart);
        li.appendChild(button);
        cartContainerUL.appendChild(li);
        
        // change the innerHTML for the cart display
        cartSize.innerHTML= 'Number of items: '+shoppingCart.getSize();
        cartPrice.innerHTML= 'Total= $'+shoppingCart.getTotal();
        
    });
    }());
}



