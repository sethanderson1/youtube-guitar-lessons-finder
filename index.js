// handle 403 error
// handle if no results


let history = ['landing-page'];
let current = 0;
const baseURL = `https://musicbrainz.org/ws/2/`;
const limit = 100;
// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey = "AIzaSyD6-lRx5UycdxnQjqe3XkHosizKWZE9jrc" //mine 
const apiKey = "AIzaSyCswVioUHuC_WDjzsevANxMYcOIJJOqI1s"; // mine
// const apiKey = "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";
// const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
// const apiKey = "AIzaSyBkK8PEuhSfyz05gnUWhwOuE5cqWV5Oa3A";
// const apiKey = "AIzaSyCkW6a36vDIcdoHBAmjyKTo2r6gki-MYfY";
// const apiKey = "AIzaSyCAYorWuqzvRAPmNRs8C95Smp7hhdATzc8"
const searchURL = "https://www.googleapis.com/youtube/v3/search";
const STORE = {
  artistQuery: ``,
  artistQueryResponse: "",
  releaseGroupsQueryResponse: "",
  releasesQueryResponse: ``,
  tracksQueryResponse: "",

  artistMBID: '',

  releaseGroupResponse: [],
  releaseGroupResponseReleaseGroup: [],
  releaseDate: [],
  sortedReleaseGroupDates: null,
  releaseGroupResponseReleaseGroupFiltered: null,
  releaseGroupCount: null,

  // releaseID: null,


  artistResultsPerPage: 10,
  artistCurrentPageNumber: 1,
  artistNextPageNumber: null,
  artistPrevPageNumber: null,

  albumsResultsPerPage: 12,
  albumsCurrentPageNumber: 1,
  albumsNextPageNumber: null,
  albumsPrevPageNumber: null,

  tracksResultsPerPage: 5,
  tracksCurrentPageNumber: 1,
  tracksNextPageNumber: null,
  tracksPrevPageNumber: null,

  trackTitle: null,

  videosResultsPerPage: 10,
  videosCurrentPageNumber: 1,
  videosNextPageNumber: null,
  videosPrevPageNumber: null,
};

function incrementHistory() {
  $('body').on('click', '.item', function (event) {
    current++;
    console.log(`current`, current)
    console.log('this',this)
    if (history.length >= 1) {
      history.push($(this).closest('section').attr('id'));
    } 
    console.log(`history`, history);
    if (current == 0) {
      $('.js-back-button-container').hide()
    } else {
      $('.js-back-button-container').show()
    };
    console.log(`current is still......`, current)
  });
};

function backButton() {
  $('.js-back-button-container').on('click', function (event) {
    const prev = current - 1;
    resetVideoResultsData();
    console.log('back button clicked');
    console.log(`current`, current);
    const prevPage = history[prev];
    console.log('prevPage ', prevPage);
    // hide current page
    $('body').find($('.results-page').not('hidden').addClass('hidden'));
    $('body').find($('#' + prevPage)).removeClass('hidden');
    history.pop();
    current == 0 ? 0 : current -= 1;
    if (current==0) {
      $('.js-back-button-container').hide()
      $('.landing-page').show();
    } else {
      $('.js-back-button-container').show()
    }
  });
};

function resetAll() {
  // clears lists in case user decides 
  // to search after lists have been generated
  $('.artists-page').addClass('hidden');
  $('.albums-page').addClass('hidden');
  $('.tracks-page').addClass('hidden');
  $('.videos-page').addClass('hidden');
  current = 0;
  history = ['landing-page'];
  // $('.tracks-list').empty();
  // $('.videos-list').empty();
  $('.list').addClass('hidden');

  STORE.artistQuery = ``;
  STORE.artistQueryResponse = "";
  STORE.releaseGroupsQueryResponse = "";
  STORE.releasesQueryResponse = ``;
  STORE.tracksQueryResponse = "";

  STORE.artistMBID = '';

  STORE.releaseGroupResponse = [];
  STORE.releaseGroupResponseReleaseGroup = [];
  STORE.releaseDate = [];
  STORE.sortedReleaseGroupDates = null;
  STORE.releaseGroupResponseReleaseGroupFiltered = null;
  // STORE.releaseID= null;


  STORE.artistResultsPerPage = 10;
  STORE.artistCurrentPageNumber = 1;
  STORE.artistNextPageNumber = null;
  STORE.artistPrevPageNumber = null;

  STORE.albumsResultsPerPage = 12;
  STORE.albumsCurrentPageNumber = 1;
  STORE.albumsNextPageNumber = null;
  STORE.albumsPrevPageNumber = null;

  STORE.tracksResultsPerPage = 5;
  STORE.tracksCurrentPageNumber = 1;
  STORE.tracksNextPageNumber = null;
  STORE.tracksPrevPageNumber = null;

  STORE.videosResultsPerPage = 10;
  STORE.videosCurrentPageNumber = 1;
  STORE.videosNextPageNumber = null;
  STORE.videosPrevPageNumber = null;

  STORE.videosCount = null;

  STORE.nextPageToken = [null];


};

