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
    Object.assign(item, newData);
  };

  const findById = function(id) {
    return this.bookmarks.find(item => item.id === id); 
  };

  const deleteBookmark = function(id) {
    this.bookmarks.splice(this.bookmarks.findIndex(bookmark => bookmark.id === id), 1);
  };

  return {
    bookmarks: [],
    addItem,
    findById,
    update,
    deleteBookmark,
    ratingFilter: 0,
    page: 0
  };
})();