let cachedData = [];
let favorites = [];

function getMatchingData(data, queryString) {
  let matches = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      data[key].uuid = key.toString();
      if (data[key].title.toLowerCase().indexOf(queryString) !== -1) {
        matches = matches.concat(data[key]);
      } else if (data[key].keywords.toLowerCase().indexOf(queryString) !== -1) {
        matches = matches.concat(data[key]);
      }
    }
  }
  return matches;
}

//TODO loading spinner

function addToFavorites(uuid) {
  if (favorites.indexOf(uuid.toString()) === -1) {
    if (favorites.length === 0) {
      let div = document.createElement('div');
      let favBox = '<div class="favorites" id="fav-box">\
                  <h1 class="fav-title">Favourites</h1>\
                  <div class="results-container" id="favorites">\
                   </div>\
                  </div>';
      div.innerHTML = div.innerHTML.concat(favBox);
      document.getElementById('fav-footer').appendChild(div);
    }
    newFav = document.getElementById(uuid).cloneNode(true);
    newFav.setAttribute("id", "fav" + uuid);
    favorites = favorites.concat(uuid.toString());
    document.getElementById('favorites').append(newFav);
  }
}

function removeFromFavorites(uuid) {
  let ele = document.getElementById("fav" + uuid);
  ele.parentNode.removeChild(ele);
  let index = favorites.indexOf(uuid.toString());
  if (index > -1) {
    favorites.splice(index, 1);
  }
  if (favorites.length === 0) {
    let testElement = document.getElementById('fav-box');
    testElement.parentNode.removeChild(testElement);
  }
}

function changeImage(uuid) {
  let srcString = document.getElementById("star" + uuid + "").src;
  srcString = srcString.substr(srcString.length - 12);
  if (srcString === "greystar.png") {
    document.getElementById("star" + uuid + "").src = "./greenstar.png";
    addToFavorites(uuid);
  }
  else {
    document.getElementById("star" + uuid + "").src = "./greystar.png";
    removeFromFavorites(uuid);
  }
}

function appendSearchResults(matches) {
  var div = document.createElement('div');
  //remove previous search results if they exist
  let testElement = document.getElementById('dyno-results');
  if (testElement !== null) {
    testElement.parentNode.removeChild(testElement);
  }
  div.setAttribute("id", "dyno-results");
  for (var key in matches) {
    let starImg = "";
    if (favorites.indexOf(matches[key].uuid) === -1) {
      starImg = "./greystar.png";
    } else {
      starImg = "./greenstar.png";
    }
    let rowEle = "<div class='result-object' id=" + matches[key].uuid + ">";
    rowEle = rowEle.concat('<div class="result-ele0">\
                            <img class="star-icon" id= "star' + matches[key].uuid + '"\
                             onclick="changeImage(' + matches[key].uuid + ')"\
                             src=' + starImg + ' />\
                            </div>');
    rowEle = rowEle.concat('<div class="result-ele1">');
    rowEle = rowEle.concat('<text>' + matches[key].title + '</text>');
    rowEle = rowEle.concat('</div>');
    rowEle = rowEle.concat('<div class="result-ele2">');
    rowEle = rowEle.concat($("<p/>").html(matches[key].body).text());
    rowEle = rowEle.concat('</div>');
    rowEle = rowEle.concat("</div>");
    div.innerHTML = div.innerHTML.concat(rowEle);
  }
  document.getElementById('search-results').appendChild(div);
}

function searchTorontoWaste() {
  let queryString = document.getElementById("query-input").value;
  let matches = [];
  if (queryString !== "") {
    queryString = queryString.toLowerCase();
    if (cachedData.length === 0) {
      //start loading animation
      let div = document.createElement('div');
      div.innerHTML = div.innerHTML.concat('<div class="loading" id="loading">\
                            <img class="loading-spinner" src="loading-spinner.gif"></img>\
                            </div>');
      document.getElementById('search-results').appendChild(div);
      console.log(document.getElementById('search-results'));
      $.getJSON('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000', function (data) {
        cachedData = data;
        matches = getMatchingData(cachedData, queryString);
        //end loading animation
        div.parentNode.removeChild(div);
        appendSearchResults(matches);
      });
    } else {
      matches = getMatchingData(cachedData, queryString);
      appendSearchResults(matches);
    }
  }
};