function resetReleaseGroupsData() {
  STORE.releaseGroupResponse = [];
  STORE.releaseGroupResponseReleaseGroup = [];
  STORE.releaseDate = [];
  STORE.sortedReleaseGroupDates = null;
  STORE.releaseGroupResponseReleaseGroupFiltered = null;

  STORE.albumsResultsPerPage = 12;
  STORE.albumsCurrentPageNumber = 1;
  STORE.albumsNextPageNumber = null;
  STORE.albumsPrevPageNumber = null;

  // reset nav buttons too

};

function resetVideoResultsData() {
  STORE.nextPageToken = [null];
  STORE.videosCurrentPageNumber = 1;
  STORE.videosNextPageNumber = null;
  STORE.videosPrevPageNumber = null;

  STORE.videosCount = null;
  $(".videos-page").empty();


};

function makeOffsetArtists(pageNum) {
  return (pageNum - 1) * STORE.artistResultsPerPage;
};

function makeOffsetAlbums(pageNum) {
  return (pageNum - 1) * STORE.albumsResultsPerPage;
};

function getNextPageArtists() {
  console.log('STORE.artistQueryResponse(): ', STORE.artistQueryResponse);
  const itemCount = !STORE.artistQueryResponse ? 0 : STORE.artistQueryResponse.count;
  const pageCount = Math.ceil(itemCount / STORE.artistResultsPerPage);
  console.log('pageCount ', pageCount);
  if (STORE.artistCurrentPageNumber < pageCount) {
    return STORE.artistCurrentPageNumber + 1;
  };
  return null;
};

function getNextPageAlbums() {
  console.log('getNextPageAlbums() triggered');
  const itemCount = STORE.releaseGroupResponseReleaseGroupFiltered.length;
  console.log(`STORE.releaseGroupResponseReleaseGroupFiltered.length`, STORE.releaseGroupResponseReleaseGroupFiltered.length);
  const pageCount = Math.ceil(itemCount / STORE.albumsResultsPerPage);
  console.log('pageCount', pageCount);
  if (STORE.albumsCurrentPageNumber < pageCount) {
    return STORE.albumsCurrentPageNumber + 1;
  }
  return null;
};

function getNextPageVideos() {
  console.log('getNextPageVideos() triggered');
  const itemCount = STORE.videosCount;
  console.log(' getNextPageVideos() itemCount', itemCount, STORE.videosCount);
  console.log(' videosCurrentPageNumber()', STORE.videosCurrentPageNumber);
  const pageCount = Math.ceil(itemCount / STORE.videosResultsPerPage);
  console.log('pageCount', pageCount);
  if (STORE.videosCurrentPageNumber < pageCount) {
    return STORE.videosCurrentPageNumber + 1;
  }
  return null;
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  console.log("queryItems ", queryItems);
  return queryItems.join("&");
};

///     DISPLAYERS      //////////////


