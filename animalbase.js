"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
    star: false,
    winner: false
};

const settings = {
    filter: "all",
    sortBy: "name",
    sortDir: "asc"
}

function start( ) {
    console.log("ready");

    // TODO: Add event-listeners to filter and sort buttons
    registerButtons();
    loadJSON();
}

function registerButtons() {
    document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));

    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));
}

async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects( jsonData );
}

function prepareObjects( jsonData ) {
    allAnimals = jsonData.map( preapareObject );

    // TODO: This might not be the function we want to call first
    //fixed so we filter and sort on the first load
    buildList();
    //displayList(allAnimals);
}

function preapareObject( jsonObject ) {
    const animal = Object.create(Animal);
    
    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`User selected ${filter}`);
    //filterList(filter);
    setFilter(filter);
}

function setFilter(filter){
    settings.filterBy = filter; //sets global variable
    buildList()
}

function filterList(filteredList) {
    //let filteredList = allAnimals;
    if (settings.filterBy === "cat") {
    //create a filter of only cats
    filteredList = allAnimals.filter(isCat);
    } else if (settings.filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
}
 
return filteredList;   
}

function isCat(animal) {
    return animal.type === "cat";
}

function isDog(animal) {
    return animal.type === "dog";
}

//sending the dataset that was clicked to the sortList 
//so we know which dataset we are sorting by
function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    
    //find "old" sortby element, and remove .sortBy
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");

    //indicate active sort
    event.target.classList.add("sortby");

    // toggle the direction!
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }


    console.log(`User selected ${sortBy} - ${sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();

}

//we are sorting by.. what was clicked
function sortList(sortedList) { 
    //let sortedList = allAnimals;
    let direction = 1; // 1 is normal direction.
    if(settings.sortDir === "desc") {
        direction = -1;
    } else {
        settings.direction = 1;
    }
    // if (sortBy === "name") {
        sortedList = sortedList.sort(sortByProperty);


    function sortByProperty(animalA,animalB) {
    //  console.log(`sortBy is ${sortBy}`);
        if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList; 
}

function buildList() {
    const currentList = filterList(allAnimals);
    const sortedList = sortList(currentList); //sortedlist is the sortet version of the current list

    displayList (sortedList);
}
  
function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach( displayAnimal );
}


function displayAnimal( animal ) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    if (animal.star === true){
        clone.querySelector("[data-field=star]").textContent = "⭐";
    } else {
        clone.querySelector("[data-field=star]").textContent = "☆";
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

    function clickStar() {
        if(animal.star === true) {
            animal.star = false;
        } else {
            animal.star = true;
        }

        buildList(); //updating the list view
    }

    //Winners NEW
    clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
    
    clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner);
    function clickWinner() {
        if (animal.winner === true) {
            animal.winner = false;
        } else {
            tryToMakeAWinner(animal); 
        } 

        buildList();
    }


    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}

//NY a function inside a function inside a function
 function tryToMakeAWinner(selectedAnimal) {

    const winners = allAnimals.filter(animal => animal.winner); //should give a list of alle the winners
    
    const numbersOfWinners = winners.length;
    const other = winners.filter(animal => animal.type === selectedAnimal.type).shift();
    
    // if there is another of the same type
    if (other !== undefined) {
        console.log("ther can be only one winner of each type");
        removeOther(other);
    } else if (numbersOfWinners >= 2) {
        console.log("ther can only be two winner");
        removeAorB(winners[0], winners[1]);
    } else {
        makeWinner(selectedAnimal);
    }

function removeOther(other) {
    // ask the user to ignore or remove "other"
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    document.querySelector("#remove_other [data-field=otherwinner]").textContent = other.name;

     //if ignore - do nothing
    function closeDialog() {
        document.querySelector("#remove_other").classList.add("hide");
        document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther); 

        
    }

    //if remover other:
    function clickRemoveOther() {
    removeWinner(other);
    makeWinner(selectedAnimal);
    buildList();
    closeDialog();
    }
 
}

function removeAorB(winnerA, winnerB) {
// ask the user to ignore or remove a or b

document.querySelector("#remove_aorb").classList.remove("hide");
document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

//show names on buttons
document.querySelector("#remove_aorb [data-field=winnerA]").textContent = winnerA.name;
document.querySelector("#remove_aorb [data-field=winnerB]").textContent = winnerB.name;


//if ignore - do nothing
function closeDialog() {
    document.querySelector("#remove_aorb").classList.add("hide");
document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
}

function clickRemoveA(){
    //if removeA:
removeWinner(winnerA);
makeWinner(selectedAnimal);
buildList();
closeDialog();
}

function clickRemoveB() {
//else - if removeB
removeWinner(winnerB);
makeWinner(selectedAnimal);
buildList();
closeDialog();
}
}


function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
}

function makeWinner(animal){
    animal.winner = true;
}

 }
