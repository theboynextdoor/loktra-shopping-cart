import React, { Component } from 'react';
import logo from './logo.svg';
import CartStorage from './CartStorage';
import PlusMinusButton from './PlusMinusButton';
import CartItems from './CartItems';
import Products from './Products';
import CartIcon from './CartIcon'; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      isProductsLoaded: false,
      isCartDisplay: false
    };
    this.cartName = 'cart';
    this.localCartStorage = new CartStorage({name: this.cartName});
   
    this.handleChangeNumberField = this.handleChangeNumberField.bind(this);
    this.handleClickMinusButton = this.handleClickMinusButton.bind(this);
    this.handleClickPlusButton = this.handleClickPlusButton.bind(this);
    this.handleClickRemoveButton = this.handleClickRemoveButton.bind(this);
    this.appendProductToCart = this.appendProductToCart.bind(this);
    this.toggleCart = this.toggleCart.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      isProductsLoaded: true,
      products: [
      {
        "id": "5b5a294fbf63ef80275f2fa3",
        "picture": "http://placehold.it/85x100",
        "name": "Comvex",
        "alt": "Ezent",
        "price": 11.8
      },
      {
        "id": "5b5a294f29824c3215be744f",
        "picture": "http://placehold.it/85x100",
        "name": "Infotrips",
        "alt": "Eventex",
        "price": 9.05
      },
      {
        "id": "5b5a294f6aeb53462f4a2052",
        "picture": "http://placehold.it/85x100",
        "name": "Zytrex",
        "alt": "Pulze",
        "price": 4.04
      },
      {
        "id": "5b5a294ff9843844b196a127",
        "picture": "http://placehold.it/85x100",
        "name": "Eventage",
        "alt": "Andryx",
        "price": 18.13
      },
      {
        "id": "5b5a294fcc486b36b7c55d06",
        "picture": "http://placehold.it/85x100",
        "name": "Unisure",
        "alt": "Papricut",
        "price": 13.91
      },
      {
        "id": "5b5a294fde05d454472d3d4c",
        "picture": "http://placehold.it/85x100",
        "name": "Digique",
        "alt": "Fleetmix",
        "price": 1.59
      }
    ]
    }); 
    
    // this.addTwoItemsToCartStorage();
    this.hydrateStateWithLocalStorage();
    window.addEventListener("beforeunload", this.saveStateToLocalStorage.bind(this));

  }
  
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveStateToLocalStorage.bind(this));
  
    this.saveStateToLocalStorage();

  }
  
  saveStateToLocalStorage() {
    localStorage.setItem(this.cartName, JSON.stringify(this.state.cart));
  }
  
  hydrateStateWithLocalStorage() {
    let cartName = this.cartName; 
    if(localStorage.hasOwnProperty(cartName)) {
      let cartItems = JSON.parse(localStorage.getItem(cartName)); 
      
      this.setState({
        cart: cartItems
      });
    }

  }
  
  // For mock purposes
  addTwoItemsToCartStorage() {
    this.localCartStorage.addItem({id: '5b5a294fde05d454472d3d4c', quantity: 3});
    this.localCartStorage.addItem({id: '5b5a294fcc486b36b7c55d06', quantity: 2});
  }
  
  decrementQuantity(item, num) {
    item = {
      ...item, 
      quantity: item.quantity - num
    };
    
    return item; 
  }
  
  incrementQuantity(item, num) {
    item = {
      ...item, 
      quantity: item.quantity + num
    };
    
    return item; 
  }
  
  
  handleChangeNumberField(id, userInput) {
    let cart = this.state.cart.map((item) => {
      if (item.id === id ) {
        item.quantity = (parseInt(userInput, 10) < 1) ? 1 : parseInt(userInput, 10); 
      }
      return item; 
    });
  
    this.setState({
      cart: cart 
    });
  }
  
  handleClickMinusButton(id) {
    let cart = this.state.cart.map((item) => {
      if (item.id === id && item.quantity > 1) {
        item = this.decrementQuantity(item, 1); // decrementQuantityByOne
      }
      
      return item; 
    });
    
    this.setState({
      cart: cart
    });
    
    localStorage.setItem(this.cartName, JSON.stringify(cart));
  }
  
  handleClickPlusButton(id) {
    let cart = this.state.cart.map((item) => {
      if (item.id === id) {
        item = this.incrementQuantity(item, 1); // decrementQuantityByOne
      }
      
      return item; 
    });
    
    this.setState({
      cart: cart
    });
    
    localStorage.setItem(this.cartName, JSON.stringify(cart));

  }
  
  handleClickRemoveButton(id) {
    let cart = this.state.cart.filter((item) => item.id !== id);
    this.setState({
      cart: cart
    });
    
    localStorage.setItem(this.cartName, JSON.stringify(cart));

  }
  
  getProduct(id) {
    return this.state.products.find(item => item.id === id) || {};
  }
  
  getUserCart() {
    let userCart = this.state.cart.map((item) => {
      return {
        ...this.getProduct(item.id), 
        quantity: item.quantity
      };
    });

    return userCart || []; 
  }
  

  appendProductToCart(id) {
    var quantity = 2; // for testing purposes only
    var cart = this.state.cart;
    var NOTFOUND = -1; 
    var found = cart.findIndex((cartItem) => cartItem.id === id);
    
    if (found === NOTFOUND) {
      cart.push({id: id, quantity: quantity}); 
    } else {
      cart[found].quantity += quantity; 
    }
    
    this.setState({
      cart: cart
    });
    
    localStorage.setItem(this.cartName, JSON.stringify(cart));

  }
  
  cartTotal() {
    let userCart = this.getUserCart(); 
    
    return userCart.reduce(
      (acc, currentValue) => acc + (currentValue.quantity * currentValue.price)
    , 0).toFixed(2);
  }
  
  toggleCart() {
    this.setState({
      isCartDisplay: !this.state.isCartDisplay
    });
  }
  
  render() {
    let userCart = this.getUserCart(); 
    return (
      <div class="app">
        <a href="#" className="" onClick={this.toggleCart}>
            <div className="cart-summary">
              <span className="cart-summary__value">${this.cartTotal()}</span>
              <CartIcon counter={this.state.cart.length} />
            </div>
        </a>
        {this.state.isProductsLoaded ? (
          <Products productList={this.state.products} onClick={this.appendProductToCart} />
          ) : (
            <h1> No Products </h1>
          )
        }
      
      { this.state.isCartDisplay ? (
      <aside className="cart">
        <div className="cart__header">
          <p>My Cart ({userCart.length})</p>
          <button className="close-cart"><img src="img/times-solid.svg" /></button>
        </div>
        <CartItems
          cartItems={userCart}
          onClickMinusButton={this.handleClickMinusButton}
          onClickRemoveButton={this.handleClickRemoveButton}
          onChangeNumberField={this.handleChangeNumberField}
          onClickPlusButton={this.handleClickPlusButton}
        />
        <div className="btn-container">
          <button className="btn btn--primary">Place Order</button>
        </div>
      </aside> 
      ) : (
        null
      )} 
      </div>
    );
  }
}

export default App;
