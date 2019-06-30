const calculateBtn = document.getElementById("calculate");
calculateBtn.addEventListener("click", calculate);

const leftovertext = document.getElementById("leftoveramount");

let graphCreated = false;

function calculate() {
    const total = document.getElementsByName("total")[0].value;
    const funds = document.getElementsByName("fund");
    if(total) {
        let percentages = [];
        let amounts = [];
        for(let fund of funds){
            let percentage = new Decimal(fund.value / 100);
            percentages.push(percentage);
            let amount = total * percentage;
            amount = truncateToDecimals(amount);
            amounts.push(amount);
        }
        if (checkIfHundredPercent(percentages)) {
            let leftover = checkIfEqualsTotal(amounts, total);
            leftovertext.innerText = leftover;
            displayAmounts(amounts);
            graphCreated ? updateChart(getFundNames(), amounts, percentages) : drawChart(getFundNames(), amounts, percentages);
        } else {
            alert("Your percentage split doesn't equal 100");
        }
    } else {
        alert("Please enter a total");
    }
}

function getFundNames() {
    let fundNames = [];
    let containers = document.querySelectorAll(".fundName");
    for(let container of containers) {
        fundNames.push(container.innerText);
    }
    return fundNames;
}

function checkIfHundredPercent(arr) {
    let total = new Decimal(0);
	arr.forEach(percent => {
        total = Decimal.add(total, percent);
    });
    return total == 1;
}

function checkIfEqualsTotal(amounts, total) {
    let amountTotal = new Decimal(0);
    amounts.forEach(amount => {
        amountTotal = Decimal.add(amountTotal, amount);
    });
    let leftover = Decimal.sub(total, amountTotal);
    leftover = leftover.toFixed(2);
    return leftover;
}

function displayAmounts(amounts) {
    let funds = document.getElementsByClassName("amount");
    for(let i = 0; i < funds.length; i++) {
        funds[i].innerText = " $" + amounts[i];
        funds[i].style.display = "inline";
    }
}

function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
}

//Deleting Funds
const deleteButtons = document.getElementsByClassName("icon");

for(let button of deleteButtons){
    button.addEventListener("click", deleteListing);
}

function deleteListing() {
    let listing = this.parentElement;
    listing.parentNode.removeChild(listing);
}

//Adding Funds
const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", addListing);

const newFundInput = document.getElementsByName("newFund")[0];
const fundList = document.getElementById("fundList");

function addListing() {
    let newFundName = newFundInput.value;
    newFundInput.value = "";

    //Create Everything
    let li = document.createElement("li");
    let spanOne = document.createElement("span");
    spanOne.setAttribute("class", "icon");
    spanOne.addEventListener("click", deleteListing);
    let i = document.createElement("i");
    i.setAttribute("class", "fas fa-trash");
    let fundNameSpan = document.createElement("span");
    fundNameSpan.setAttribute("class", "fundName");
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "fund");
    let spanTwo = document.createElement("span");
    spanTwo.setAttribute("class", "amount");

    //Append things to each other
    spanOne.appendChild(i);
    fundNameSpan.append(newFundName);
    spanTwo.append("$0.00");

    li.append(spanOne, " ", fundNameSpan, " ", input, "% " + '\xa0' + " | ", spanTwo);

    //Append to List
    fundList.append(li);
}

const ctx = document.getElementById('chart').getContext('2d');

Chart.defaults.global.defaultFontFamily = 'Oswald';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let chart;

// drawChart(getFundNames(), [1, 1, 1], [.33, .33, .33]);
calculate();

function drawChart(labels, data, percentages) {
    chart = new Chart(ctx, {
        type: 'doughnut',
    
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: generateColors(percentages)
            }]
        },
    
        options: {
            legend: {
                // display: false,
                position: 'right',
                labels: {
                    fontColor: '#000'
                }
            },
            responsive: false
        }
    });

    graphCreated = true;
}

function updateChart(labels, data, percentages) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = generateColors(percentages);
    chart.update();
}

function generateColors(data) {
    let max = Math.max(...data);
    let min = Math.min(...data);
    let colorArr = [];
    data.forEach(color => {
        console.log(color);
        let light = map(color, max, min, 40, 75);
        console.log(`hsl(150, 58%, ${light}%)`);
        colorArr.push(`hsl(150, 58%, ${light}%)`);
    });
    return colorArr;
}

function map(position, in_min, in_max, out_min, out_max) {
    if (in_min === in_max) {
        if(position >= .5) {
            in_max = 0
        } else {
            in_min = 0;
        } 
    }

    return (position - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}