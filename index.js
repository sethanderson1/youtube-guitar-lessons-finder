let history = ['landing-page'];
let current = 0;
const baseURL = `https://musicbrainz.org/ws/2/`;
const limit = 100;


const apiKey = "AIzaSyDGKOzZyFJ8UlnWrOkERNKchAixOyT9ZZQ";//mine

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
    if (history.length >= 1) {
      history.push($(this).closest('section').attr('id'));
    } 
    if (current == 0) {
      $('.js-back-button-container').hide()
    } else {
      $('.js-back-button-container').show()
    };
  });
};

function backButton() {
  $('.js-back-button-container').on('click', function (event) {
    const prev = current - 1;
    resetVideoResultsData();
    const prevPage = history[prev];
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
  const itemCount = !STORE.artistQueryResponse ? 0 : STORE.artistQueryResponse.count;
  const pageCount = Math.ceil(itemCount / STORE.artistResultsPerPage);
  if (STORE.artistCurrentPageNumber < pageCount) {
    return STORE.artistCurrentPageNumber + 1;
  };
  return null;
};

function getNextPageAlbums() {
  const itemCount = STORE.releaseGroupResponseReleaseGroupFiltered.length;
  const pageCount = Math.ceil(itemCount / STORE.albumsResultsPerPage);
  if (STORE.albumsCurrentPageNumber < pageCount) {
    return STORE.albumsCurrentPageNumber + 1;
  }
  return null;
};

function getNextPageVideos() {
  const itemCount = STORE.videosCount;
  const pageCount = Math.ceil(itemCount / STORE.videosResultsPerPage);
  if (STORE.videosCurrentPageNumber < pageCount) {
    return STORE.videosCurrentPageNumber + 1;
  }
  return null;
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
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
  // create nav buttons
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
      getArtistListFromQuery();
    })
    $(".artists-list-nav").append(pageNum).append($next);
  }
  $("#results").removeClass("hidden");
};

// displays list of Release Groups (ie albums)
function displayReleaseGroupsList() {
  $(".albums-page").empty();
  $(".albums-page").removeClass('hidden');
  $('.albums-page').append(`
  <section class="albums-heading-container">
  <h2 class="albums-results-title">${STORE.selectedArtist}</h2>
  </section>`
  );
  const artistMBID = STORE.artistMBID;
  const albums = STORE.releaseGroupResponseReleaseGroupFiltered;
  const offset = makeOffsetAlbums(STORE.albumsCurrentPageNumber);
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
  STORE.albumsNextPageNumber = null;
  if (nextPage) {
    STORE.albumsNextPageNumber = nextPage;
  };
  STORE.albumsPrevPageNumber = null;
  if (STORE.albumsCurrentPageNumber > 1) {
    STORE.albumsPrevPageNumber = STORE.albumsCurrentPageNumber - 1;
  };
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
      STORE.albumsCurrentPageNumber = STORE.albumsNextPageNumber;
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
  $('.videos-page').append(`
  <div class="videos">
    <ul class="videos-list list grid-container"></ul>
    <div class="videos-list-nav-wrapper">
      <nav class="videos-list-nav" role="navigation"></nav>
    </div>
  </div>`)

  for (let i = 0; i < responseJson.items.length; i++) {
    // localStorage.setItem(`https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}`, `https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}`)
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
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      // console.log('getArtistListFromQuery() response:', responseJson);
      STORE.artistQueryResponse = responseJson;
      const nextPage = getNextPageArtists();
      // console.log('next page:', nextPage);
      STORE.artistNextPageNumber = null;
      if (nextPage) {
        STORE.artistNextPageNumber = nextPage;
      };
      STORE.artistPrevPageNumber = null
      if (STORE.artistCurrentPageNumber > 1) {
        STORE.artistPrevPageNumber = STORE.artistCurrentPageNumber - 1;
      };
      displayArtistList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getReleaseGroupsFromArtistID(artistMBID) {
  let pagesCount = 1; 
  const fetches = [];
  for (let i = 0; i < pagesCount; i++) {
    const offset = limit * i;
    const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`;
    fetches.push(
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => {
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
    filteredReleaseGroupResponse(STORE.releaseGroupResponseReleaseGroup);
    sortReleaseGroupsByDate(STORE.releaseGroupResponseReleaseGroupFiltered);
    // getAlbumArt(STORE.releaseGroupResponseReleaseGroupFiltered);
    displayReleaseGroupsList();
  })
  let test = [];
  let filterConditions = [];

  // filtering out unwanted album types (eg audiobooks, compilations)
  function filteredReleaseGroupResponse(array) {
    const filteredArr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === `8d5f4b07-7e2e-4ffa-ac90-e4772c4d8525`) {
        test.push(array[i]);
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
  fetch(url)
    .then(response => {
      if (response.ok) {
        // console.log(response);
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      STORE.releasesQueryResponse = responseJson;
      getTracksFromReleaseID(STORE.releasesQueryResponse.releases[0].id);
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
};

function getTracksFromReleaseID(releaseID) {
  const url = `${baseURL}release/${releaseID}?inc=recordings&fmt=json`
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      STORE.tracksQueryResponse = responseJson;
      displayTracksList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
};

function getYouTubeVideos(trackTitle) {
  const params = {
    key: apiKey,
    q: `"${STORE.selectedArtist}" "${trackTitle}" guitar lesson`,
    part: "snippet",
    maxResults: '10',
    type: "video",
    order: 'relevance',
  };
  if (STORE.nextPageToken[STORE.videosCurrentPageNumber - 1] !== null) {
    params.pageToken = STORE.nextPageToken[STORE.videosCurrentPageNumber - 1]
  }
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      STORE.nextPageToken.push(responseJson.nextPageToken);
      STORE.videosCount = responseJson.pageInfo.totalResults;
      displayVideoResults(responseJson)
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
    $('.js-back-button-container').show();
    const artist = $('#js-search-term').val();
    STORE.artistQuery = encodeURIComponent(artist)
    getArtistListFromQuery();
    $('#js-search-term').val('')
    $('.landing-page').hide();
  });
};

function handleSelectArtist() {
  $('.artists-page').on('click', '.artist-name', function (event) {
    event.preventDefault();
    $('.artists-page').addClass('hidden')
    STORE.artistID = $(event.target).attr('data-id');
    getReleaseGroupsFromArtistID($(event.target).attr('data-id'));
    STORE.selectedArtist = $(event.target).text();
    resetReleaseGroupsData()
  })
};

function handleSelectReleaseGroup() {
  $('.albums-page').on('click', '.album-name', function (event) {
    event.preventDefault();
    $('.albums-page').addClass('hidden')
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
    getYouTubeVideos($(event.target).closest($('.tracks-item')).find($('.track-name')).text());

  })
};

function handleClickHome() {
  $('.main-heading').on('click', function (event) {
    event.preventDefault();
    $('.landing-page').show();
    $('.back-button').hide();
    resetAll();
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