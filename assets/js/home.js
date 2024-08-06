// Imports necessary functions and variables from external files.
// fetchData is used for fetching data from an API, skeletonCard is a template for a loading card, and cardQueries is an array of queries used to fetch recipe data.
// getTime is  a utility function for formatting time.
import { fetchData } from "./api.js";
import { skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

// Code inside the event listener executes when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", function () {
  // Selects various DOM elements based on their data attributes or class names. These elements include tab buttons, tab panels, search field, search button, and an error message element.
  const tabButtons = document.querySelectorAll("[data-tab-btn]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");
  const searchField = document.querySelector("[data-search-field]");
  const searchBtn = document.querySelector("[data-search-btn]");
  const errorMessage = document.querySelector(".error-message");

  // Initializes variables to keep track of the last active tab panel and tab button. Defaults to the first tab.
  let lastActiveTabPanel = tabPanels[0];
  let lastActiveTabBtn = tabButtons[0];

  // Function to switch between tabs and update accessibility attributes
  function switchTab(tabBtn, tabPanel) {
    lastActiveTabPanel.setAttribute("hidden", "");
    lastActiveTabBtn.setAttribute("aria-selected", false);
    lastActiveTabBtn.setAttribute("tabindex", -1);

    tabPanel.removeAttribute("hidden");
    tabBtn.setAttribute("aria-selected", true);
    tabBtn.setAttribute("tabindex", 0);

    lastActiveTabPanel = tabPanel;
    lastActiveTabBtn = tabBtn;
  }

  // Function to handle search input and redirect to recipes.html
  function handleSearch() {
    if (searchField.value) {
      window.location = `/recipes.html?q=${searchField.value}`;
    } else {
      errorMessage.style.display = "block";
    }
  }
  // Event listener to hide error message on search field input
  searchField.addEventListener("input", function () {
    errorMessage.style.display = "none";
  });

  searchBtn.addEventListener("click", handleSearch);

  // Event listener to handle search when Enter key is pressed
  searchField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Defines several functions and event listeners for handling tab switching, search functionality, and page-related events.
  window.addEventListener("pageshow", function (event) {
    if (
      event.persisted ||
      (window.performance && window.performance.navigation.type === 2)
    ) {
      searchField.value = "";
    }
  });

  //  Iterates over each tab button, adding an event listener to switch tabs and call addTabContent when a new tab is clicked.
  tabButtons.forEach((tabBtn) => {
    tabBtn.addEventListener("click", function () {
      const tabPanel = document.querySelector(
        `#${this.getAttribute("aria-controls")}`
      );
      switchTab(this, tabPanel);
      addTabContent(this, tabPanel); // Call addTabContent when a new tab is clicked
    });
  });

  // WORK WITH API
  // Fetch data for tab content

  //
  const addTabContent = (currentTabBtn, currentTabPanel) => {
    const gridList = document.createElement("div");
    gridList.classList.add("grid-list");

    currentTabPanel.innerHTML = `
  <div class="grid-list">
  ${skeletonCard.repeat(12)}
  </div>`;

    fetchData(
      [
        ["mealType", currentTabBtn.textContent.trim().toLowerCase()],
        ...cardQueries,
      ],
      function (data) {
        currentTabPanel.innerHTML = "";

        for (let i = 0; i < 12; i++) {
          const {
            recipe: { image, label: title, totalTime: cookingTime, uri },
          } = data.hits[i];

          const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
          const isSaved = window.localStorage.getItem(
            `cookie-recipe${recipeId}`
          );

          const card = document.createElement("div");
          card.classList.add("card");
          card.style.animationDelay = `${100 * i}ms`;

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
        }

        currentTabPanel.appendChild(gridList);

        currentTabPanel.innerHTML += `
                <a href="./recipes.html?mealType=${currentTabBtn.textContent
                  .trim()
                  .toLowerCase()}" class="btn btn-secondary label-large has-state">Show more
                </a>
        `;
      }
    );
  };
  // Calls addTabContent to initialize the content of the initially active tab.
  addTabContent(lastActiveTabBtn, lastActiveTabPanel);

  // Fetch data for slider card
  // Initializes an array of cuisine types and selects all DOM elements with the attribute data-slider-section.
  let cuisineType = ["Asian", "French"];

  const sliderSections = document.querySelectorAll("[data-slider-section]");

  //  Iterates over each slider section to populate it with recipe data.
  for (const [index, sliderSection] of sliderSections.entries()) {
    sliderSection.innerHTML = `
    <div class="container">
      <h2 class="section-title headline-small" id="slider-label-1">
        Latest ${cuisineType[index]} Recipes
      </h2>

      <div class="slider">
        <ul class="slider-wrapper" data-slider-wrapper>
        ${`<li class="slider-item">${skeletonCard}</li>`.repeat(10)}
        </ul>
      </div>
    </div>
    `;

    // Selects the slider wrapper element within the current slider section.
    const sliderWrapper = sliderSection.querySelector("[data-slider-wrapper]");

    //  Fetches data for the slider card based on the cuisine type and card queries.
    fetchData(
      [...cardQueries, ["cuisineType", cuisineType[index]]],
      function (data) {
        sliderWrapper.innerHTML = "";

        // Maps through each item in the fetched data to create and append slider card elements.
        data.hits.map((item) => {
          const {
            recipe: { image, label: title, totalTime: cookingTime, uri },
          } = item;

          const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
          const isSaved = window.localStorage.getItem(
            `cookie-recipe${recipeId}`
          );

          const sliderItem = document.createElement("li");
          sliderItem.classList.add("slider-item");

          sliderItem.innerHTML = `
            <div class="card">
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
            </div>
          `;

          // Appends each slider item to the slider wrapper.
          sliderWrapper.appendChild(sliderItem);
        });

        // Appends a "Show more" link to the end of the slider, linking to additional recipes of the corresponding cuisine type.
        sliderWrapper.innerHTML += `
        <li class="slider-item" data-slider-item>
          <a href="./recipes.html?cuisineType=${cuisineType[
            index
          ].toLowerCase()}" class="load-more-card has-state">
            <span class="label-large">Show more</span>

            <span class="material-symbols-outlined" aria-hidden="true"
              >navigate_next</span
            >
          </a>
        </li>
        `;
      }
    );
  }
});
