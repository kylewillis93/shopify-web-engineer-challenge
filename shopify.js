let cachedData = [];
let favorites = [];

function getMatchingData(data, queryString) {
  let matches = []
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
          if (data[key].title.toLowerCase().indexOf(queryString) !== -1) {
            matches = matches.concat(data[key]);
          } else if (data[key].keywords.toLowerCase().indexOf(queryString) !== -1) {
            matches = matches.concat(data[key]);
          }
      }
    }
    return matches;
}
//TODO remove favourite header when no favourites selected
//remember favorites across querries?

function addToFavorites(key){
  if ($.inArray(key, favorites) === -1) {
  console.log(document.getElementById(key));
  if (favorites.length === 0) {
    console.log('this executes');
    let div = document.createElement('div');
    let favBox = '<div id="fav-box">\
                  <h1 class="fav-title">Favourites</h1>\
                  <div class="results-container" id="favorites">\
                   </div>\
                  </div>';
    div.innerHTML = div.innerHTML.concat(favBox);
    document.getElementById('fav-footer').appendChild(div);
  }
  newFav = document.getElementById(key).cloneNode(true);
  newFav.setAttribute("id", "fav"+key);
  favorites = favorites.concat(key);
  document.getElementById('favorites').append(newFav);
  } else {
    //document.getElementById('favorites').append(newFav);

  }
}

function removeFromFavorites(key){
  let ele = document.getElementById("fav"+key);
  ele.parentNode.removeChild(ele);
  let index = favorites.indexOf(key);
  if (index > -1) {
    favorites.splice(index, 1);
  }
  if (favorites.length === 0) {
    console.log('removing favsss');
    let testElement = document.getElementById('fav-box');
    testElement.parentNode.removeChild(testElement);
  }
}

function changeImage(key) {
  let srcString = document.getElementById("star"+key+"").src;
  srcString = srcString.substr(srcString.length - 12);
  if (srcString === "greystar.png") {
      document.getElementById("star"+key+"").src = "./greenstar.png";
      addToFavorites(key);
  }
  else {
      removeFromFavorites(key);
      document.getElementById("star"+key+"").src = "./greystar.png";
  }
}

function appendSearchResults(matches){
  var div = document.createElement('div');
  div.className = 'row';
  //remove previous search results if they exist
  let testElement = document.getElementById('dyno-results');
  if (testElement !== null) {
    testElement.parentNode.removeChild(testElement);
  }
  div.setAttribute("id", "dyno-results");
  for (var key in matches) { 
    let rowEle = "<div class='result-object' id="+key+">";
    rowEle = rowEle.concat('<div class="result-ele0">\
                            <img class="star-icon" id= "star'+key+'"\
                             onclick="changeImage('+key+')"\
                             src="greystar.png" />\
                            </div>');
    rowEle = rowEle.concat('<div class="result-ele1">');
    rowEle = rowEle.concat('<text>'+matches[key].title+'</text>');
    rowEle = rowEle.concat('</div>');
    rowEle = rowEle.concat('<div class="result-ele2">');
    rowEle = rowEle.concat($("<p/>").html(matches[key].body).text());
    rowEle = rowEle.concat('</div>');
    rowEle = rowEle.concat("</div>");
    console.log(rowEle);
    div.innerHTML = div.innerHTML.concat(rowEle);
  }
  document.getElementById('search-results').appendChild(div);
}

function searchTorontoWaste (){
    let queryString = document.getElementById("query-input").value;
    let matches = [];
    if (queryString !== ""){
      queryString = queryString.toLowerCase();
    if (cachedData.length === 0) {
    $.getJSON('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000', function(data) {
    console.log(data);
    cachedData = data;
     matches = getMatchingData(cachedData, queryString);
     console.log(matches);
     appendSearchResults(matches);
    });
    } else {
      matches = getMatchingData(cachedData, queryString);
      console.log(matches);
      appendSearchResults(matches);
    }
    }
};
