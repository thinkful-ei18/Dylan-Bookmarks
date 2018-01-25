'use strict';

/* global api, index, store */

const bookmarkList = (function() {

  const getIdFromElement = function(element) {
    return $(element).closest('div').data('id');
  };

  const handleExpandView = function() {
    $('.bookmark-content').on('click', '.collapsible', event => {
      const item = store.findById(getIdFromElement(event.currentTarget));
      store.update(item.id, {expanded: !item.expanded});
      render();
    });
  };

  const handleDeleteBookmark = function() {
    $('.bookmark-content').on('click', '.delete', event => {
      const id = getIdFromElement(event.currentTarget);
      api.deleteItem(id, response => {
        store.deleteBookmark(id);
        render();
      });
    });
  };

  const bindEventListeners = function(){
    handleExpandView();
    handleDeleteBookmark();
  };

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
      <h2 class="collapsible">&#9654 ${bookmark.title}</h2>
      ${rating}
    </div>
    `;
  };

  const generateExpandedHTML = function(bookmark) {
    const rating = generateRating(bookmark.rating);
    return `
    <div class="bookmark" data-id="${bookmark.id}">
      <h2 class="collapsible">&#9660 ${bookmark.title}</h2>
      <p class="link">${bookmark.url}</p>
      <p class="description">${bookmark.desc}</p>
      ${rating}
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
    `;
  };

  return {
    render,
    bindEventListeners
  };
})();
