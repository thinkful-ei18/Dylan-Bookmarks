'use strict';
/* global api, store, bookmarkList */
$(api.getItems(items => {
  items.forEach((item) => {
    store.addItem(item);
  });
  bookmarkList.render();
}));