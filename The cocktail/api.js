import {
  drinkImage,
  drinkName,
  detailsPage,
  searchResultContainer,
} from "./index.js";
import {
  handleOnBtnClick,
  handleLikeClick,
  createLikeButton,
  resetLikeButton,
  showStartPage,
} from "./utilties.js";
export let currentCocktailId = "";

export async function fetchRandomDrink() {
  try {
    const response = await fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    const drink = data.drinks[0];

    const imageUrl = drink.strDrinkThumb;
    const name = drink.strDrink;
    drinkImage.src = imageUrl;
    drinkName.textContent = name;
    showStartPage();
    resetLikeButton();

    createLikeButton(drink);

    currentCocktailId = drink.idDrink;
    return currentCocktailId;
  } catch (error) {
  }
}
export async function fetchDrinkDetailsById() {

  try {
    const detailsUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${currentCocktailId}`;
    const response = await fetch(detailsUrl);
    const data = await response.json();

    if (data.drinks && data.drinks.length > 0) {
      const drinkDetails = data.drinks[0];

      detailsPage.innerHTML = "";

      const thumbnailEl = document.createElement("img");
      thumbnailEl.src = drinkDetails.strDrinkThumb;
      thumbnailEl.alt = `${drinkDetails.strDrink} image`;
      thumbnailEl.classList.add("thumbnail-el");
      detailsPage.appendChild(thumbnailEl);

      const nameEl = document.createElement("h2");
      nameEl.textContent = drinkDetails.strDrink;
      nameEl.classList.add("name-el");
      detailsPage.appendChild(nameEl);

      const categoryEl = document.createElement("p");
      categoryEl.textContent = `category: ${drinkDetails.strCategory}`;
      categoryEl.classList.add("category-el");
      detailsPage.appendChild(categoryEl);

      const alcoholicEl = document.createElement("p");
      alcoholicEl.textContent = `alcoholic: ${drinkDetails.strAlcoholic}`;
      alcoholicEl.classList.add("alcoholic-el");
      detailsPage.appendChild(alcoholicEl);

      const glassEl = document.createElement("p");
      glassEl.textContent = `glass: ${drinkDetails.strGlass}`;
      glassEl.classList.add("glass-el");
      detailsPage.appendChild(glassEl);

      const instructionsEl = document.createElement("p");
      instructionsEl.textContent = `instructions: ${drinkDetails.strInstructions}`;
      instructionsEl.classList.add("instructions-el");
      detailsPage.appendChild(instructionsEl);

      const ingredientsEl = document.createElement("ul");
      for (let i = 1; i <= 15; i++) {
        const ingredient = drinkDetails[`strIngredient${i}`];
        const measure = drinkDetails[`strMeasure${i}`];

        if (ingredient) {
          const ingredientItem = document.createElement("li");
          ingredientItem.textContent = `${
            measure ? measure : ""
          } ${ingredient}`;
          ingredientsEl.appendChild(ingredientItem);
        }
      }
      ingredientsEl.classList.add("ingredients-el");
      detailsPage.appendChild(ingredientsEl);
      document.querySelector("#home-page").classList.remove("open");
      document.querySelector("#search-page").classList.remove("open");
      detailsPage.classList.add("open");
    } 
  } catch (error) {
  }
}

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export async function fetchDrinkByName(cocktailName) {
  try {
    const searchUrl = `${BASE_URL}/search.php?s=${encodeURIComponent(
      cocktailName
    )}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    displayResults(data.drinks, "namn");
  } catch (error) {
  }
}

export async function fetchDrinkByCategory(cocktailCategory) {
  try {
    const searchUrl = `${BASE_URL}/filter.php?c=${encodeURIComponent(
      cocktailCategory
    )}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    displayResults(data.drinks);
  } catch (error) {
  }
}
export async function fetchDrinkByGlass(cocktailGlass) {
  try {
    const searchUrl = `${BASE_URL}/filter.php?g=${encodeURIComponent(
      cocktailGlass
    )}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    displayResults(data.drinks);
  } catch (error) {
  }
}
export async function fetchDrinkByIngredient(cocktailIngredient) {
  try {
    const searchUrl = `${BASE_URL}/filter.php?i=${encodeURIComponent(
      cocktailIngredient
    )}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    displayResults(data.drinks);
  } catch (error) {
  }
}
let currentPage = 1;
const resultsPerPage = 10;

function displayResults(drinks, searchType) {
  searchResultContainer.innerHTML = "";

  if (!Array.isArray(drinks) || drinks.length === 0) {
    /// tog hjälp av chat gpt här. "Array.isArray" , consolen sa bara att det inte var en array och gav error
    searchResultContainer.innerHTML = `<p>No results found.</p>`;
    return;
  }

  const startIndex = (currentPage - 1) * resultsPerPage;
  const drinksToDisplay = drinks.slice(startIndex, startIndex + resultsPerPage);

  drinksToDisplay.forEach((drink) => {
    const drinkContainer = document.createElement("div");
    drinkContainer.classList.add("drink-container");

    const thumbnailEl = document.createElement("img");
    thumbnailEl.src = drink.strDrinkThumb;
    thumbnailEl.alt = drink.strDrink;
    thumbnailEl.classList.add("thumbnail-el");
    thumbnailEl.dataset.idDrink = drink.idDrink;
    thumbnailEl.addEventListener("click", handleOnBtnClick);

    const nameEl = document.createElement("h2");
    nameEl.textContent = drink.strDrink;

    const likeIcon = document.createElement("span");
    likeIcon.classList.add("material-symbols-outlined", "like-icon");
    likeIcon.textContent = "thumb_up";
    likeIcon.dataset.idDrink = drink.idDrink;
    likeIcon.addEventListener("click", (event) =>
      handleLikeClick(event, drink)
    );

    drinkContainer.appendChild(thumbnailEl);
    drinkContainer.appendChild(nameEl);
    drinkContainer.appendChild(likeIcon);
    searchResultContainer.appendChild(drinkContainer);
  });

  pagnationControlButtons(drinks, searchType);
}
//skapa knapparna
//räkna ut totala sidorna
//lägg till click event på knapparna och skapa logiken

function pagnationControlButtons(drinks, searchType) {
  const pagnationControlButtonsContainer = document.createElement("div");

  const previousButton = document.createElement("button");
  previousButton.textContent = "Previous";

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";

  const totalPages = Math.ceil(drinks.length / resultsPerPage);

  previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayResults(drinks, searchType);
    } 
  });
  nextButton.addEventListener("click", () => {
    if (currentPage * resultsPerPage < drinks.length) {
      currentPage++;
      displayResults(drinks, searchType);
    }
  });

  pagnationControlButtonsContainer.appendChild(previousButton);
  pagnationControlButtonsContainer.appendChild(nextButton);

  searchResultContainer.appendChild(pagnationControlButtonsContainer);
}
