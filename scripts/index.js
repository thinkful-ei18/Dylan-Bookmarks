'use strict';
/* global api, store, bookmarkList */
$(
  bookmarkList.bindEventListeners(),
  api.getItems(items => {
    items.forEach(item => {
      store.addItem(item);
    });
    bookmarkList.render();
  })
);
