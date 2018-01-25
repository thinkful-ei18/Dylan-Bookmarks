'use strict';

/* global api, index */

const store = (function() {

  const addItem = function(item) {
    item.expanded = false;
    item.editing = false;
    this.bookmarks.push(item);
  };
  return {
    bookmarks: [],
    addItem,
    ratingFilter: 0,
    page: 0
  };
})();