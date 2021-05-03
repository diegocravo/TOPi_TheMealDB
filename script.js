const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchLetter = document.querySelector(".search-letter");

// Event Listeners
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});
searchLetter.addEventListener("click", getMealByFirstLetter);

// Create Letter Menu
let letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let html = "";
for (let x = 0; x < letters.length; x++) {
  html += `
    <button type="submit" class="search-letter-btn letter-btn" id="search-${letters[x]}">
        <h6 data-id="${letters[x]}">${letters[x]}</h6>
    </button>
    `;
}
searchLetter.innerHTML = html;

// Get Recipe List by First Letter
function getMealByFirstLetter(e) {
  let mealLetter = e.target.dataset.id;
  console.log(mealLetter);
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealLetter}`)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
            <div class="meal-item">
                <div class="meal-img" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="food" />
                </div>
                <div class="meal-name" data-id="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Mostrar Receita</a>
                </div>
            </div>
              `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Ops, parece que não encontramos nenhuma receita!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// load first recipes
fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
  .then((response) => response.json())
  .then((data) => {
    let html = "";
    if (data.meals) {
      data.meals.forEach((meal) => {
        html += `
        <div class="meal-item">
            <div class="meal-img" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="food" />
            </div>
            <div class="meal-name" data-id="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn">Mostrar Receita</a>
            </div>
        </div>
            `;
      });
    }
    mealList.innerHTML = html;
  });

// get recipes list when button is clicked
// saves search to firestore database (good for data science purposes)
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  firestore.collection("listaBuscas").add({ palavra: searchInputTxt });
  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
            <div class="meal-item">
                <div class="meal-img" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="food" />
                </div>
                <div class="meal-name" data-id="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Mostrar Receita</a>
                </div>
            </div>
              `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Ops, parece que não encontramos nenhuma receita!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// get Recipe
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

//create modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
        <h3>Instruções</h3>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="" />
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Assista video</a>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

// Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCVcgTArrm3lEi1Z0PRNYekxIh1zBk16ZE",
  authDomain: "recipes-593d6.firebaseapp.com",
  projectId: "recipes-593d6",
  storageBucket: "recipes-593d6.appspot.com",
  messagingSenderId: "539218836051",
  appId: "1:539218836051:web:1af3818ddea4f7a35664a6",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
