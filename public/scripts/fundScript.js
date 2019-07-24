let amountSaved = document.querySelectorAll(".amountSaved");
let progressBars = document.querySelectorAll(".progress");
let progressText = document.querySelectorAll(".progress-text");

for(let i = 0; i < amountSaved.length; i++) {
    let percent = percentFunc(amountSaved[i].innerText);
    progressBarFunc(progressBars[i], percent);
    console.log(`${percent}%`);
}

let btn = document.querySelector("#newFundBtn");
let modal = document.querySelector(".modal");

btn.addEventListener("click", () => {
    modal.style.display = "block";
});

document.addEventListener("click", (e) => {
    if(e.target == modal) {
        modal.style.display = "none";
    }
});

//Deleting

const deleteButtons = document.getElementsByClassName("icon");

for(let button of deleteButtons){
    button.addEventListener("click", deleteListing);
}

function deleteListing() {
    let listing = this.parentElement;
    listing.parentNode.removeChild(listing);
}

//Adding
let addBtn = document.querySelector("#addBtn");

let fundList = document.querySelector("#fundList");

let name = document.querySelector("#name");
let startAmount = document.querySelector("#startAmount");
let goal = document.querySelector("#goal");

addBtn.addEventListener("click", () => {
    //Create Everything
    let li = document.createElement("li");
    let spanOne = document.createElement("span");
    spanOne.setAttribute("class", "icon");
    spanOne.addEventListener("click", deleteListing);
    let i = document.createElement("i");
    i.setAttribute("class", "fas fa-trash");
    let fundNameSpan = document.createElement("span");
    fundNameSpan.setAttribute("class", "fundName");
    let spanTwo = document.createElement("span");
    spanTwo.setAttribute("class", "fund-money");
    let spanThree = document.createElement("span");
    spanThree.setAttribute("class", "amountSaved");
    let goalSpan = document.createElement("span");
    goalSpan.setAttribute("class", "goal");
    let progressDiv = document.createElement("div");
    progressDiv.setAttribute("class", "progress-bar");
    let progress = document.createElement("div");
    progress.setAttribute("class", "progress");
    let progressText = document.createElement("div");
    progressText.setAttribute("class", "progress-text");

    //Append things to each other
    spanOne.appendChild(i);
    fundNameSpan.append(name.value);
    goalSpan.append(goal.value)
    spanTwo.append(spanThree, "/", goalSpan);
    spanThree.append(startAmount.value);
    progressText.append(percentFunc(startAmount.value, goal.value));
    progress.append(progressText);
    progressDiv.append(progress);

    progressBarFunc(progress, percentFunc(startAmount.value, goal.value));

    li.append(spanOne, " ", fundNameSpan, " - ", spanTwo, progressDiv);

    //Append to List
    fundList.append(li);

    //Clear values
    name.value = "";
    startAmount.value = "";
    goal.value = "";

    //Close Modal
    modal.style.display = "none";
});

function percentFunc(num, goal = 1000) {
    let decimal = (num/goal) * 100;
    return truncateToDecimals(decimal);
}

function progressBarFunc(bar, percent) {
    bar.style.width = `${percent}%`;
    bar.innerText = `${percent}%`;
}

function truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
}