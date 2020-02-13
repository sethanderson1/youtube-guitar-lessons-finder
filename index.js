// ** to fix: 
// 1.)  make it so that can only click on a list item, 
// not the whole wide block of the item
// and not somewhere outside the item
// should i make them anchors maybe?
// 2.) hide artist buttons upon
// going to next step
// *********
// make logic for makeoffsetArtist and nextpage
// make album buttons
// ** 
// need to catch 503 errors. maybe response to 
// 503 error should be trying again after 1 second?

// add prev and next buttons to albums page

// make sure everything gets reset in resetAll()

// put in back button for going back from videos
// list to track list and track to album and 
// album to artist. would be nice to not have to
// refetch when we go back 

// figure out why album prev next buttons dont 
// appear after i go back to start and then 
// get albums

// fix prev and next buttons dessapear when you
// get to last nav page .

//should i try to wait for all thumbnails to be 
// fetched before loading page?

// dates: if only comes back with the year, 
// its ordered as if its jan 1 of that year,
// maybe i should change to like jun 1 

// make max results button

// 


let history = [];

let current = 0;

// base url
const baseURL = `https://musicbrainz.org/ws/2/`
const limit = 100

// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey = "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";
const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
const searchURL = "https://www.googleapis.com/youtube/v3/search";
// const artistMBID = `b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d`

const STORE = {
  artistQuery: ``,
  artistQueryResponse: "",
  releaseGroupsQueryResponse: "",
  releasesQueryResponse: ``,
  tracksQueryResponse: "",

  albumQueryResultsPerPage: 5,


  artistMBID: '',

  releaseGroupResponse: [],
  releaseGroupResponseReleaseGroup: [],
  releaseDate: [],
  sortedReleaseGroupDates: null,
  releaseGroupResponseReleaseGroupFiltered: null,
  releaseGroupCount: null,

  // releaseID: null,


  artistResultsPerPage: 5,
  artistCurrentPageNumber: 1,
  artistNextPageNumber: null,
  artistPrevPageNumber: null,

  albumQueryResultsPerPage: 5,
  albumQueryCurrentPageNumber: 1,
  albumQueryNextPageNumber: null,
  albumQueryPrevPageNumber: null,


  albumsResultsPerPage: 5,
  albumsCurrentPageNumber: 1,
  albumsNextPageNumber: null,
  albumsPrevPageNumber: null,

  tracksResultsPerPage: 5,
  tracksCurrentPageNumber: 1,
  tracksNextPageNumber: null,
  tracksPrevPageNumber: null,

  videosResultsPerPage: 5,
  videosCurrentPageNumber: 1,
  videosNextPageNumber: null,
  videosPrevPageNumber: null,
};

function incrementHistory() {
  $('body').on('click', '.item', function (event) {
    current++;
    console.log(`current`, current)
    history.push($(this).closest('section').attr('id'));
    console.log(`history`, history)
  })
}

function backButton() {
  $('.back-button').on('click', function (event) {
    const prev = current - 1
    console.log('backButton() clicked')
    console.log(`current`, current)
    const prevPage = history[prev]
    console.log('prevPage ', prevPage)
    // hide current page
    $('body').find($('.results-page').not('hidden').addClass('hidden'))
    $('body').find($('#' + prevPage)).removeClass('hidden')
    history.pop()
    // current--
    current == 0 ? 0 : current -= 1
  })
}

function resetAll() {
  // clears lists in case user decides 
  // to search after lists have been generated


  $('.search-entity-page').addClass('hidden')
  $('.albums-page').addClass('hidden')
  $('.tracks-page').addClass('hidden')
  $('.videos-page').addClass('hidden')
  current = 0
  history = []

  $('.list').addClass('hidden')



  STORE.artistQuery = ``
  STORE.artistQueryResponse = ""
  STORE.releaseGroupsQueryResponse = ""
  STORE.releasesQueryResponse = ``
  STORE.tracksQueryResponse = ""

  STORE.artistMBID = ''

  STORE.releaseGroupResponse = []
  STORE.releaseGroupResponseReleaseGroup = []
  STORE.releaseDate = []
  STORE.sortedReleaseGroupDates = null
  STORE.releaseGroupResponseReleaseGroupFiltered = null
  // STORE.releaseID= null


  STORE.artistResultsPerPage = 5
  STORE.artistCurrentPageNumber = 1
  STORE.artistNextPageNumber = null
  STORE.artistPrevPageNumber = null

  STORE.albumQueryResultsPerPage = 5
  STORE.albumQueryCurrentPageNumber = 1
  STORE.albumQueryNextPageNumber = null
  STORE.albumQueryPrevPageNumber = null

  STORE.albumsResultsPerPage = 5
  STORE.albumsCurrentPageNumber = 1
  STORE.albumsNextPageNumber = null
  STORE.albumsPrevPageNumber = null

  STORE.tracksResultsPerPage = 5
  STORE.tracksCurrentPageNumber = 1
  STORE.tracksNextPageNumber = null
  STORE.tracksPrevPageNumber = null

  STORE.videosResultsPerPage = 5
  STORE.videosCurrentPageNumber = 1
  STORE.videosNextPageNumber = null
  STORE.videosPrevPageNumber = null


}

