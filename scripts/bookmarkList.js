'use strict';

/* global api, index, store */

const bookmarkList = (function() {
  const render = function() {
    const renderedBookmarks = renderBookmarks(store.bookmarks);
    $('.bookmark-content').html(renderedBookmarks);
  };

  const renderBookmarks = function(bookmarks) {
    return bookmarks.map(bookmark => {
      return generateBookmarkHTML(bookmark);
    });
  };

  const generateBookmarkHTML = function(bookmark) {
    let rating = `
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>`;
    if (bookmark.rating !== null) {
      rating =
        '<span class="fa fa-star checked" />\n'.repeat(bookmark.rating) +
        '<span class="fa fa-star" />\n'.repeat(5 - bookmark.rating);
    }
    return `
    <div class='bookmark item-id'>
      <h2>${bookmark.title}</h2>
      ${rating}
    </div>
    `;
  };

  return {
    render
  };
})();
