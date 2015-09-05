


//Navigation
var getElement = function(id){
  return document.getElementById(id);
};


var viewsend = getElement("viewsend");
var viewtransactions = getElement("viewtransactions");
var send = getElement("send");
var transactions = getElement("transactions");
var recipient = getElement("sendTo");

var hideDisplay = function(whichDisplay){
  whichDisplay.style.display = "none";
};


//Initialize 
hideDisplay(send);
hideDisplay(transactions);
hideDisplay(getElement("errorFormat"));
hideDisplay(getElement("errorEmpty"));

var showDisplay = function(input){
  document.getElementById(input).style.display = "";
};

recipient.addEventListener("focusin", function(){
  console.log(this);
  var errors = document.getElementsByClassName("empty");
  var error = Array.prototype.forEach.call(errors, function(errorEl){
     hideDisplay(errorEl);
  });
});


viewsend.addEventListener("click", function(){
  hideDisplay(this.parentNode);
  showDisplay("send");
});

viewtransactions.addEventListener("click", function(){
  hideDisplay(this.parentNode);
  showDisplay("transactions");
});


//Form validation

function formValidation (){
  //Assume true
  var isValid = true;


  var money = getElement("money");
  var payment_cat = getElement("payment_type");
  var check = checkEmail();
  console.log(check);
  return check;
}

function checkEmail (){
  //check if empty
  if(recipient.value === ""){
    console.log("errorEmpty");
    showDisplay("errorEmpty");
    return false;
  }
  //check if invalid email
  var EMAIL_REGEX = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  if(!EMAIL_REGEX.test(recipient.value)){
    EMAIL_REGEX.test(recipient.value);
    console.log("errorFormat");
    showDisplay("errorFormat");
    return false;
  }
  return true;
}

