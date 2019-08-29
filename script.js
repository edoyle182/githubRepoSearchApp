'use strict';

const githubURL = 'https://api.github.com/';
const apiKey = 'f4c8fce3fc1013ad2e9b4d15374ca2c28f671c58';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

// Display results
function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('.js-results-list').empty();
  for (let obj in responseJson) {
    // for each repo object in array, add list item to results
    // list with repo name, date created, owner, description, & language
    $('.js-results-list').append(
      `<li><h3><a href="${responseJson[obj].html_url}">${responseJson[obj].name}</a></h3>
      <p>Created: ${responseJson[obj].created_at.substr(0, responseJson[obj].created_at.indexOf('T'))}</p>
      <p>By ${responseJson[obj].owner.login}</p>
      <p>Description: ${responseJson[obj].description}</p>
      <p>Language: ${responseJson[obj].language}</p>
      </li>`
    )};
  // display results section
  $('.js-results').removeClass('hidden');
};

// get GitHub user handle
function getGithubList(userHandle) { 
  // setup query
  const params = {
    type: "owner",
    sort: "updated",
    direction: "desc",
  };
    
  // put URL together 
  const queryString = formatQueryParams(params);
  const url = `${githubURL}users/${userHandle}/repos?${queryString}`;
    
  // add API key to header
  const options = {
    headers: new Headers({
      "X-GitHub-OTP": apiKey})
  };
  
  // fetch
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

// watch for event submit on button
// & send info to function
function watchForm() {
  $('.js-form').submit(e => {
    e.preventDefault();
    const userHandle = $('.js-user-handle').val();
    $('.js-user-handle').val('');
    getGithubList(userHandle);
  });
}

// jQuery watch form
$(watchForm);