function displayArtistList() {
  $(".artists-page").empty();
  $('.artists-page').removeClass('hidden');
  $('.artists-page').append(
  `<section class="artists-heading-container">
    <h2 class="artist-results-title">Artist</h2>
   </section>`
  );
  const artists = STORE.artistQueryResponse.artists;
  console.log('displayArtistList() artists.length', artists.length);
  $('.artists-page').append(`
                <div class="artists">
                    <ul class="artists-list list"></ul>
                    <div class="artists-list-nav-wrapper">
                       <nav class="artists-list-nav" role="navigation"></nav>
                    </div>
                </div>`);
  for (let i = 0; i < artists.length; i++) {
    $(".artists-list").append(
      `<li class="artist-item">
      <p class="artist-name hover-link pointer item"
      data-id=${artists[i].id}>${artists[i].name}</p>
      </li>`
    );
  };
  $(".artists-list-nav").empty();

  if (STORE.artistCurrentPageNumber == 1) {
    const btn = `<button class="prev-artist-button hover-link"><i class="fa fa-angle-left"></i> prev</button>`;
    const $btn = $(btn);
    $(".artists-list-nav").append($btn);
  };

  if (STORE.artistPrevPageNumber) {
    const btn = `<button class="prev-artist-button hover-link"><i class="fa fa-angle-left"></i> prev</button>`;
    const $btn = $(btn);
    $btn.click(ev => {
      ev.preventDefault();
      STORE.artistCurrentPageNumber = STORE.artistPrevPageNumber;
      // console.log('PREV PAGE',STORE.artistCurrentPageNumber);
      getArtistListFromQuery();
    });
    $(".artists-list-nav").append($btn);
  };
  if (STORE.artistNextPageNumber == null) {
    const pageNum = `<span class="artist-page-number">${STORE.artistCurrentPageNumber}</span>`;
    const nextBtn = `<button class="next-artist-button hover-link">next <i class="fa fa-angle-right"></i></button>`;
    const $next = $(nextBtn);
    $next.click(ev => {
      ev.preventDefault();
    });
    $(".artists-list-nav").append(pageNum).append($next);
  };
  if (STORE.artistNextPageNumber) {
    const pageNum = `<span class="artist-page-number">${STORE.artistCurrentPageNumber}</span>`;
    const nextBtn = `<button class="next-artist-button hover-link">next <i class="fa fa-angle-right"></i></button>`;
    const $next = $(nextBtn);
    $next.click(ev => {
      ev.preventDefault();
      STORE.artistCurrentPageNumber = STORE.artistNextPageNumber;
      console.log('NEXT PAGE');
      getArtistListFromQuery();
    })
    $(".artists-list-nav").append(pageNum).append($next);
  }
  $("#results").removeClass("hidden");
};

