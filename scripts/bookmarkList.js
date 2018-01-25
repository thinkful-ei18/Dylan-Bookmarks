'use strict';

/* global api, index, store */

const bookmarkList = (function() {

  const getIdFromElement = function(element) {
    return $(element).closest('div').data('id');
  };

  const handleAddBookmarkButton = function() {
    $('.js-add-bookmark-button').on('click', event => {
      let newItem = {
        id: 'undefined',
        title: '',
        url: '',
        desc: '',
        rating: 0
      };
      store.addItem(newItem, true);
      navButtonToggle();
      render();
    });
  };

  const handleBookmarkSubmit = function() {
    $('.bookmark-content').on('click', '.submit', event => {
      event.preventDefault();
      if (getIdFromElement(event.currentTarget) === 'undefined') {
        let newItem = {
          title: $('.bookmark-title input').val(),
          url: $('.bookmark-url input').val(),
          desc: $('.bookmark-description input').val(),
          rating: $('input[name=bookmark-rating]:checked').val()
        };
        api.addItem(newItem, response => {
          store.addItem(response);
          store.deleteBookmark('undefined');
          navButtonToggle();
          render();
        });
      }
    });
  };

  const navButtonToggle = function() {
    $('.add-bookmark').toggleClass('hidden');
    $('#rating-field').toggleClass('hidden');
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

  const handleFilter = function() {
    $('#rating-field').on('change', event => {
      store.ratingFilter = $('#rating-field option:selected').val();
      render();
    });
  };

  const bindEventListeners = function(){
    handleExpandView();
    handleAddBookmarkButton();
    handleBookmarkSubmit();
    handleDeleteBookmark();
    handleFilter();
  };

  const render = function() {
    let filteredBookmarks = store.bookmarks;
    if (parseInt(store.ratingFilter) !== 0) {
      filteredBookmarks = filteredBookmarks.filter(bookmark => {
        return bookmark.rating === parseInt(store.ratingFilter);
      });
    } 
    const renderedBookmarks = renderBookmarks(filteredBookmarks);
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
    let generatedRating = `
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>`;
    if (rating !== null) {
      generatedRating =
        '<span class="fa fa-star checked" />\n'.repeat(rating) +
        '<span class="fa fa-star" />\n'.repeat(5 - rating);
    }
    return generatedRating;
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
    let expanded = `
    <div class="bookmark" data-id="${bookmark.id}">
      <h2 class="collapsible">&#9660 ${bookmark.title}</h2>
      <a href="${bookmark.url}"><p class="link">${bookmark.url}</p></a>
      <p class="description">${bookmark.desc}</p>
      ${rating}
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
    `;
    if (bookmark.editing){
      expanded = `
        <div class="bookmark" data-id="${bookmark.id}">
          <form>
            <p class="bookmark-title">Title: <input type ="text" value="${bookmark.title}"></p>
            <p class="bookmark-url">URL: <input type="url" value="${bookmark.url}"></p>
            <p class="bookmark-description">Description: <input type="text-field" value="${bookmark.desc}"></p>
            <p class="bookmark-rating">Rating: 
              <input name="bookmark-rating" type="radio" value="1">1
              <input name="bookmark-rating" type="radio" value="2">2
              <input name="bookmark-rating" type="radio" value="3">3
              <input name="bookmark-rating" type="radio" value="4">4
              <input name="bookmark-rating" type="radio" value="5">5
          <button class="cancel">Cancel</button>
          <button class="submit">Submit</button>
        </div>
        `;
    }

    return expanded;
  };

  return {
    render,
    bindEventListeners
  };
})();
