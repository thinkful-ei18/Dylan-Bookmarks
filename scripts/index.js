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
// let newItem = {
//   title: 'Facebook',
//   url: 'http://facebook.com',
//   desc: 'Social media',
//   rating: 1
// };

// for (let i = 0; i < 20; i++){
//   api.addItem(newItem, response => {
//     console.log(i + 'copies have been made');
//   });
// }