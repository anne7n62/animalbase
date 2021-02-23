"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
    star: false
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

//NYT
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

//NYT
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

    function clickStar() {
        if(animal.star === true) {
            animal.star = false;
        } else {
            animal.star = true;
        }

        buildList(); //updating the list view
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}