function displayReleaseGroupsList() {
  console.log(`displayReleaseGroupsList() triggered`);
  $(".albums-page").empty();
  $(".albums-page").removeClass('hidden');
  $('.albums-page').append(`
  <section class="albums-heading-container">
  <h2 class="albums-results-title">${STORE.selectedArtist}</h2>
  </section>`
  );
  const artistMBID = STORE.artistMBID;
  const albums = STORE.releaseGroupResponseReleaseGroupFiltered;
  console.log(`albums`, albums);
  const offset = makeOffsetAlbums(STORE.albumsCurrentPageNumber);
  console.log(`offset`, offset);
  $('.albums-page').append(`
  <div class="albums">
      <ul class="albums-list list"></ul>
      <div class="albums-list-nav-wrapper">
        <nav class="albums-list-nav" role="navigation"></nav>
      </div>
  </div>`);
  let offsetPlus = Math.min(offset + STORE.albumsResultsPerPage, albums.length);
  const thumbnailSize = 250;
  let thumbnail;
  for (let i = offset; i < offsetPlus; i++) {
    offsetPlus = Math.min(offset + STORE.albumsResultsPerPage, albums.length);
    // console.log('offset + STORE.albumsResultsPerPage', offset + STORE.albumsResultsPerPage);
    // console.log('albums.length-1', albums.length);
    // console.log('offsetPlus', offsetPlus);
    // console.log(i + ' ' + albums[i].title);
    // console.log('i', i);
    $(".albums-list").append(
      `<li class="albums-item album-name item" data-id=${albums[i].id}>
      <div class="album-info-wrapper " data-id=${albums[i].id}>
        <p class="album-title-name pointer " data-id=${albums[i].id}><span class="album-name album-title pointer"
          data-id=${albums[i].id}>${albums[i].title}</span></p>
        <p class="album-date pointer " data-id=${albums[i].id}><span class="album-name "
          data-id=${albums[i].id}>${albums[i][`first-release-date`].slice(0, 4)}</span></p>
              <div class="thumbnail-container " data-id=${albums[i].id}>
                  <img 
                  aria-label="${albums[i].title} cover art"
                  class="album-name pointer  album-image" data-id=${albums[i].id}
                      src="http://coverartarchive.org/release-group/${albums[i].id}/front-${thumbnailSize}" 
                      alt="album cover art">
              </div>
        </div>
       </li>`
    );
  };
  $(".albums-list-nav").empty();
  const nextPage = getNextPageAlbums();
  console.log('next page', nextPage);
  STORE.albumsNextPageNumber = null;
  if (nextPage) {
    STORE.albumsNextPageNumber = nextPage;
  };
  console.log('STORE.albumsPrevPageNumber', STORE.albumsPrevPageNumber);
  STORE.albumsPrevPageNumber = null;
  if (STORE.albumsCurrentPageNumber > 1) {
    STORE.albumsPrevPageNumber = STORE.albumsCurrentPageNumber - 1;
    console.log('STORE.albumsPrevPageNumber', STORE.albumsPrevPageNumber);
  };
  console.log('STORE.albumsPrevPageNumber', STORE.albumsPrevPageNumber);
  if (STORE.albumsCurrentPageNumber == 1) {
    const btn = `<button class="prev-albums-button hover-link"><i class="fa fa-angle-left"></i> prev</button>`;
    const $btn = $(btn);
    $(".albums-list-nav").append($btn);
  };
  if (STORE.albumsPrevPageNumber) {
    const btn = ` <button class="prev-albums-button hover-link"><i class="fa fa-angle-left"></i> prev</button>`;
    const $btn = $(btn);
    $btn.click(ev => {
      ev.preventDefault();
      STORE.albumsCurrentPageNumber = STORE.albumsPrevPageNumber;
      console.log('PREV PAGE', STORE.albumsCurrentPageNumber);
      displayReleaseGroupsList();
    })
    $(".albums-list-nav").append($btn);
  };
  if (STORE.albumsNextPageNumber == null) {
    const pageNum = `<span class="albums-page-number">${STORE.albumsCurrentPageNumber}</span>`;
    const nextBtn = `<button class="next-albums-button hover-link">next <i class="fa fa-angle-right"></i></button>`;
    const $next = $(nextBtn);
    $(".albums-list-nav").append(pageNum).append($next);
  };
  if (STORE.albumsNextPageNumber) {
    const pageNum = `<span class="albums-page-number">${STORE.albumsCurrentPageNumber}</span>`;
    const nextBtn = `<a href="#top"> 
                      <button class="next-albums-button hover-link">next <i class="fa fa-angle-right"></i></button>
                    </a>`;
    const $next = $(nextBtn);
    $next.click(ev => {
      // ev.preventDefault();
      STORE.albumsCurrentPageNumber = STORE.albumsNextPageNumber;
      console.log('STORE.albumsCurrentPageNumber', STORE.albumsCurrentPageNumber);
      console.log('albums NEXT PAGE');
      displayReleaseGroupsList()
    })
    $(".albums-list-nav").append(pageNum).append($next);
  };
  $("#results").removeClass("hidden");
};

function displayTracksList() {
  $(".tracks-page").empty();
  $('.tracks-page').removeClass('hidden');
  const thumbnailSize = 500;
  $('.tracks-page').append(`
  <section class="tracks-heading-container">
    <p class="tracks-results-title">${STORE.selectedAlbumTitle}</p>
    <div class="album-cover-container"> 
      <img id="album-cover-tracks-page" 
      src="http://coverartarchive.org/release-group/${STORE.selectedAlbumID}/front-${thumbnailSize}"
      alt="album cover art">
    </div>
  </section>`
  );
  const tracks = STORE.tracksQueryResponse["media"];
  $('.tracks-page').append(
    `<div class="tracks">
       <ul class="tracks-list list"></ul>
       <nav class="tracks-list-nav" role="navigation"></nav>
    </div>`
  );
  for (let i = 0; i < tracks[0].tracks.length; i++) {
    console.log(i + ' ' + tracks[0].tracks[i].title);
    $(".tracks-list").append(
      `<li class="tracks-item item">
          <p><span class="track-name pointer">${tracks[0].tracks[i].title}</span></p>
      </li>`
    );
  };
};