function resetReleaseGroupsData() {
  STORE.releaseGroupResponse = []
  STORE.releaseGroupResponseReleaseGroup = []
  STORE.releaseDate = []
  STORE.sortedReleaseGroupDates = null
  STORE.releaseGroupResponseReleaseGroupFiltered = null

  STORE.albumsResultsPerPage = 5
  STORE.albumsCurrentPageNumber = 1
  STORE.albumsNextPageNumber = null
  STORE.albumsPrevPageNumber = null

  // reset nav buttons too

}

function makeOffsetArtists(pageNum) {
  return (pageNum - 1) * STORE.artistResultsPerPage
}

function makeOffsetAlbums(pageNum) {
  return (pageNum - 1) * STORE.albumsResultsPerPage
}

function makeOffsetAlbumsQueryList(pageNum) {
  return (pageNum - 1) * STORE.albumQueryResultsPerPage

}

function getNextPageArtistsQuery() {
  console.log('STORE.artistQueryResponse(): ', STORE.artistQueryResponse)
  const itemCount = !STORE.artistQueryResponse ? 0 : STORE.artistQueryResponse.count
  const pageCount = Math.ceil(itemCount / STORE.artistResultsPerPage)
  console.log('pageCount ', pageCount)
  if (STORE.artistCurrentPageNumber < pageCount) {
    return STORE.artistCurrentPageNumber + 1
  }
  return null
}

function getNextPageAlbumsQuery() {
  console.log(`getNextPageAlbumsQuery() invoked`)
  console.log('STORE.albumListQueryResponse(): ', STORE.albumListQueryResponse)
  const itemCount = !STORE.albumListQueryResponse ? 0 : STORE.albumListQueryResponse.count
  const pageCount = Math.ceil(itemCount / STORE.albumQueryResultsPerPage)
  // console.log('pageCount ', pageCount)
  if (STORE.albumQueryCurrentPageNumber < pageCount) {
    return STORE.albumQueryCurrentPageNumber + 1
  }
  return null
}

function getNextPageAlbums() {
  console.log('getNextPageAlbums() triggered')
  const itemCount = STORE.releaseGroupResponseReleaseGroupFiltered.length
  console.log(`STORE.releaseGroupResponseReleaseGroupFiltered.length`, STORE.releaseGroupResponseReleaseGroupFiltered.length)
  const pageCount = Math.ceil(itemCount / STORE.albumsResultsPerPage)
  console.log('pageCount', pageCount)
  if (STORE.albumsCurrentPageNumber < pageCount) {
    return STORE.albumsCurrentPageNumber + 1
  }
  return null
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  console.log("queryItems ", queryItems);
  return queryItems.join("&");
}


///     DISPLAYERS      //////////////


