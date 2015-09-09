//Navigation
var getElement = function(id) {
    return document.getElementById(id);
};


//package into a module the money and info.  Private variables
var home = getElement("home");
var viewsend = getElement("viewsend");
var viewtransactions = getElement("viewtransactions");
var send = getElement("send");
var transactions = getElement("transactions");
var recipient = getElement("sendTo");
var money = getElement("money");
var next = getElement("next");
var hideDisplay = function(whichDisplay) {
    console.log(whichDisplay);
    whichDisplay.style.display = "none";

};


var showDisplay = function(input) {
    document.getElementById(input).style.display = "inherit";
};


recipient.addEventListener("focusin", function() {
    var errors = document.getElementsByClassName("error");
    var error = Array.prototype.forEach.call(errors, function(errorEl) {
        hideDisplay(errorEl);
    });
});

//Ask user to update email error after field focusout
recipient.addEventListener("focusout", function() {
    checkEmail();
});

document.getElementById("moneyEx").addEventListener("focusin", function() {
    var errors = document.getElementsByClassName("errorMoney");
    var error = Array.prototype.forEach.call(errors, function(errorEl) {
        hideDisplay(errorEl);
    });
        document.getElementById("money_format").style.display = "";
});

document.getElementById("moneyEx").addEventListener("focusout", function() {
    if (validateAmount()) {
        displayMoney();
    }
});


function displayMoney() {
    var options = {
        USD: function() {
            var n = parseFloat(document.getElementById("money").value, 2);
            return n.toFixed(2).replace(/./g, function(c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
            });
        },
        EUR: function() {
            var n = parseFloat(document.getElementById("money").value, 2);
            return n.toFixed(2).replace(/\./g, ",").replace(/./g, function(c, i, a) {
                return i && c !== "," && ((a.length - i) % 3 === 0) ? '.' + c : c;
            });
        },
        JPY: function() {
            var n = Math.round(parseFloat(document.getElementById("money").value));
            console.log(n);
            return n;
        }
    };
    var sign = {
        USD: '$',
        EUR: '&euro;',
        JPY: '&#165;'
    };
    var selected = document.getElementById("currency").value;
    var money = typeof document.getElementById("money").value;
    document.getElementById("money_format").innerHTML = (sign[selected] + options[selected]());
}

//Add event listener if user changes currency
//Change money currency display
//Update value



viewsend.addEventListener("click", function() {
    hideDisplay(home);
    showDisplay("send");
});

viewtransactions.addEventListener("click", function() {
    hideDisplay(home);
    showDisplay("transactions");
});

next.addEventListener("click", function(){
    document.getElementById("preloader").style.display = "inherit";
    setTimeout(function(){
        hideDisplay(send);
        showDisplay("transactions");
    }, 2000);

});
document.getElementById("clear").addEventListener("click", function(){
    document.getElementById("sender").reset();
    var errors = document.getElementsByClassName("error");
    Array.prototype.forEach.call(errors, function(errorEl) {
        hideDisplay(errorEl);
    });
    var money_display=document.getElementById("money_format");
    money_display.innerHTML = "";
    hideDisplay(document.getElementById("money_format"));
})

//Form validation

function formValidation() {
    //Assume true
    var isValid = true;

    var money = getElement("money");
    var payment_cat = getElement("payment_type");
    var check = checkEmail();
    console.log(check);
    return check && validateAmount();
}

function validateAmount() {
    if (money.value === "") {
        showDisplay("errorAmountEmpty");
        return false;
    }
    console.log(typeof money.value);
    var MONEY_REGEX = /^[0-9](?:\d*)?(?:\.\d{0,2})?$/;
    if (!MONEY_REGEX.test(money.value)) {
        showDisplay("errorAmountMoney");
        return false;
    }
    return true;
}

function checkEmail() {
    //check if empty
    if (recipient.value === "") {
        console.log("errorEmpty");
        showDisplay("errorEmpty");
        return false;
    }
    //check if invalid email
    var EMAIL_REGEX = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    if (!EMAIL_REGEX.test(recipient.value)) {
        EMAIL_REGEX.test(recipient.value);
        console.log("errorFormat");
        showDisplay("errorFormat");
        return false;
    }
    return true;
}

var fetching = getElement("fetch");
fetching.addEventListener("click", function() {
    fetchTransactions();
});

// window.onscroll = function(){
//     console.log(window.scrollY, document.body.clientHeight, window.innerHeight, window.screenY);
//     if(window.scrollY > document.body.clientHeight - window.innerHeight){
//         fetchTransactions();
//     } else {
//         console.log('not loaded');
//         console.log(lastItem);
//     }
// };
function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', event.preventDefault, false);
    window.onwheel = event.preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = event.preventDefault; // older browsers, IE
    window.ontouchmove = event.preventDefault; // mobile
    document.onkeydown = event.preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', event.preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
var lastItem = 0;

function fetchTransactions() {
    disableScroll();
    if (lastItem > 250) {
        var node = document.createElement("DIV");
        node.innerHTML = "NO MORE DATA";
        document.getElementById("list").appendChild(node);
    } else {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/transactions?id=" + lastItem, true);
        xmlhttp.send();
        var xmlDoc = xmlhttp.responseText;
        xmlhttp.onreadystatechange = function() {
            console.log(xmlhttp);
            if (xmlhttp.readyState == 4) {
                var data = JSON.parse(xmlhttp.responseText);
                var html = "";
                console.log('DATA', data);
                data.forEach(function(item) {
                    html += "<p>" + item.name + "</p>";
                    lastItem = item.index + 1;
                })
                document.getElementById("list").innerHTML = html;

            }
            enableScroll();

        };
    }
};