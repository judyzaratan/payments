(function() {

    //Obtains sections of html in DOM
    var getElement = function(id) {
        return document.getElementById(id);
    };

    //package into a module the money and info.  Private variables
    var home = getElement("home");


    var viewsend = document.getElementsByClassName("sendPage");
    var viewtrans = document.getElementsByClassName("transPage");
    var viewhome = document.getElementById("goHome");

    var preloader = getElement("preloader");
    var send = getElement("send");
    var transactions = getElement("transactions");
    var recipient = getElement("sendTo");
    var money = getElement("money");
    var next = getElement("next");
    var success = getElement("success");


    //Hides unneeded html to user -- error messages/pages
    var hideDisplay = function(whichDisplay) {
        whichDisplay.style.display = "none";
    };

    //Shows hidden html to user
    var showDisplay = function(input) {
        document.getElementById(input).style.display = "inherit";
    };

    viewhome.addEventListener("click", function(){
        hideDisplay(transactions);
        showDisplay("home");
    })
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
        var amountSent = sign[selected] + options[selected]();
        document.getElementById("money_format").innerHTML = amountSent;
    }


    Array.prototype.forEach.call(viewsend, function(page) {
        page.addEventListener("click", function() {
            hideDisplay(home);
            hideDisplay(success);
            hideDisplay(preloader);
            document.getElementById("clear").click();
            showDisplay("send");
        });
    });
    Array.prototype.forEach.call(viewtrans, function(page) {
        page.addEventListener("click", function() {
            hideDisplay(home);
            hideDisplay(success);
            hideDisplay(preloader);
            showDisplay("transactions");
            fetchTransactions();
        });
    });


    next.addEventListener("click", function() {
        if (formValidation()) {
            document.getElementById("preloader").style.display = "inherit";
            document.getElementById("amountSent").innerHTML = document.getElementById("money_format").innerHTML;
            document.getElementById("receiver").innerHTML = document.getElementById("sendTo").value;

            setTimeout(function() {
                hideDisplay(send);
                showDisplay("success");
            }, 2000);

        }

    });


    document.getElementById("clear").addEventListener("click", function() {
        document.getElementById("sender").reset();
        var errors = document.getElementsByClassName("error");
        Array.prototype.forEach.call(errors, function(errorEl) {
            hideDisplay(errorEl);
        });
        var money_display = document.getElementById("money_format");
        money_display.innerHTML = "";
        hideDisplay(document.getElementById("money_format"));
    });

    //Form validation

    function formValidation() {
        //Assume true
        var isValid = true;

        var money = getElement("money");
        var payment_cat = getElement("payment_type");
        var check = checkEmail();
        return check && validateAmount();
    }

    function validateAmount() {
        if (money.value === "") {
            showDisplay("errorAmountEmpty");
            return false;
        }
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
            showDisplay("errorEmpty");
            return false;
        }
        //check if invalid email
        var EMAIL_REGEX = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

        if (!EMAIL_REGEX.test(recipient.value)) {
            EMAIL_REGEX.test(recipient.value);
            showDisplay("errorFormat");
            return false;
        }
        return true;
    }

    var lastScrollTop = 50;
    document.getElementById("list").onscroll = function() {
        console.log(document.getElementById("list").scrollTop, document.body.clientHeight, window.innerHeight, window.screenY);
        if (document.getElementById("list").scrollTop > lastScrollTop + 150) {
            document.getElementById("preloader2").style.display = "inherit";
            lastScrollTop = document.getElementById("list").scrollTop;
            this.style.overflow = "hidden";
            fetchTransactions();
            setTimeout(function(){
                document.getElementById("list").style.overflow="scroll";
                document.getElementById("preloader2").style.display = "none";
            }, 500);
        } else {
            console.log('not loaded');
            console.log('lastScrollTop', lastScrollTop);
        }
    };


    function fetchTransactions() {
            var lastItem =  document.getElementById("list").getElementsByTagName("tr").length;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "/transactions?id=" + lastItem, true);
            xmlhttp.send();
            var xmlDoc = xmlhttp.responseText;
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4) {
                    var data = JSON.parse(xmlhttp.responseText);
                    var html = "";

                    data.forEach(function(item) {
                        html += "<tr><td>" + item.transDate + "</td>" +
                            "<td>" + item.name + "</td>" +
                            "<td>" + item.balance + "</td" + "</tr>";
                    });
                    var previous = document.getElementById("data").innerHTML;
                    document.getElementById("data").innerHTML = previous + html;

                }
            };
        }

})();