function displayArtistList() {
  $(".search-entity-page").empty();
  $('.search-entity-page').removeClass('hidden')
    $('.search-entity-page').append(`
  <section class="artists-heading-container">
  <h4 class="artist-results-title">Artists:</h4>
  </section>`
  )
  // console.log(STORE.artistQueryResponse.artists.length);
  const artists = STORE.artistQueryResponse.artists;
  console.log('displayArtistList() artists.length', artists.length)
  $('.search-entity-page').append(`
                <div class="artists">
                    <ul class="artists-list list"></ul>
                    <nav class="artists-list-nav" role="navigation"></nav>
                </div>`)
  for (let i = 0; i < artists.length; i++) {
    // console.log(artists[i].name);
    $(".artists-list").append(
      `<li class="artist-item">
      <p><span class="artist-name item" id=${artists[i].id}>${artists[i].name}</span></p>
      </li>`
    );
  }
  $(".artists-list-nav").empty()
  if (STORE.artistPrevPageNumber) {
    const btn = `
        <button class="artist-button">artist page ${STORE.artistPrevPageNumber}</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.artistCurrentPageNumber = STORE.artistPrevPageNumber
      // console.log('PREV PAGE',STORE.artistCurrentPageNumber)
      getArtistListFromQuery()
    })
    $(".artists-list-nav").append($btn)
  }
  
  if (STORE.artistNextPageNumber) {
    const nextBtn = `
        
        <button class="artist-button">artist page ${STORE.artistNextPageNumber}</button>
        
        `
    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()
      STORE.artistCurrentPageNumber = STORE.artistNextPageNumber
      console.log('NEXT PAGE')
      getArtistListFromQuery()
    })
    $(".artists-list-nav").append($next)
  }
  $("#results").removeClass("hidden");
}

function displayAlbumListFromQuery() {

  console.log('displayAlbumListFromQuery() triggered')
  $(".search-entity-page").empty();
  $('.search-entity-page').removeClass('hidden')

    $('.search-entity-page').append(`
  <section class="album-matches-heading-container">
  <h4 class="album-matches-results-title">Albums:</h4>
  </section>`
  )
  console.log('displayAlbumListFromQuery() triggered2')

  const albums = STORE.albumListQueryResponse[`release-groups`];
  $('.search-entity-page').append(`
                <div class="albums-search-list-container">
                    <ul class="albums-search-list list"></ul>
                    <nav class="albums-search-list-nav" role="navigation"></nav>
                </div>`)
  for (let i = 0; i < albums.length; i++) {
    $(".albums-search-list").append(
      `<li class="albums-search-item">
      <p><span class="albums-search-name item" id=${albums[i].id}>${albums[i].title}</span></p>
      </li>`
    );
  }

  $(".albums-search-list-nav").empty()
  console.log(`STORE.albumQueryPrevPageNumber`,STORE.albumQueryPrevPageNumber)
  console.log(`STORE.albumQueryNextPageNumber`,STORE.albumQueryNextPageNumber)

  if (STORE.albumQueryPrevPageNumber) {
    const btn = `
        <button class="albums-search-button">albums page ${STORE.albumQueryPrevPageNumber}</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.albumQueryCurrentPageNumber = STORE.albumQueryPrevPageNumber
      // console.log('PREV PAGE',STORE.artistCurrentPageNumber)
      getAlbumListFromQuery()
    })
    $(".albums-search-list-nav").append($btn)
  }

  if (STORE.albumQueryNextPageNumber) {
    const nextBtn = `
        
        <button class="albums-search-button">albums page ${STORE.albumQueryNextPageNumber}</button>
        
        `
        console.log(`STORE.albumQueryNextPageNumber exists`)

    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()
      STORE.albumQueryCurrentPageNumber = STORE.albumQueryNextPageNumber
      console.log('NEXT PAGE')
      getAlbumListFromQuery()
    })
    $(".albums-search-list-nav").append($next)
  }
  

  console.log(`STORE.albumListQueryResponse.release-groups`,STORE.albumListQueryResponse[`release-groups`]);

  $("#results").removeClass("hidden");

}

