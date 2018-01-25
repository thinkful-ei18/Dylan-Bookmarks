'use strict';

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Dylan/bookmarks';

  const getItems = function(callback) {
    $.getJSON(`${BASE_URL}`, callback);
  };

  const addItem = function(item, callback) {
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(item),
      success: callback
    });
  };

  const deleteItem = function(id, callback) {
    $.ajax({
      url: `${BASE_URL}/${id}`,
      method: 'DELETE',
      success: callback
    });
  };

  return {
    getItems,
    addItem,
    deleteItem
  };
})();