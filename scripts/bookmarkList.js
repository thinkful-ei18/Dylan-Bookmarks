'use strict';

/* global api, index, store */

const bookmarkList = (function() {
  const render = function() {
    const renderedBookmarks = renderBookmarks(store.bookmarks);
    $('.bookmark-content').html(renderedBookmarks);
  };

  const renderBookmarks = function(bookmarks) {
    return bookmarks.map(bookmark => {
      return bookmark.expanded
        ? generateExpandedHTML(bookmark)
        : generateBookmarkHTML(bookmark);
    });
  };

  const generateRating = function(rating) {
    let generated = `
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>`;
    if (rating !== null) {
      generated =
        '<span class="fa fa-star checked" />\n'.repeat(rating) +
        '<span class="fa fa-star" />\n'.repeat(5 - rating);
    }
    return generated;
  };

  const generateBookmarkHTML = function(bookmark) {
    const rating = generateRating(bookmark.rating);
    return `
    <div class='bookmark' data-id="${bookmark.id}">
      <h2>${bookmark.title}</h2>
      ${rating}
    </div>
    `;
  };

  const generateExpandedHTML = function(bookmark) {
    const rating = generateRating(bookmark.rating);
    return `
    <div class="bookmark" data-id="${bookmark.id}">
      <h2>${bookmark.title}</h2>
      <p class="link">${bookmark.link}</p>
      <p class="description">${bookmark.description}</p>
      ${rating}
    </div>
    `;
  };

  return {
    render
  };
})();
