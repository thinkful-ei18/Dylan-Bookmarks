'use strict';

/* global api, index */

const store = (function() {

  const addItem = function(item) {
    item.expanded = false;
    item.editing = false;
    this.bookmarks.push(item);
  };

  const update = function(id, newData) {
    const item = this.bookmarks.find(item => item.id === id);
    console.log(item);
    Object.assign(item, newData);
  };

  const findById = function(id) {
    return this.bookmarks.find(item => item.id === id); 
  };

  return {
    bookmarks: [],
    addItem,
    findById,
    update,
    ratingFilter: 0,
    page: 0
  };
})();