// SEARCH BOARD PROCESS
//PASSENGER UP DOWN CONTROLS

// Adult Controls
passengerCountCtrl(document.querySelector('.passenger-adult'));


// Child Controls
passengerCountCtrl(document.querySelector('.passenger-child'));

// Infant Controls 
passengerCountCtrl(document.querySelector('.passenger-infant'));

// Student Controls
passengerCountCtrl(document.querySelector('.passenger-student'));

function passengerCountCtrl(target){
    if(target != document.querySelector('.passenger-infant')){
        target.querySelector('.passenger-count-up').addEventListener('click', () => {
            if(totalPassenger()){
                const count = target.querySelector('.passenger-count');
                count.innerHTML = Number(count.innerHTML)+1;
                passengerInput();
                removeWM();
            }
            else{
                limitWM();
            }
        });
    }
    else{
        target.querySelector('.passenger-count-up').addEventListener('click', () => {
            const adults = document.querySelector('.passenger-adult .passenger-count');
            const infants = target.querySelector('.passenger-count');
            if(Number(adults.innerHTML) > Number(infants.innerHTML)){
                if(totalPassenger()){
                    infants.innerHTML = Number(infants.innerHTML)+1;
                    passengerInput();
                    removeWM();
                 }
                 else{
                    limitWM();
                 }
            }
            else{
                infantWM();
            }  
        });
    }
    target.querySelector('.passenger-count-down').addEventListener('click', () => {
        if(target != document.querySelector('.passenger-adult')){
            const count = target.querySelector('.passenger-count');
            if(Number(count.innerHTML) != 0){
                count.innerHTML = Number(count.innerHTML)-1;
                passengerInput();
                removeWM();
            }
        }
        else{
            const adults = target.querySelector('.passenger-count');
            const infants = document.querySelector('.passenger-infant .passenger-count');
            if(Number(adults.innerHTML)-1 < Number(infants.innerHTML)){
                if(Number(adults.innerHTML) != 0){
                    infantWM();
                }
            }
            else{
                if(Number(adults.innerHTML)> 0){
                    adults.innerHTML = Number(adults.innerHTML)-1;
                    passengerInput();
                    removeWM();
                }
            }
        }
    });
}

//  CLOSE PASSENGER TYPE BLOCK

document.querySelector('.passenger-num').addEventListener('click', () => {
    closePassengerType();
});

document.querySelector('#board-close-btn').addEventListener('click', () => {
    closePassengerType();
});

// PASSENGER COUNT CONTROLS  HELPED FUNCS

function passengerInput(){
    let target = document.querySelector('.passenger-num span:first-child');
    let total = passengerCounts();
    if(total == 0){
        target.textContent = 1;
    }
    else{
        target.textContent = total;
    }
}

function totalPassenger(){
    let total = passengerCounts(); 
    if(total < 7 && total > -1) return true;
}

function passengerCounts(){
    let total = 0;
    document.querySelectorAll('.passenger-types .passenger-count').forEach(p => {
        total += Number(p.innerHTML);
    });
    return total;
}

// Warning Message Controls
function limitWM(){
    document.querySelector('.ps-type-warning-message').style.display = "block";
    document.querySelector('.ps-type-warning-message').textContent = 'At most 7 seats can be booked.';
}

function infantWM(){
    document.querySelector('.ps-type-warning-message').style.display = "block";
    document.querySelector('.ps-type-warning-message').textContent = 'The numbers of infant and adult to travel should be equal.';
}

function removeWM(){
    document.querySelector('.ps-type-warning-message').style.display = "none";
    document.querySelector('.ps-type-warning-message').textContent = '';
}

// CLOSE İNPUT COUNT

function closePassengerType(){
    document.querySelector('.passenger-types').classList.toggle('display-block');
    if(passengerCounts() == 0){
        document.querySelector('.passenger-adult .passenger-count').innerHTML = "1";
    }
}

// CALENDAR CONTROLS
//DEPARTURE
const months =["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.querySelector('#date-departure').placeholder = new Date().getDate() + " " + months[new Date().getMonth()] + "," + new Date().getFullYear();

$(function() {
    $('#date-departure').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "dd-mm-yyyy",
        minDate: 0,
        clearBtn: true,
        multidate: false,
        multidateSeparator: ",",
        toggleActive: true
    });
});

