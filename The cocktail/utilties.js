import {
  startPage,
  detailsPage,
  searchPage,
  likedDrinksPage,
  drinkContainer,
} from "./index.js";

export function handleOnNavbarClick(event) {
  const classList = event.target.classList;
  if (classList.contains("item")) return handleOnLinkClick(event.target.id);
}
export function showStartPage(){
  startPage.classList.add("open");
  detailsPage.classList.remove("open");
  searchPage.classList.remove("open");
  likedDrinksPage.classList.remove("open");
}

export function handleOnLinkClick(id) {
  if (id === "home-link") {
    startPage.classList.add("open");
    detailsPage.classList.remove("open");
    searchPage.classList.remove("open");
    likedDrinksPage.classList.remove("open");
  }

  if (id === "search-link") {
    startPage.classList.remove("open");
    detailsPage.classList.remove("open");
    searchPage.classList.add("open");
    likedDrinksPage.classList.remove("open");
  }
  if (id === "details-link") {
    startPage.classList.remove("open");
    detailsPage.classList.add("open");
    searchPage.classList.remove("open");
    likedDrinksPage.classList.remove("open");
  }
  if (id === "favorites-link") {
    startPage.classList.remove("open");
    detailsPage.classList.remove("open");
    searchPage.classList.remove("open");
    likedDrinksPage.classList.add("open");
    displayLikedDrinks();
  }
}
export async function handleOnBtnClick(event) {
  const clickedDrinkId = event.target.dataset.idDrink;
  try {
    const detailsUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${clickedDrinkId}`;
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
      categoryEl.textContent = `${drinkDetails.strCategory}`;
      categoryEl.classList.add("category-el");
      detailsPage.appendChild(categoryEl);

      const alcoholicEl = document.createElement("p");
      alcoholicEl.textContent = `${drinkDetails.strAlcoholic}`;
      alcoholicEl.classList.add("alcoholic-el");
      detailsPage.appendChild(alcoholicEl);

      const glassEl = document.createElement("p");
      glassEl.textContent = `${drinkDetails.strGlass}`;
      glassEl.classList.add("glass-el");
      detailsPage.appendChild(glassEl);

      const instructionsEl = document.createElement("p");
      instructionsEl.textContent = `${drinkDetails.strInstructions}`;
      instructionsEl.classList.add("instructions-el");
      detailsPage.appendChild(instructionsEl);

      const ingredientsEl = document.createElement("ul");
      for (let i = 1; i <= 15; i++) {
        const ingredient = drinkDetails[`${i}`];
        const measure = drinkDetails[`${i}`];

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
export function handleLikeClick(event, drink) {
  const likeIcon = event.target;
  const drinkId = drink.idDrink;
  let likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];

  if (likedDrinks.includes(drinkId)) {
    likedDrinks = likedDrinks.filter((id) => id !== drinkId);
    likeIcon.style.color = "black";
  } else {
    likedDrinks.push(drinkId);
    likeIcon.style.color = "red";
  }

  localStorage.setItem("likedDrinks", JSON.stringify(likedDrinks));

}
export function displayLikedDrinks() {
  const likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
  likedDrinksPage.innerHTML = "";

  if (likedDrinks.length > 0) {
    likedDrinks.forEach(async (drinkId) => {
      try {
        const detailsUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;
        const response = await fetch(detailsUrl);
        const data = await response.json();

        if (data.drinks && data.drinks.length > 0) {
          const drink = data.drinks[0];
          const drinkContainer = document.createElement("div");
          drinkContainer.classList.add("liked-drink");

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.classList.add("delete-btn");
          deleteBtn.dataset.idDrink = drink.idDrink;

          deleteBtn.addEventListener("click", handleOnDelete);

          const thumbnailEl = document.createElement("img");
          thumbnailEl.src = drink.strDrinkThumb;
          thumbnailEl.alt = drink.strDrink;
          thumbnailEl.classList.add("thumbnail-el");

          thumbnailEl.dataset.idDrink = drink.idDrink;
          thumbnailEl.addEventListener("click", handleOnBtnClick);

          const nameEl = document.createElement("h3");
          nameEl.textContent = drink.strDrink;

          drinkContainer.appendChild(deleteBtn);
          drinkContainer.appendChild(thumbnailEl);
          drinkContainer.appendChild(nameEl);

          likedDrinksPage.appendChild(drinkContainer);
        }
      } catch (error) {
      }
    });
  } else {
    likedDrinksPage.innerHTML =
      "<p>No liked drinks found. Like some drinks!</p>";
  }
}

export function handleOnDelete(event) {
  const drinkId = event.target.dataset.idDrink;
  let likedDrinks = JSON.parse(localStorage.getItem("likedDrinks")) || [];
  likedDrinks = likedDrinks.filter((id) => id !== drinkId);
  localStorage.setItem("likedDrinks", JSON.stringify(likedDrinks));
  const drinkContainer = event.target.closest(".liked-drink");
  if (drinkContainer) {
    drinkContainer.remove();
  }
}
export function createLikeButton(drink) {
  const likeIcon = document.createElement("span");
  likeIcon.classList.add("material-symbols-outlined", "like-icon");
  likeIcon.textContent = "thumb_up";
  likeIcon.dataset.idDrink = drink.idDrink;
  likeIcon.addEventListener("click", (event) => handleLikeClick(event, drink));

  drinkContainer.appendChild(likeIcon);
}
export function resetLikeButton() {
  const existingLikeButton = document.querySelector(".like-icon");
  if (existingLikeButton) {
    existingLikeButton.remove();
  }
}