function displayVideoResults(responseJson) {
  $(".videos-page").empty();
  $('.videos-page').removeClass('hidden')
  console.log('from displayVideoResults() ', responseJson);
  console.log('from displayVideoResults() ', responseJson.items.length);
  $('.videos-page').append(`
  <div class="videos">
    <ul class="videos-list list grid-container"></ul>
    <div class="videos-list-nav-wrapper">
      <nav class="videos-list-nav" role="navigation"></nav>
    </div>
  </div>`)

  for (let i = 0; i < responseJson.items.length; i++) {
    // localStorage.setItem(`https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}`, `https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}`)
    console.log('responseJson.items[i].id.videoId', responseJson.items[i].id.videoId)
    $(".videos-list").append(
      `<li class="grid-item">
      <div class="video-title-summary-box">
          <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank">
              <h2 class="video-title clampedText clampedLines2">${responseJson.items[i].snippet.title}</h2>
          </a>
      </div>
      <div class="embedded-video-container">
          <iframe class="embedded-video" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}"
              allowfullscreen aria-label="${responseJson.items[i].snippet.title} video"></iframe>
      </div>
      </li>`
    );
  }
  $(".videos-list-nav").empty();

  const nextPage = getNextPageVideos()
  console.log('next page displayVideoResults', nextPage);
  STORE.videosNextPageNumber = null;
  if (nextPage) {
    STORE.videosNextPageNumber = nextPage;
  };
  STORE.videosPrevPageNumber = null;
  if (STORE.videosCurrentPageNumber > 1) {
    STORE.videosPrevPageNumber = STORE.videosCurrentPageNumber - 1;
  };
  if (STORE.videosCurrentPageNumber == 1) {
    const btn = `<button class="prev-videos-button"><i class="fa fa-angle-left"></i> prev</button>`;
    const $btn = $(btn);
    $(".videos-list-nav").append($btn);
  };
  if (STORE.videosPrevPageNumber) {
    const btn = `<button class="prev-videos-button"><i class="fa fa-angle-left"></i> prev</button>`;
    const $btn = $(btn);
    $btn.click(ev => {
      ev.preventDefault();
      STORE.videosCurrentPageNumber = STORE.videosPrevPageNumber;
      STORE.nextPageToken.pop();
      getYouTubeVideos(STORE.trackTitle);
    })
    $(".videos-list-nav").append($btn);
  };
  if (STORE.videosNextPageNumber == null) {
    const pageNum = `<span class="videos-page-number">${STORE.videosCurrentPageNumber}</span>`;
    const nextBtn = `<button class="next-videos-button">next <i class="fa fa-angle-right"></i>
                    </button>`;
    const $next = $(nextBtn);
    $(".videos-list-nav").append(pageNum).append($next);
  }
  if (STORE.videosNextPageNumber) {
    const pageNum = `<span class="videos-page-number">${STORE.videosCurrentPageNumber}</span>`;
    const nextBtn = `<a href="#top"> 
                      <button class="next-videos-button">next <i class="fa fa-angle-right"></i></button>
                    </a>`;
    const $next = $(nextBtn)
    $next.click(ev => {
      //   ev.preventDefault()
      STORE.videosCurrentPageNumber = STORE.videosNextPageNumber;
      getYouTubeVideos(STORE.trackTitle);
    })
    $(".videos-list-nav").append(pageNum).append($next);
  }
  $("#results").removeClass("hidden");
}

///     GETTERS      //////////////

