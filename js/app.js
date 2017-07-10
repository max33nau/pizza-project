var pizzaDom = {
  $base: $('#main-pizza'),
  $details: $('.pizza-details'),
  $noPizza: $('#no-pizza-size')
}

$(document).ready(function(){


  $('[data-toggle="tooltip"]').tooltip();

  $('#pizza-size-header').click(function() {
    toggleDisaplayOfInputs('size');
  });
  $('#pizza-sauce-header').click(function() {
    toggleDisaplayOfInputs('sauce');
  });
  $('#pizza-crust-header').click(function() {
    toggleDisaplayOfInputs('crust');
  });
  $('#pizza-cheese-header').click(function() {
    toggleDisaplayOfInputs('cheese');
  });

  $('#pizza-toppings-header').click(function() {
    toggleDisaplayOfInputs('toppings');
  });

  $('.pizza-input-size').click(function() {
    var pizzaSize = $(this)[0].value;
    var pizzaDetails = getPizzaSizeDetails(pizzaSize);
    pizzaDom.$base.css('width', pizzaDetails.size.width)
      .css('height', pizzaDetails.size.height);
    $('.pizza-topping-image').css('max-width', pizzaDom.$base.css('width'));
    pizzaDom.$details.show();
    pizzaDom.$noPizza.hide();
    setSingleInputPizza('final-pizza-size', 'Pizza Size:  ' + pizzaDetails.description, pizzaDetails.price);
    getTotalPrice();
  });

  $('.pizza-input-sauce').click(function() {
    var pizzaSauce = $(this)[0].value;
    var pizzaDetails = getPizzaSauceDetails(pizzaSauce);
    setSingleInputPizza('final-pizza-sauce', 'Pizza Sauce:  ' + pizzaDetails.description, 'FREE' );
    pizzaDom.$base.css('background-color', pizzaDetails.color);
  });

  $('.pizza-input-cheese').click(function() {
    var pizzaCheese = $(this)[0].value;
    var pizzaDetails = getPizzaCheeseDetails(pizzaCheese);
    setSingleInputPizza('final-pizza-cheese', pizzaDetails.description, pizzaDetails.price );
    $('.cheese-overlay-img').hide();
    if(pizzaDetails.imgId) {
      $('#'+pizzaDetails.imgId).show();
    }
    getTotalPrice();
  });

  $('.pizza-input-crust').click(function() {
    var pizzaCrust = $(this)[0].value;
    var pizzaDetails = getPizzaCrustDetails(pizzaCrust);
    setSingleInputPizza('final-pizza-crust', pizzaDetails.description, pizzaDetails.price );
    getTotalPrice();
  });

  var checksClicked = 10;
  var totalMeatToppings = 0;
  $('.meat-topping-input').click(function() {
    var topping = $(this)[0];
    var price = 'FREE';
    if(topping.checked) {
      checksClicked++;
      totalMeatToppings++;
    } else {
      totalMeatToppings--;
    }
    if(totalMeatToppings > 1) { price = totalMeatToppings - 1; }
    setSingleInputPizza('final-pizza-meat', 'Meat Toppings (First one is free)', price);
    appendPizzaTopping('final-pizza-meat', 'meat', topping.labels[0].innerText, topping.checked,checksClicked);
    if(totalMeatToppings === 0) {
      $('#final-pizza-meat').hide();
    } else {
      $('#final-pizza-meat').show();
    }
    getTotalPrice();
  });

  var totalVeggieToppings = 0;
  $('.veggie-topping-input').click(function() {
    var topping = $(this)[0];
    var price = 'FREE';
    if(topping.checked) {
      checksClicked++;
      totalVeggieToppings++;
    } else {
      totalVeggieToppings--;
    }
    if(totalVeggieToppings > 1) { price = totalVeggieToppings - 1; }
    setSingleInputPizza('final-pizza-veggie', 'Veggie Toppings (First one is free)', price);
    appendPizzaTopping('final-pizza-veggie', 'veggie', topping.labels[0].innerText, topping.checked, checksClicked);
    if(totalVeggieToppings === 0) {
      $('#final-pizza-veggie').hide();
    } else {
      $('#final-pizza-veggie').show();
    }
    getTotalPrice();
  });

  $('#pizza-size-header').click();
  $('#init-pizza').click();
  $('#checkout').click(function() {
    var confirm = window.confirm('You are about to buy your pizza for '+ $('#total-price').text() + '\n Are you sure you want to order it?');
    if(confirm) {
      alert('Awesome, your pizza is on its way!');
    }
  });


});

