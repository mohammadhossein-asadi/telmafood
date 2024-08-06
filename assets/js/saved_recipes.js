// Import

import { getTime } from "./module.js";

// Retrieves all keys from the localStorage object and filters them to include only those starting with "cookie-recipe". This is  used to identify saved recipes.
const savedRecipes = Object.keys(window.localStorage).filter((item) => {
  return item.startsWith("cookie-recipe");
});

// Selects the DOM element representing the container for displaying saved recipes.
const savedRecipesContainer = document.querySelector(
  "[data-saved-recipe-container]"
);

// Sets the inner HTML of the saved recipes container to include a section title.
savedRecipesContainer.innerHTML = `<h2 class="headline-small section-title">All Saved Recipes</h2>`;

// Creates a new div element and assigns the class "grid-list" to it. This element will contain the saved recipes.
const gridList = document.createElement("div");
gridList.classList.add("grid-list");

// Checks if there are any saved recipes.
if (savedRecipes.length) {
  // Iterates through each saved recipe and performs the following operations for each.
  savedRecipes.map((savedRecipe, i) => {
    // Parses and extracts relevant information from the saved recipe stored in localStorage.
    const {
      recipe: { image, label: title, totalTime: cookingTime, uri },
    } = JSON.parse(window.localStorage.getItem(savedRecipe));

    // Extracts the recipe ID from the URI and checks if the recipe is currently saved.
    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved = window.localStorage.getItem(`cookie-recipe${recipeId}`);

    // Creates a new div element representing a card for each saved recipe and adds the class "card" to it. The animationDelay property is set to create a staggered animation effect.
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.animationDelay = `${100 * i}ms`;

    //  Sets the inner HTML of the card with the structure representing each saved recipe.
    card.innerHTML = `
            <figure class="card-media img-holder">
            <img
              src="${image}"
              width="195"
              height="195"
              loading="lazy"
              alt="${title}"
              class="img-cover"
            />
            </figure>

            <div class="card-body">
              <h3 class="title-small">
                <a href="./detail.html?recipe=${recipeId}" class="card-link">${
      title ?? "Untitled"
    }</a>
              </h3>

              <div class="meta-wrapper">
                <div class="meta-item">
                  <span
                    class="material-symbols-outlined"
                    aria-hidden="true"
                    >schedule</span
                  >

                  <span class="label-medium">${
                    getTime(cookingTime).time || "<1"
                  } ${getTime(cookingTime).timeUnit}</span>
                </div>

                <button
                  class="icon-btn has-state ${isSaved ? "saved" : "removed"}"
                  aria-label="Add to saved recipes"
                  onclick="saveRecipe(this, '${recipeId}')"
                >
                  <span
                    class="material-symbols-outlined bookmark-add"
                    aria-hidden="true"
                    >bookmark_add</span
                  >
                  <span
                    class="material-symbols-outlined bookmark"
                    aria-hidden="true"
                    >bookmark</span
                  >
                </button>
              </div>
            </div>
          `;

    gridList.appendChild(card);
  });
  //  If there are no saved recipes, displays a message indicating that the user has not saved any recipes.
} else {
  savedRecipesContainer.innerHTML = `<p>You don't saved any recipes yet!</p>`;
}

// Appends the gridList container (which contains the saved recipe cards) to the saved recipes container.
savedRecipesContainer.appendChild(gridList);
