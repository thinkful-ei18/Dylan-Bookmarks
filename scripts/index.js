'use strict';
/* global api */
$(api.getItems((response) => {
  console.log(response);
}));