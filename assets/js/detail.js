// Import

import { fetchData } from "./api.js";
import { getTime } from "./module.js";

// Render data

// Finds the HTML element with the attribute data-detail-container
// and assigns it to the variable detailContainer.
// This element will be used to render the detailed information about the recipe.

const detailContainer = document.querySelector("[data-detail-container]");

// Modifies the ACCESS_POINT variable by appending a value extracted from the query parameter of the current URL.
// This is used as part of the data fetching process.
ACCESS_POINT += `/${window.location.search.slice(
  window.location.search.indexOf("=") + 1
)}`;

// Initiates a data fetch using the fetchData function.
// Upon successful fetch, the provided callback function processes and renders the recipe details.
fetchData(null, (data) => {
  // Destructures properties from data.recipe to obtain specific information about the recipe, such as images, title, author, and other details.
  const {
    images: { LARGE, REGULAR, SMALL, THUMBNAIL },
    label: title,
    source: author,
    ingredients = [],
    totalTime: cookingTime = 0,
    calories = 0,
    cuisineType = [],
    dietLabels = [],
    dishType = [],
    yield: servings = 0,
    ingredientLines = [],
    uri,
  } = data.recipe;

  // Sets the document title, for the browser tab, using the recipe title and an identifier ("TelmaFood").
  document.title = `${title} - TelmaFood`;

  // Selects the appropriate banner image (LARGE, REGULAR, SMALL, or THUMBNAIL) and extracts its URL, width, and height for use in rendering.
  const banner = LARGE ?? REGULAR ?? SMALL ?? THUMBNAIL;
  const { url: bannerUrl, width, height } = banner;
  const tags = [...cuisineType, ...dietLabels, ...dishType];

  // Initializes empty strings to accumulate tag elements and ingredient items during processing.
  let tagElements = "";
  let ingredientItems = "";

  const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
  const isSaved = window.localStorage.getItem(`cookie-recipe${recipeId}`);

  // Maps over the tags array to generate HTML elements for each tag, categorizing them by type (cuisineType, diet, or dishType) and creating hyperlinks.
  tags.map((tag) => {
    let type = "";

    if (cuisineType.includes(tag)) {
      type = "cuisineType";
    } else if (dietLabels.includes(tag)) {
      type = "diet";
    } else {
      type = "dishType";
    }

    tagElements += `
      <a href="./recipes.html?${type}=${tag.toLowerCase()}" class="filter-chip label-large has-state">${tag}</a>
    `;
  });

  // Maps over the ingredients array to generate HTML elements for each ingredient, creating a list of ingredients.
  ingredientLines.map((ingredient) => {
    ingredientItems += `<li class="ingr-item">${ingredient}</li>`;
  });

  // Dynamically generates HTML structure using template literals and injects it into the detailContainer element, rendering the recipe details on the web page.
  detailContainer.innerHTML = `
    <figure class="detail-banner img-holder">
    <img
      src="${bannerUrl}"
      width="${width}"
      height="${height}"
      alt="${title}"
      class="img-cover"
    />
    </figure>

    <div class="detail-content">
      <div class="title-wrapper">
        <h1 class="display-small">${title ?? "Untitled"}</h1>

        <button class="btn btn-secondary has-state has-icon ${
          isSaved ? "saved" : "removed"
        }" onclick="saveRecipe(this, '${recipeId}')">
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
          <span class="label-large save-text">Save</span>
          <span class="label-large unsaved-text">Unsaved</span>
        </button>
      </div>

      <div class="detail-author label-large">
        <span class="span">by</span> ${author}
      </div>

      <div class="detail-stats">
        <div class="stats-item">
          <span class="display-medium">${ingredients.length}</span>

          <span class="label-medium">Ingredients</span>
        </div>

        <div class="stats-item">
          <span class="display-medium">${
            getTime(cookingTime).time || "<1"
          }</span>

          <span class="label-medium">${getTime(cookingTime).timeUnit}</span>
        </div>

        <div class="stats-item">
          <span class="display-medium">${Math.floor(calories)}</span>

          <span class="label-medium">Calories</span>
        </div>
      </div>

      ${tagElements ? `<div class="tag-list">${tagElements}</div>` : ""}

      <h2 class="title-medium ingr-title">
        Ingredients
        <span class="label-medium">for ${servings} Servings</span>
      </h2>

      ${
        ingredientItems
          ? `<ul class="body-large ingr-list">${ingredientItems}</ul>`
          : ""
      }
    </div>
  `;
});
