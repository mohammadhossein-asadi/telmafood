import { fetchData } from "./api.js";

/**
 * Ad event on multiple elements
 * @param {NodeList} elements NodeList
 * @param {String} eventType Event type string
 * @param {Function} callback Callback function
 */

// Defines a function addEventOnElements that adds an event listener to multiple elements.
// It takes a NodeList of elements, an event type, and a callback function as parameters.
// This function iterates through each element in the NodeList and adds the specified event listener.
window.addEventOnElements = (elements, eventType, callback) => {
  for (const element of elements) {
    element.addEventListener(eventType, callback);
  }
};

// Exports an array named cardQueries containing arrays representing queries for recipe card data. Each inner array specifies a field to query.
export const cardQueries = [
  ["field", "uri"],
  ["field", "label"],
  ["field", "image"],
  ["field", "totalTime"],
];

// Skeleton card
// Exports a string template for a skeleton card HTML structure. This is used as a placeholder or loading indicator for recipe cards.
export const skeletonCard = `
<div class="card skeleton-card">
  <div class="skeleton card-banner"></div>
  <div class="card-body">
    <div class="skeleton card-title"></div>
    <div class="skeleton card-text"></div>
  </div>
</div>`;

// Defines a constant ROOT representing the base URL for the Edamam Recipes API.
const ROOT = "https://api.edamam.com/api/recipes/v2";

// Defines a function saveRecipe that is added to the global window object.
// This function is responsible for saving or removing a recipe from the Recipe book based on the recipe ID and the state of the save button.
window.saveRecipe = function (element, recipeId) {
  const isSaved = window.localStorage.getItem(`cookie-recipe${recipeId}`);
  ACCESS_POINT = `${ROOT}/${recipeId}`;

  if (!isSaved) {
    fetchData(cardQueries, function (data) {
      window.localStorage.setItem(
        `cookie-recipe${recipeId}`,
        JSON.stringify(data)
      );
      element.classList.toggle("saved");
      element.classList.toggle("removed");
      showNotification("Added to Recipe book");
    });
    ACCESS_POINT = ROOT;
  } else {
    window.localStorage.removeItem(`cookie-recipe${recipeId}`);
    element.classList.toggle("saved");
    element.classList.toggle("removed");
    showNotification("Removed from Recipe book");
  }
};

// Creates a container element for displaying notifications (snackbar) and appends it to the document body.
// This container is  used to manage and display notifications.
const snackbarContainer = document.createElement("div");
snackbarContainer.classList.add("snackbar-container");
document.body.appendChild(snackbarContainer);

// Defines a function showNotification that creates and displays a notification (snackbar) with a given message.
// This function is called when a recipe is saved or removed, providing feedback to the user.
function showNotification(message) {
  const snackbar = document.createElement("div");
  snackbar.classList.add("snackbar");
  snackbar.innerHTML = `<p class="body-medium">${message}</p>`;
  snackbarContainer.appendChild(snackbar);
  // Listens for the "animationend" event on the snackbar element.
  // When the animation ends, it removes the snackbar element from the snackbar container. This is  used for handling the dismissal animation of notifications.
  snackbar.addEventListener("animationend", (e) =>
    snackbarContainer.removeChild(snackbar)
  );
}