//RETURN
$(function() {
    $("#date-return").datepicker();
    $("#date-return").datepicker("option", "dateFormat", "dd/mm/yy");
});

// ONE-WAY AND RETURN RADİOS

document.querySelector('#one-way').addEventListener('change', (e) => {
    if(e.target.checked){
        document.querySelector('#date-return').disabled = true;
    }
});

document.querySelector('#round-trip').addEventListener('change', (e) => {
    if(e.target.checked){
        document.querySelector('#date-return').disabled = false;
    }
});

// Airport Inputs

const fromInput = document.querySelector("#flight-from-input");
const fromSgstBlock = document.querySelector('.flight-from .airport-suggest-block');
const toInput = document.querySelector("#flight-to-input");
const toSgstBlock = document.querySelector('.flight-to .airport-suggest-block');


inputSuggestion(fromInput, fromSgstBlock);
inputSuggestion(toInput, toSgstBlock);

function inputSuggestion(inputBlock, suggestion){
    inputBlock.addEventListener('focus', () => { 
        inputBlock.value = "";
        fromSgstBlock.innerHTML = "";
        suggestion.style.display = "none";
     });

    inputBlock.addEventListener('keyup', (e) => {
        const input = e.target.value;
        if(input.length > 2){
            suggestion.style.display = "block";
            getAirpots(input, "AIRPORT", suggestion);
        }
        else{
            fromSgstBlock.innerHTML = "";
            suggestion.style.display = "none";
        } 
    });
}

function getAirpots(keyword, subType, target) {
    getToken();
    function getToken(){
        const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
        $.ajax({  
            type: "POST",  
            url: url,
            dataType: "json",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                "grant_type": "client_credentials",
                "client_id": "UdZ7kRNElGObfmqDuQ4mWb3xtiqL53X1",
                "client_secret": "jLF3fDZMKipztjAJ"
            },
            success: function(data, textStatus) {
                var token = data.access_token; 
                getLocations(token);
            }
        });
    } 

    function getLocations(token) {
        $.ajax({  
            type: "GET",  
            url: "https://test.api.amadeus.com/v1/reference-data/locations",
            dataType: "json",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            data: {
            "subType": subType,
            "keyword": keyword,
            "page[limit]": 10
            },
            success: function(data, textStatus) {
                crtAirportsName(data.data);
            }
        });
    }    

    function crtAirportsName(data){
        const airportList = [];
        data.forEach(d => {
            var airportName = d.name;
            (!d.name.includes('AIRPORT')) && (airportName = `${d.name} ${d.subType}`);
            airportList.push([`${airportName} ( ${d.iataCode} ) - ${d.address.cityName}, ${d.address.countryName}`, d.iataCode]);
        }); 
        putAirports(airportList);
    }

    function putAirports(airportList){
        target.innerHTML = "";
        airportList.forEach(port => {
            target.innerHTML += `<li class="airport-suggest-item" data-id="${port[1]}">${port[0]}</li>`;
        });

        const airports = document.querySelectorAll('.airport-suggest-block li');
        airports.forEach( airport => {
            airport.addEventListener('click', (e) => {
                target.parentElement.querySelector('input').value = e.target.getAttribute('data-id');  
                target.parentElement.querySelector('input').dataId = e.target.dataId;  
                target.parentElement.querySelector('input').style.fontWeight = "bold";
                target.innerHTML = ""; 
                target.style.display = "none";
            });
        });
    }
}

    // Search Button Process

    const btn = document.getElementById('search-btn');
    btn.addEventListener('click', () => {
        const fromInput = document.querySelector('#flight-from-input');
        const toInput = document.querySelector('#flight-to-input');
        const fromDate = document.querySelector('#date-departure');
        const toDate = document.querySelector('#date-return');
        const passenger = document.querySelector('.passenger-num span');
        
        if(fromInput.value.length > 10 && toInput.value.length > 10) {
            if(document.getElementById('one-way').checked){
                console.log(fromInput.getAttribute('data-id'))
            }     
        }

    });
