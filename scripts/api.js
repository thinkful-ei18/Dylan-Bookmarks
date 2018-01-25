'use strict';

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Dylan/bookmarks';

  const getItems = function(callback) {
    $.getJSON(`${BASE_URL}`, callback);
  };

  return {
    getItems
  };
})();