function getArtistListFromQuery() {
  const artist = STORE.artistQuery;
  let offset = makeOffsetArtists(STORE.artistCurrentPageNumber);
  let url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}&limit=${STORE.artistResultsPerPage}`;
  console.log("query artist url ", url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      console.log('getArtistListFromQuery() response:', responseJson);
      STORE.artistQueryResponse = responseJson;
      const nextPage = getNextPageArtists();
      console.log('next page:', nextPage);
      STORE.artistNextPageNumber = null;
      if (nextPage) {
        // offset = makeOffsetArtists(nextPage)
        // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
        STORE.artistNextPageNumber = nextPage;
      };
      STORE.artistPrevPageNumber = null
      if (STORE.artistCurrentPageNumber > 1) {
        // offset = makeOffsetArtists(STORE.artistCurrentPageNumber-1)
        // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
        STORE.artistPrevPageNumber = STORE.artistCurrentPageNumber - 1;
      };
      displayArtistList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getReleaseGroupsFromArtistID(artistMBID) {
  // let releaseGroupCount = 715;
  // const releaseGroupCount = STORE.releaseGroupResponse[`release-group-count`]
  // console.log(releaseGroupCount)
  // console.log('releaseGroupCount', STORE.releasegro)
  // let pagesCount = Math.ceil(releaseGroupCount / limit)
  let pagesCount = 1; // just a placeholder value
  const fetches = [];
  for (let i = 0; i < pagesCount; i++) {
    const offset = limit * i;
    const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`;
    // const savedURL = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`;
    console.log(`getReleaseGroupsFromArtistID() url`, url);
    fetches.push(
      fetch(url)
        .then(response => {
          if (response.ok) {
            // console.log('response.json() ', response);
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => {
          console.log('responseJson', responseJson);
          STORE.releaseGroupResponse.push(responseJson);
          STORE.releaseGroupResponseReleaseGroup.push(responseJson[`release-groups`]);
        })
        .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        })
    )
    STORE.releaseGroupCount = STORE.releaseGroupResponse[`release-group-count`];
    pagesCount = STORE.releaseGroupCount;
  }
  Promise.all(fetches).then(() => {
    STORE.releaseGroupResponseReleaseGroup = STORE.releaseGroupResponseReleaseGroup.flat();
    // console.log(STORE.releaseGroupResponseReleaseGroup)
    filteredReleaseGroupResponse(STORE.releaseGroupResponseReleaseGroup);
    sortReleaseGroupsByDate(STORE.releaseGroupResponseReleaseGroupFiltered);
    // ** getAlbumArt() needs to finish before can display
    getAlbumArt(STORE.releaseGroupResponseReleaseGroupFiltered);
    displayReleaseGroupsList();
  })
  // include Live in secondary types and maybe soundtracks and 
  // other things. 
  let test = [];
  let filterConditions = [];

  function filteredReleaseGroupResponse(array) {
    const filteredArr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === `8d5f4b07-7e2e-4ffa-ac90-e4772c4d8525`) {
        test.push(array[i]);
        console.log('test', array[i]);
      }
      filterConditions = [
        array[i][`first-release-date`].length > 0,
        array[i][`secondary-types`].length == 0,
        // array[i][`secondary-types`][0] == 'Compilation',
        array[i][`primary-type`] != `Single`,
        array[i][`primary-type`] != `EP`,
        array[i][`primary-type`] != `Compilation`,
        array[i][`primary-type`] != `Remix`,
        array[i][`primary-type`] != `Interview`,
        array[i][`primary-type`] != `Audiobook`,
        array[i][`primary-type`] != `Other`,
      ];
      if (filterConditions.every(a => a === true)) {
        filteredArr.push(array[i]);
      };
    };
    STORE.releaseGroupResponseReleaseGroupFiltered = filteredArr;
  };

  function getAlbumArt(albums) {
    console.log(`getAlbumArt(releasegroupID) invoked`)
    let url = ``;
    for (let i = 0; i < albums.length; i++) {
      url = `http://coverartarchive.org/release-group/${albums[i].id}/front-250`;
      // console.log('albums[i]', albums[i].title, albums[i].id);
      fetch(url).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
        .then(responseJson => {
          // console.log('getAlbumArt() responseJson', responseJson);
        })
        .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        })
    }
  };

  function sortReleaseGroupsByDate(toBeSorted) {
    toBeSorted.sort(function (a, b) {
      a = new Date(a[`first-release-date`]);
      b = new Date(b[`first-release-date`]);
      return a - b;
    })
  };
}

