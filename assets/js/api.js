window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";
// Application ID
const APP_ID = "b87c7034";

// Application Key
const API_KEY = "a3140c4dba842eb5e2cfd8c8047d932e";

const TYPE = "public";

/**
 * Fetches data from an API based on specified queries.
 * @param {Array} queries - Array of query parameters.
 * @param {Function} successCallback - Callback function to handle successful data retrieval.
 * @returns {Promise} - Promise representing the asynchronous data fetching process.
 */

export const fetchData = async function (queries, successCallback) {
  const query = queries
    ?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");

  const url = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${
    query ? `&${query}` : ""
  }`;

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    successCallback(data);
  }
};
