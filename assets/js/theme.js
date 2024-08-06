// Selects the root html element of the document.
const HTML = document.documentElement;
//  Uses the matchMedia API to check if the user's preferred color scheme is dark. The result is stored in the isDark variable.
const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

//  Checks if there is a stored theme preference in the session storage.
// If present, sets the theme of the HTML element accordingly.
//  If not, sets the theme based on the user's preferred color scheme (isDark).
if (sessionStorage.getItem("theme")) {
  HTML.dataset.theme = sessionStorage.getItem("theme");
} else {
  HTML.dataset.theme = isDark ? "dark" : "light";
}

// Initializes a variable isPressed to keep track of the button state.
let isPressed = false;

// Defines a function changeTheme that toggles the theme between light and dark.
// It updates the isPressed state, changes the aria-pressed attribute of the button, updates the theme on the HTML element, and stores the theme preference in the session storage.
const changeTheme = function () {
  isPressed = !isPressed;
  this.setAttribute("aria-pressed", isPressed);
  HTML.dataset.theme = HTML.dataset.theme === "light" ? "dark" : "light";
  sessionStorage.setItem("theme", HTML.dataset.theme);
};

// Adds an event listener to the window's load event. When the window has loaded, it selects the theme button and adds a click event listener to it.
//  The click event triggers the changeTheme function when the theme button is clicked.
window.addEventListener("load", function () {
  const themeBtn = document.querySelector("[data-theme-btn]");

  themeBtn.addEventListener("click", changeTheme);
});