function displayReleaseGroupsList() {
  console.log(`displayReleaseGroupsList() triggered`)
  // displayResultsHeading('Albums:', 'album')
  $(".albums-page").empty();
  $(".albums-page").removeClass('hidden');

  $('.albums-page').append(`
  <section class="albums-heading-container">
  <h4 class="albums-results-title">${STORE.selectedArtist}</h4>
  </section>`
  )
  const artistMBID = STORE.artistMBID
  // const albums = STORE.releaseGroupsQueryResponse["release-groups"];
  const albums = STORE.releaseGroupResponseReleaseGroupFiltered;
  console.log(`albums`, albums)
  // populate list of albums to choose from
  const offset = makeOffsetAlbums(STORE.albumsCurrentPageNumber)
  console.log(`offset`, offset)
  $('.albums-page').append(`
  <div class="albums">
  <ul class="albums-list list"></ul>
  <nav class="albums-list-nav" role="navigation"></nav>
</div>`)

  let offsetPlus = Math.min(offset + STORE.albumsResultsPerPage, albums.length)
  // ** adjust size based on screensize? or flex enlarge small image?
  const thumbnailSize = 250;
  // console.log(`albums.length`,albums.length)
  let thumbnail;
  for (let i = offset; i < offsetPlus; i++) {
    // thumbnail = albums[i][`thumbnails-small`]
    offsetPlus = Math.min(offset + STORE.albumsResultsPerPage, albums.length)
    console.log('offset + STORE.albumsResultsPerPage', offset + STORE.albumsResultsPerPage)
    console.log('albums.length-1', albums.length)
    console.log('offsetPlus', offsetPlus)
    console.log('i', i)
    $(".albums-list").append(
      `<li class="albums-item">
      <div class="album-info-wrapper">
      <p class="album-title-name"><span class="album-name album-name-span item"
      id=${albums[i].id}>${albums[i].title}</span></p>
      <p class="album-date"><span class="album-name item"
      id=${albums[i].id}>${albums[i][`first-release-date`].slice(0, 4)}</span></p>
              <div class="thumbnail-container">
                  <img class="album-name item album-image" id=${albums[i].id}
                      src="http://coverartarchive.org/release-group/${albums[i].id}/front-${thumbnailSize}"></img>
              </div>
      </div>
  </li>`
    );
  }

  $(".albums-list-nav").empty()

  const nextPage = getNextPageAlbums()
  console.log('next page', nextPage)
  STORE.albumsNextPageNumber = null
  if (nextPage) {
    STORE.albumsNextPageNumber = nextPage
  }
  console.log('STORE.albumsPrevPageNumber', STORE.albumsPrevPageNumber)

  STORE.albumsPrevPageNumber = null
  if (STORE.albumsCurrentPageNumber > 1) {
    STORE.albumsPrevPageNumber = STORE.albumsCurrentPageNumber - 1
    console.log('STORE.albumsPrevPageNumber', STORE.albumsPrevPageNumber)

  }
  console.log('STORE.albumsPrevPageNumber', STORE.albumsPrevPageNumber)
  if (STORE.albumsPrevPageNumber) {
    const btn = `
        <button class="albums-button">albums page ${STORE.albumsPrevPageNumber}</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.albumsCurrentPageNumber = STORE.albumsPrevPageNumber
      console.log('PREV PAGE', STORE.albumsCurrentPageNumber)
      displayReleaseGroupsList();
    })
    $(".albums-list-nav").append($btn)
  }
  if (STORE.albumsNextPageNumber) {
    const nextBtn = `
        <button class="albums-button">albums page ${STORE.albumsNextPageNumber}</button>
        
        `
    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()
      STORE.albumsCurrentPageNumber = STORE.albumsNextPageNumber
      console.log('STORE.albumsCurrentPageNumber', STORE.albumsCurrentPageNumber)
      console.log('albums NEXT PAGE')
      // getArtistListFromQuery()
      // getReleaseGroupsFromartistMBID(artistMBID)
      displayReleaseGroupsList()
      //refetch
    })
    $(".albums-list-nav").append($next)
  }
  $("#results").removeClass("hidden");
}

function displayTracksList() {
  $(".tracks-page").empty();
  $('.tracks-page').removeClass('hidden')
  // ** if thumbnail size doesnt work try a smaller one
  const thumbnailSize = 500;
  $('.tracks-page').append(`
  <section class="tracks-heading-container">
  <h4 class="tracks-results-title">${STORE.selectedAlbumTitle}</h4>
  <img  src="http://coverartarchive.org/release-group/${STORE.selectedAlbumID}/front-${thumbnailSize}">
  </section>`
  )
  const tracks = STORE.tracksQueryResponse["media"];
  console.log(tracks)
  // populate list of tracks to choose from 
  $('.tracks-page').append(
    `<div class="tracks">
    <ul class="tracks-list list"></ul>
    <nav class="tracks-list-nav" role="navigation"></nav>
</div>`
  )
  for (let i = 0; i < tracks[0].tracks.length; i++) {
    console.log(i + ' ' + tracks[0].tracks[i].title);
    $(".tracks-list").append(
      `<li class="tracks-item">
        <p><span class="track-name item">${tracks[0].tracks[i].title}</span></p>
        </li>`
    );
  }
}

function displayVideoResults(responseJson) {
  $(".videos-page").empty();
  $('.videos-page').removeClass('hidden')
  // if there are previous results, remove them
  console.log('from displayVideoResults() ', responseJson);
  // iterate through the items array
  console.log('from displayVideoResults() ', responseJson.items.length);
  $('.videos-page').append(`
  <div class="videos">
  <ul class="videos-list list"></ul>
  <nav class="videos-list-nav" role="navigation"></nav>
</div>`)
  for (let i = 0; i < responseJson.items.length; i++) {
    $(".videos-list").append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"  target="_blank">
      <img src='${responseJson.items[i].snippet.thumbnails.medium.url}' >
      </a>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

///     GETTERS      //////////////


function getArtistListFromQuery() {
  const artist = STORE.artistQuery
  let offset = makeOffsetArtists(STORE.artistCurrentPageNumber)
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
      const nextPage = getNextPageArtistsQuery()
      console.log('next page:', nextPage)
      STORE.artistNextPageNumber = null
      if (nextPage) {
        STORE.artistNextPageNumber = nextPage
      }
      STORE.artistPrevPageNumber = null
      if (STORE.artistCurrentPageNumber > 1) {
        STORE.artistPrevPageNumber = STORE.artistCurrentPageNumber - 1
      }
      displayArtistList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getAlbumListFromQuery() {
  const album = STORE.albumQuery
  let offset = makeOffsetAlbumsQueryList(STORE.albumQueryCurrentPageNumber)
  console.log(`offset`,offset)
  let url = `https://musicbrainz.org/ws/2/release-group/?query=release-group:${album}&fmt=json&offset=${offset}&limit=${STORE.albumQueryResultsPerPage}`;
  console.log("query Album url ", url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      console.log('getAlbumListFromQuery() response:', responseJson);
      STORE.albumListQueryResponse = responseJson;
      const nextPage = getNextPageAlbumsQuery()
      console.log('next page:', nextPage)
      STORE.albumQueryNextPageNumber = null
      if (nextPage) {
        STORE.albumQueryNextPageNumber = nextPage
      }
      STORE.albumQueryPrevPageNumber = null
      if (STORE.albumQueryCurrentPageNumber > 1) {
        STORE.albumQueryPrevPageNumber = STORE.albumQueryCurrentPageNumber - 1
      }
      displayAlbumListFromQuery();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}


function getReleaseGroupsFromArtistID(artistMBID) {
  let pagesCount = 1; // just a placeholder value
  const fetches = []
  for (let i = 0; i < pagesCount; i++) {
    const offset = limit * i;
    const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`
    console.log(`getReleaseGroupsFromArtistID() url`, url)
    fetches.push(
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => {
          console.log('responseJson', responseJson);
          STORE.releaseGroupResponse.push(responseJson)
          STORE.releaseGroupResponseReleaseGroup.push(responseJson[`release-groups`])
        })
        .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        })
    )
    STORE.releaseGroupCount = STORE.releaseGroupResponse[`release-group-count`]
    pagesCount = STORE.releaseGroupCount
  }
  Promise.all(fetches).then(() => {
    STORE.releaseGroupResponseReleaseGroup = STORE.releaseGroupResponseReleaseGroup.flat()
    filteredReleaseGroupResponse(STORE.releaseGroupResponseReleaseGroup)
    sortReleaseGroupsByDate(STORE.releaseGroupResponseReleaseGroupFiltered)
    // ** getAlbumArt() needs to finish before can display
    getAlbumArt(STORE.releaseGroupResponseReleaseGroupFiltered)
    displayReleaseGroupsList()
  })

  // ** include Live in secondary types and maybe soundtracks and 
  // other things. 

  function filteredReleaseGroupResponse(array) {
    const filteredArr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i][`first-release-date`].length > 0
        && array[i][`secondary-types`].length == 0
        && array[i][`primary-type`] != `Single`
        && array[i][`primary-type`] != `EP`
        && array[i][`primary-type`] != `Compilation`
        && array[i][`primary-type`] != `Remix`
        && array[i][`primary-type`] != `Interview`
        && array[i][`primary-type`] != `Audiobook`
        && array[i][`primary-type`] != `Other`
        // || array[i][`primary-type`] == `Soundtrack`
      ) {
        filteredArr.push(array[i])
      }
    }
    // console.log(filteredArr)
    STORE.releaseGroupResponseReleaseGroupFiltered = filteredArr
  }


  function getAlbumArt(albums) {
    console.log(`getAlbumArt(releasegroupID) invoked`)
    let url = ``;
    for (let i = 0; i < albums.length; i++) {
      url = `http://coverartarchive.org/release-group/${albums[i].id}/front-250`
      console.log('albums[i]', albums[i].title, albums[i].id)
      fetch(url).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
        .then(responseJson => {
          console.log('responseJson', responseJson);
          // ** remember to request front image 
        })
        .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        })
    }
  }

  function sortReleaseGroupsByDate(toBeSorted) {
    toBeSorted.sort(function (a, b) {
      a = new Date(a[`first-release-date`])
      b = new Date(b[`first-release-date`])
      return a - b
    })
  }
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
      console.log('should be releaseID ', STORE.releasesQueryResponse.releases[0].id)
      getTracksFromReleaseID(STORE.releasesQueryResponse.releases[0].id);
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getYouTubeVideos(trackTitle) {
  const params = {
    key: apiKey,
    q: `"${STORE.selectedArtist}" "${trackTitle}" guitar lesson`,
    part: "snippet",
    maxResults: '10',
    type: "video",
    order: 'relevance',
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVideoResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

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
}

///     HANDLERS      //////////////

function handleSearchForm() {
  $("form").submit(event => {
    event.preventDefault();
    resetAll()

    const searchByEntity = $('input:checked').val()
    STORE.searchByEntity = searchByEntity;
    console.log('entity checked:',$('input:checked').val())

    if (searchByEntity === 'album') {
      const album = $('#js-search-term').val();
      console.log('album query:', album)
      STORE.albumQuery = encodeURIComponent(album)
      getAlbumListFromQuery()
    } else if (searchByEntity === 'track') {
      const track = $('#js-search-term').val();
      console.log('track query:', track)
      STORE.trackQuery = encodeURIComponent(track)
    } else {
      const artist = $('#js-search-term').val();
      console.log('artist query:', artist)
      STORE.artistQuery = encodeURIComponent(artist)
      getArtistListFromQuery();
    }


    // console.log(encodeURIComponent(artist))
  });
}

function handleSelectEntity() {
  $('.search-entity-page').on('click', '.artist-name', function (event) {
    event.preventDefault();
    $('.search-entity-page').addClass('hidden')
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    // console.log('event target: clicked', $(event.target).attr('id'))

    console.log($(event.target).text())

    STORE.artistID = $(event.target).attr('id');
    getReleaseGroupsFromArtistID($(event.target).attr('id'));
    console.log('selected Artist ', $(event.target).text())
    STORE.selectedArtist = $(event.target).text();
    resetReleaseGroupsData()
  })
  $('.search-entity-page').on('click', '.albums-search-name', function (event) {
    event.preventDefault();
    $('.search-entity-page').addClass('hidden')
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    // console.log('event target: clicked', $(event.target).attr('id'))

    console.log($(event.target).text())

    STORE.albumID = $(event.target).attr('id');
    console.log('selected Artist ', $(event.target).text())
    STORE.selectedAlbumID =$(event.target).attr('id')
    getReleasesFromReleaseGroupID($(event.target).attr('id'));

    // resetReleaseGroupsData()
  })
  
  // gets release groups (basically release group is an album)
}



function handleSelectReleaseGroup() {
  $('.albums-page').on('click', '.album-name', function (event) {
    event.preventDefault();
    $('.albums-page').addClass('hidden')
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    console.log('album name',
      $(event.target).closest($('.album-info-wrapper')).find($('.album-name-span')).text()
    )
    STORE.selectedAlbumTitle =  $(event.target).closest($('.album-info-wrapper')).find($('.album-name-span')).text()
    STORE.selectedAlbumID = $(event.target).attr('id')
    getReleasesFromReleaseGroupID($(event.target).attr('id'));
  })
}

function handleSelectTrack() {
  $('.tracks-page').on('click', '.track-name', function (event) {
    event.preventDefault();
    $('.tracks-page').addClass('hidden')
    console.log('event target track: clicked', $(event.target).text())
    getYouTubeVideos($(event.target).text());
    console.log('handleSelectTrack() done')
  })
}

function watchForm() {
  backButton()
  incrementHistory()
  handleSearchForm();
  handleSelectEntity();
  handleSelectReleaseGroup();
  handleSelectTrack();
}

$(watchForm);


// const delay = function (millis) {
//   return new Promise((resolve, reject) => {
//     window.setTimeout(() => {
//       resolve(true);
//     }, millis);
//   });
// };