function setSingleInputPizza(id, desc, price) {
  var $id = $('#'+id);
  if($id.length !== 0) {
    $id.find('.total-description').text(desc);
    if(price.toString().toLowerCase() === 'free') {
        $id.find('.total-input-price').text(price);
    } else {
      $id.find('.total-input-price').text(convertPriceToText(price));
    }
  } else {
    var newPizzaList = '<li class="list-group-item" id='+id+'>' +
    '  <span class="total-description"> </span>' +
    '  <span class="total-input-price"> </span>' +
    '</li>';
    $('#final-price').before(newPizzaList);
    return setSingleInputPizza(id, desc, price);
  }
}

function appendPizzaTopping(container, type, name, checked, clicks) {
  var id = 'final-pizza-topping-list-'+type;
  var listContainer = $('#'+id);
  if(listContainer.length === 0) {
    $('#'+container).append('<ul id="'+id+'">' + '</ul>');
    return appendPizzaTopping(container, type, name, checked);
  } else {
    var listId = 'list-topping-final-'+ name.replace(' ', '-');
    var imageId = name.replace(' ', '').toLowerCase()+'-img';
    var $imageId = $('#'+ imageId);
    if($imageId.length === 0) {
      var image = '<img src="./assets/images/'+name.replace(' ','').toLowerCase()+
        '.png" id="'+imageId+'" class="pizza-topping-image" />'
      $('#main-pizza').append(image);
      $imageId = $('#'+ imageId);
      $('.pizza-topping-image').css('max-width', pizzaDom.$base.css('width'));
    }
    if(checked) {
      $imageId.show();
      if(!clicks) { clicks = 10;}
      $imageId.css('z-index', clicks);
      listContainer.append('<li id="'+listId+'"> '+ name +'</li>');
    } else {
      $('#'+listId).remove();
      $imageId.hide();
    }
  }
}


function toggleDisaplayOfInputs(type) {
  if ( $('#pizza-'+type+'-inputs').css('display') == 'none' ){
    $('#pizza-'+type+'-inputs').show();
    $('#pizza-'+type+'-header').find('.fa-angle-down').show()
    $('#pizza-'+type+'-header').find('.fa-angle-right').hide();
  } else {
    $('#pizza-'+type+'-inputs').hide();
    $('#pizza-'+type+'-header').find('.fa-angle-down').hide()
    $('#pizza-'+type+'-header').find('.fa-angle-right').show();
  }
}

function getPizzaSizeDetails(size) {
  var pizzaSizes = {
    'sm': {
      description: 'Small',
      size: { width: '300px', height: '300px' },
      price: 6.00
    },
    'md': {
      description: 'Medium',
      size: { width: '350px', height: '350px' },
      price: 10.00
    },
    'lg': {
      description: 'Large',
      size: { width: '400px', height: '400px'},
      price: 14.00
    },
    'xl': {
      description: 'Extra Large',
      size: { width: '450px', height: '450px' },
      price: 16.00
    }
  }
  return pizzaSizes[size];
}

function getPizzaSauceDetails(sauce) {
  var sauces = {
    'marinara': {
      description: 'Marinara',
      color: 'red'
    },
    'white': {
      description: 'White Sauce',
      color: 'white'
    },
    'bbq': {
      description: 'Barbeque Sauce',
      color: '#c75a57'
    },
    'none': {
      description: 'No Sauce',
      color: '#f0e0c4'
    }
  }
  return sauces[sauce];
}

function getPizzaCheeseDetails(cheese) {
  var cheeses = {
    'reg': {
      imgId: 'cheese-img',
      description: 'Regular Cheese',
      price: 'FREE'
    },
    'extra': {
      imgId: 'extra-cheese-img',
      description: 'Extra Cheese',
      price: 3.00
    },
    'none': {
      description: 'No Cheese',
      price: 'FREE'
    }
  }
  return cheeses[cheese];
}

function getPizzaCrustDetails(crust) {
  var crusts = {
    'plain': {
      description: 'Plain Crust',
      price: 'FREE'
    },
    'garlic': {
      description: 'Garlic Crust',
      price: 'FREE'
    },
    'cheese': {
      description: 'Cheese Stuffed Crust',
      price: 3.00
    },
    'spicy': {
      description: 'Spicy Crust',
      price: 'FREE'
    },
    'special': {
      description: 'Special Crust',
      price: 'FREE'
    }
  }
  return crusts[crust];
}

function convertPriceToText(price) {
  price = price.toString();
  if(price.indexOf('.') !== -1) {
    return '$' + price;
  } else {
    return '$' + price + '.00';
  }
}

function getTotalPrice() {
  var totalPrice = 0;
  $('.total-input-price').each(function() {
    var priceText = $(this).text();
    if(priceText.toLowerCase() !== 'free') {
      var price = priceText.split('$')[1];
      totalPrice += Number(price);
    }
  });
  $('#total-price').text(convertPriceToText(totalPrice));
}
