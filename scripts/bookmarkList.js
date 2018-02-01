'use strict';

/* global api, index, store */

const bookmarkList = (function() {
  const getIdFromElement = function(element) {
    return $(element)
      .closest('.bookmark')
      .data('id');
  };

  const handleAddBookmarkButton = function() {
    $('.js-add-bookmark-button').on('click', event => {
      store.isEditing(true);
      navButtonToggle();
      render();
    });
  };

  const handleBookmarkSubmit = function() {
    $('.bookmark-form').on('click', '.submit', event => {
      event.preventDefault();
      if (store.editing && !store.currentlyEditing) {
        let newItem = formValues();
        api.addItem(newItem, response => {
          store.addItem(response);
          navButtonToggle();
          store.isEditing(false);
          render();
        });
      } else {
        let item = store.findById(getIdFromElement(event.currentTarget));
        const updateItem = formValues();
        api.editItem(item.id, updateItem, response => {
          store.update(item.id, updateItem);
          item.editing = false;
          store.isEditing(false);
          store.currentlyEditing = undefined;
          navButtonToggle();
          render();
        });
      }
    });
  };

  const formValues = function() {
    return {
      title: $('.title-input').val(),
      url: $('.url-input').val(),
      desc: $('.description-input').val(),
      rating: parseInt($('input[name=bookmark-rating]:checked').val())
    };
  };

  const handleBookmarkCancel = function() {
    $('.bookmark-form').on('click', '.cancel', event => {
      event.preventDefault();
      if (!store.currentlyEditing) {
        store.isEditing(false);
        render();
        navButtonToggle();
      } else {
        store.isEditing(false);
        store.currentlyEditing = undefined;
        navButtonToggle();
        render();
      }
    });
  };

  const handleEdit = function() {
    $('.bookmark-content').on('click', '.edit', event => {
      let item = store.findById(getIdFromElement(event.currentTarget));
      store.setCurrentlyEditing(item);
      navButtonToggle();
      render();
    });
  };

  const navButtonToggle = function() {
    $('.add-bookmark').toggleClass('hidden');
    $('#rating-field').toggleClass('hidden');
  };

  const handleExpandView = function() {
    $('.bookmark-content').on('click', '.collapsible', event => {
      console.log('run');
      event.preventDefault();
      const item = store.findById(getIdFromElement(event.currentTarget));
      store.update(item.id, { expanded: !item.expanded });
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

  const handlePreviousPage = function() {
    $('.pagination').on('click', '.prev-page', event => {
      store.page -= 1;
      // console.log(store.page);
      render();
    });
  };

  const handleNextPage = function() {
    $('.pagination').on('click', '.next-page', event => {
      store.page += 1;
      // console.log(store.page);
      render();
    });
  };

  const bindEventListeners = function() {
    handleExpandView();
    handleAddBookmarkButton();
    handleBookmarkSubmit();
    handleDeleteBookmark();
    handleFilter();
    handleEdit();
    handleBookmarkCancel();
    handlePreviousPage();
    handleNextPage();
  };

  const render = function() {
    let filteredBookmarks = store.bookmarks;
    if (parseInt(store.ratingFilter) !== 0) {
      filteredBookmarks = filteredBookmarks.filter(bookmark => {
        return bookmark.rating >= parseInt(store.ratingFilter);
      });
    }
    const renderedBookmarks = renderBookmarks(filteredBookmarks);
    $('.bookmark-form').html(generateEditHTML(store.currentlyEditing || {}));
    $('.bookmark-content').html(renderedBookmarks);
    $('.pagination').html(generatePagination(filteredBookmarks));
  };

  const renderBookmarks = function(bookmarks) {
    let paginatedBookmarks = [];
    for (let i = 8 * store.page - 8; i < 8 * store.page; i++) {
      if (i < bookmarks.length) {
        paginatedBookmarks.push(
          bookmarks[i].expanded
            ? generateExpandedHTML(bookmarks[i])
            : generateBookmarkHTML(bookmarks[i])
        );
      }
    }
    return paginatedBookmarks;
    // return bookmarks.map(bookmark => {
    //   return bookmark.expanded
    //     ? generateExpandedHTML(bookmark)
    //     : generateBookmarkHTML(bookmark);
    // });
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

  const generateEditRatingHTML = function(rating) {
    let generatedHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (parseInt(rating) === i) {
        generatedHTML += `<input name="bookmark-rating" type="radio" value="${i}" checked="checked">${i}\n`;
      } else {
        generatedHTML += `<input name="bookmark-rating" type="radio" value="${i}">${i}\n`;
      }
    }
    return generatedHTML;
  };

  const generateBookmarkHTML = function(bookmark) {
    const rating = generateRating(bookmark.rating);
    return `
    <div class='col-6'>
      <div class="bookmark" data-id="${bookmark.id}">
        <a href="" class="collapsible"><h2>&#9654 ${bookmark.title}</h2></a>
        ${rating}
      </div>
    </div>
    `;
  };

  const generateExpandedHTML = function(bookmark) {
    const rating = generateRating(bookmark.rating);
    let expanded = `
    <div class="col-12">
    <div class="bookmark expanded" data-id="${bookmark.id}">
      <a href="" class="collapsible"><h2>&#9660 ${bookmark.title}</h2></a>
      <a href="${
        bookmark.url
      }"><button class="link btn">Visit Site</button></a><br>
      <h4 class="expand-label">Description:</h3><p class="description">${
        bookmark.desc
      }</p><br>
      <h4 class="expand-label">Rating:</h3><p class="rating">${rating}</p>
      <button class="edit btn">Edit</button>
      <button class="delete btn">Delete</button>
      </div>
    </div>
    `;
    return expanded;
  };

  const generateEditHTML = function(bookmark) {
    let expanded = '';
    console.log("Is editing", store.editing);
    if (store.editing) {
      
      const editRating = generateEditRatingHTML(bookmark.rating);
      expanded = `
      <div class="col-12">
        <div class="bookmark editing" data-id="${bookmark.id}">
          <form>
          <div class="row">
            <div class="col-4">
              <h4 class="expand-label label-title">Title:</h3><input class="title-input" type="text" value="${
                bookmark.title || ''
              }" required minlength="1"><br>          
              <h4 class="expand-label label-url">URL:</h3><input type="text" class="url-input" value="${
                bookmark.url || ''
              }" required minlength="5"><br>
              <h4 class="expand-label label-rating">Rating:</h3> 
                ${editRating} <br>
              <button class="cancel btn">Cancel</button>
              <button class="submit btn">Submit</button> 
            </div>

            <div class="col-6">
              <h4 class="expand-label label-description">Description:</h3><textarea class="description-input">${
                bookmark.desc || ''
              }</textarea><br>             
            </div>
          </div>  
        </div>
      </div>
        `;
    }
    console.log("Expanded html", expanded);
    return expanded;
  };

  const generatePagination = function(bookmarks) {
    let paginationHTML = '';
    paginationHTML = `<div class="col-12"><div class="page-links"><button class="prev-page btn" ${
      store.page !== 1 ? '' : 'disabled'
    }>Previous Page</button>
      Page: ${store.page}
      <button class="next-page btn" ${
        bookmarks.length > store.page * 8 ? '' : 'disabled'
      }>Next Page</button></div></div>`;
    return paginationHTML;
  };

  return {
    render,
    bindEventListeners
  };
})();
