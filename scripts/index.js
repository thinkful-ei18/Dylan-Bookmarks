'use strict';
/* global api, store, bookmarkList */
$(api.getItems(items => {
  items.forEach((item) => {
    store.bookmarks.push(item);
  });
  bookmarkList.render();
}));