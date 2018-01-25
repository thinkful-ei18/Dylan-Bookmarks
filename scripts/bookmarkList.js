'use strict';

/* global api, index, store */

const bookmarkList = (function() {

  const render = function() {
    const renderedBookmarks = renderBookmarks(store.bookmarks);
    $('.bookmark-content').html(renderedBookmarks);
  };

  const renderBookmarks = function(bookmarks) {
    return bookmarks.map((bookmark) => {
      return generateBookmarkHTML(bookmark);
    });
  };

  const generateBookmarkHTML = function(bookmark) {
    return `
    <div class='bookmark item-id'>
      <h2>${bookmark.title}</h2>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
    </div>
    `;
  };

  return {
    render
  };
})();