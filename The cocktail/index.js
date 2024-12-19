export const navbar = document.querySelector(".navbar");
export const startPage = document.querySelector("#home-page");
export const detailsPage = document.querySelector("#details-page");
export const searchPage = document.querySelector("#search-page");
export const generateDrink = document.querySelector(".generate-drink");
export const getDetails = document.querySelector(".get-details");
export const drinkImage = document.querySelector(".drink-image");
export const drinkName = document.querySelector(".drink-name");
export const drinkContainer = document.querySelector(".drink-container");
export const detailsLink = document.querySelector("#details-link");
export const alcoholicOfDrink = document.querySelector(".alcoholic");
export const cocktailId = document.querySelector(".id-drink");
export const instructionsOfDrink = document.querySelector(".instructions");
export const tags = document.querySelector(".tags");
export const nameOfDrink = document.querySelector(".name-drink");
export const searchInput = document.querySelector("#search-input");

export const searchResultContainer =
  document.querySelector(".content-container");
export const searchByNameButton = document.querySelector("#search-by-name");
export const searchByIngredientButton = document.querySelector(
  "#search-by-ingredient"
);
export const searchByGlassButton = document.querySelector("#search-by-glass");
export const searchByCategoryButton = document.querySelector(
  "#search-by-category"
);

export const likedDrinksPage = document.querySelector("#liked-drinks-page");
export const likedDrinksButton = document.querySelector("#favorites-link");

import { handleOnNavbarClick } from "./utilties.js";
import {
  fetchRandomDrink,
  fetchDrinkDetailsById,
  fetchDrinkByGlass,
  fetchDrinkByIngredient,
  fetchDrinkByName,
  fetchDrinkByCategory,
} from "./api.js";

navbar.addEventListener("click", handleOnNavbarClick);
generateDrink.addEventListener("click", fetchRandomDrink);
detailsLink.addEventListener("click", fetchDrinkDetailsById);

searchByNameButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchDrinkByName(query);
  } else {
    searchResultContainer.innerHTML = "<p>select a term</p>";
  }
});

searchByIngredientButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchDrinkByIngredient(query);
  } else {
    searchResultContainer.innerHTML = "<p>select a term</p>";
  }
});

searchByGlassButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchDrinkByGlass(query);
  } else {
    searchResultContainer.innerHTML = "<p>select a term</p>";
  }
});

searchByCategoryButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchDrinkByCategory(query);
  } else {
    searchResultContainer.innerHTML = "<p>select a term</p>";
  }
});
fetchRandomDrink();