function getReleasesFromReleaseGroupID(releaseGroupID) {
  const url = `https://musicbrainz.org/ws/2/release-group/${releaseGroupID}?inc=releases&fmt=json`
  console.log("query releases url ", url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      console.log(responseJson);
      STORE.releasesQueryResponse = responseJson;
      // *** where to put the below
      // STORE.releaseID = STORE.releasesQueryResponse.releases[0].id
      console.log('should be releaseID ', STORE.releasesQueryResponse.releases[0].id);
      getTracksFromReleaseID(STORE.releasesQueryResponse.releases[0].id);
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
};

function getTracksFromReleaseID(releaseID) {
  const url = `${baseURL}release/${releaseID}?inc=recordings&fmt=json`
  console.log("query tracks url ", url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      console.log(responseJson);
      STORE.tracksQueryResponse = responseJson;
      displayTracksList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
};

const cache = {};

function getYouTubeVideos(trackTitle) {
  const params = {
    key: apiKey,
    q: `"${STORE.selectedArtist}" "${trackTitle}" guitar lesson`,
    part: "snippet",
    maxResults: '10',
    type: "video",
    order: 'relevance',
  };
  // ** below condition might not be correct. check it.. 
  if (STORE.nextPageToken[STORE.videosCurrentPageNumber - 1] !== null) {
    params.pageToken = STORE.nextPageToken[STORE.videosCurrentPageNumber - 1]
  }
  console.log('videos current page number:', STORE.videosCurrentPageNumber)
  console.log('STORE.nextPageToken:', STORE.nextPageToken)
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  console.log('getYouTubeVideos()', url);
  //   debugger

  // if(cache[url]){
  //     console.log('cached youtube videos response', cache[url])
  //       displayVideoResults(cache[url])
  //       return
  // }  

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      // console.log(response.json())
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      // cache[url]=responseJson  
      console.log('responseJson.nextPageToken', responseJson.nextPageToken)
      STORE.nextPageToken.push(responseJson.nextPageToken);
      STORE.videosCount = responseJson.pageInfo.totalResults;
      console.log('youtube videos response', responseJson)
      displayVideoResults(responseJson)
      console.log('STORE.videosCount', STORE.videosCount)
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
};

///     HANDLERS      //////////////

function handleSearchForm() {
  $("form").submit(event => {
    event.preventDefault();
    resetAll()
    current = 1;
    // $('.js-back-button-container').removeClass('hidden')
    $('.js-back-button-container').show();
    // $('.artists-page').removeClass('hidden')
    // $('.artists-list-nav').removeClass('hidden')
    const artist = $('#js-search-term').val();
    console.log('artist query:', artist)
    STORE.artistQuery = encodeURIComponent(artist)
    getArtistListFromQuery();
    $('#js-search-term').val('')
    // console.log(encodeURIComponent(artist))
    $('.landing-page').hide();
    // console.log(2434)
  });
};

function handleSelectArtist() {
  $('.artists-page').on('click', '.artist-name', function (event) {
    event.preventDefault();
    $('.artists-page').addClass('hidden')
    console.log('event target: clicked', $(event.target).text())
    // console.log('event target: clicked', $(event.target).attr('id'))
    STORE.artistID = $(event.target).attr('data-id');
    getReleaseGroupsFromArtistID($(event.target).attr('data-id'));
    console.log('selected Artist ', $(event.target).text())
    STORE.selectedArtist = $(event.target).text();
    resetReleaseGroupsData()
  })
  // gets release groups (basically release group is an album)
};

function handleSelectReleaseGroup() {
  $('.albums-page').on('click', '.album-name', function (event) {
    event.preventDefault();
    $('.albums-page').addClass('hidden')
    console.log('event target: clicked', $(event.target).text())
    console.log('album name',
      $(event.target).closest($('.albums-item')).find($('.album-title')).text()
    )
    STORE.selectedAlbumTitle = $(event.target).closest($('.albums-item')).find($('.album-title')).text()
    STORE.selectedAlbumID = $(event.target).attr('data-id');
    getReleasesFromReleaseGroupID($(event.target).attr('data-id'));
  })
};

function handleSelectTrack() {
  $('.tracks-page').on('click', '.tracks-item', function (event) {
    event.preventDefault();
    resetVideoResultsData();
    $('.tracks-page').addClass('hidden');
    STORE.trackTitle = $(event.target).text();
    console.log('event target track: clicked', $(event.target).closest($('.tracks-item')).find($('.track-name')).text());
    getYouTubeVideos($(event.target).closest($('.tracks-item')).find($('.track-name')).text());

  })
};

function handleClickHome() {
  $('.main-heading').on('click', function (event) {
    event.preventDefault();
    console.log('handleClickHome() triggered');
    $('.landing-page').show();
    $('.back-button').hide();
    resetAll();
    console.log(`current`, current);

  })
};

function watchForm() {
  backButton();
  incrementHistory();
  handleSearchForm();
  handleSelectArtist();
  handleSelectReleaseGroup();
  handleSelectTrack();
  handleClickHome();
};

$(watchForm);