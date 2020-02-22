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

// ** fix: if you play embedded youtube video
// and then go back, the video will still be 
// playing until you go back to videos page
// 




let history = [];

let current = 0;

// base url
const baseURL = `https://musicbrainz.org/ws/2/`
const limit = 100

// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey = "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";
const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
// const apiKey = "AIzaSyBkK8PEuhSfyz05gnUWhwOuE5cqWV5Oa3A";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

// const artistMBID = `b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d`

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


  artistResultsPerPage: 5,
  artistCurrentPageNumber: 1,
  artistNextPageNumber: null,
  artistPrevPageNumber: null,

  albumsResultsPerPage: 5,
  albumsCurrentPageNumber: 1,
  albumsNextPageNumber: null,
  albumsPrevPageNumber: null,

  tracksResultsPerPage: 5,
  tracksCurrentPageNumber: 1,
  tracksNextPageNumber: null,
  tracksPrevPageNumber: null,

  trackTitle: null,

  videosResultsPerPage: 5,
  videosCurrentPageNumber: 1,
  videosNextPageNumber: null,
  videosPrevPageNumber: null,
};
function incrementHistory() {
  $('body').on('click', '.item', function (event) {
    // if (history[history.length-1] !== 'videos-page') {
    current++;
    console.log(`current`, current)

    history.push($(this).closest('section').attr('id'));
    // }
    console.log(`history`, history)

    if (history.length == 0) {
      $('.js-back-button-container').hide()
    } else {
      $('.js-back-button-container').show()
    }
  })
}

function backButton() {
  $('.js-back-button-container').on('click', function (event) {
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

    if (history.length == 0) {
      $('.js-back-button-container').hide()
    } else {
      $('.js-back-button-container').show()
    }
  })
}

function resetAll() {
  // clears lists in case user decides 
  // to search after lists have been generated


  $('.artists-page').addClass('hidden')
  $('.albums-page').addClass('hidden')
  $('.tracks-page').addClass('hidden')
  $('.videos-page').addClass('hidden')
  current = 0
  history = []

  // $('.tracks-list').empty();
  // $('.videos-list').empty();
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

  STORE.albumsResultsPerPage = 5
  STORE.albumsCurrentPageNumber = 1
  STORE.albumsNextPageNumber = null
  STORE.albumsPrevPageNumber = null

  STORE.tracksResultsPerPage = 5
  STORE.tracksCurrentPageNumber = 1
  STORE.tracksNextPageNumber = null
  STORE.tracksPrevPageNumber = null

  STORE.videosResultsPerPage = 10
  STORE.videosCurrentPageNumber = 1
  STORE.videosNextPageNumber = null
  STORE.videosPrevPageNumber = null

  STORE.videosCount = null

  STORE.nextPageToken = [null];


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

function resetVideoResultsData() {
  STORE.nextPageToken= [null];
  STORE.videosCurrentPageNumber = 1
  STORE.videosNextPageNumber = null
  STORE.videosPrevPageNumber = null

  STORE.videosCount = null

}

function makeOffsetArtists(pageNum) {
  return (pageNum - 1) * STORE.artistResultsPerPage
}

function makeOffsetAlbums(pageNum) {
  return (pageNum - 1) * STORE.albumsResultsPerPage
}

// function makeOffsetVideos(pageNum) {
//   return (pageNum - 1) * STORE.videosResultsPerPage
// }

function getNextPageArtists() {
  console.log('STORE.artistQueryResponse(): ', STORE.artistQueryResponse)
  const itemCount = !STORE.artistQueryResponse ? 0 : STORE.artistQueryResponse.count
  const pageCount = Math.ceil(itemCount / STORE.artistResultsPerPage)
  console.log('pageCount ', pageCount)
  if (STORE.artistCurrentPageNumber < pageCount) {
    return STORE.artistCurrentPageNumber + 1
  }
  return null
}

function getNextPageAlbums() {
  console.log('getNextPageAlbums() triggered')
  const itemCount = STORE.releaseGroupResponseReleaseGroupFiltered.length
  console.log(`STORE.releaseGroupResponseReleaseGroupFiltered.length`, STORE.releaseGroupResponseReleaseGroupFiltered.length)
  // console.log(`STORE.releaseGroupsResultsPerPage`, STORE.releaseGroupsResultsPerPage)
  const pageCount = Math.ceil(itemCount / STORE.albumsResultsPerPage)
  console.log('pageCount', pageCount)
  if (STORE.albumsCurrentPageNumber < pageCount) {
    return STORE.albumsCurrentPageNumber + 1
  }
  return null
}

function getNextPageVideos() {
  console.log('getNextPageVideos() triggered')
  const itemCount = STORE.videosCount;
  console.log(' getNextPageVideos() itemCount',itemCount,STORE.videosCount)
  console.log(' videosCurrentPageNumber()',STORE.videosCurrentPageNumber)

  const pageCount = Math.ceil(itemCount / STORE.videosResultsPerPage)
    console.log('pageCount', pageCount)

  if (STORE.videosCurrentPageNumber < pageCount) {
    return STORE.videosCurrentPageNumber + 1
  }
  return null 
}

// put this in get next page stuff item count above
// pageInfo.totalResults

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  console.log("queryItems ", queryItems);
  return queryItems.join("&");
}


///     DISPLAYERS      //////////////



function displayArtistList() {


  $(".artists-page").empty();
  $('.artists-page').removeClass('hidden')


  $('.artists-page').append(`
  <section class="artists-heading-container">
  <h2 class="artist-results-title">Artist</h2>
  </section>`
  )

  // console.log(STORE.artistQueryResponse.artists.length);
  const artists = STORE.artistQueryResponse.artists;
  console.log('displayArtistList() artists.length', artists.length)
  $('.artists-page').append(`
                <div class="artists">
                    <ul class="artists-list list"></ul>
                    <div class="artists-list-nav-wrapper">
                       <nav class="artists-list-nav" role="navigation"></nav>
                    </div>
                </div>`)
  for (let i = 0; i < artists.length; i++) {
    // console.log(artists[i].name);
    $(".artists-list").append(
      `<li class="artist-item">
      <p class="artist-name hover-link pointer item"
      data-id=${artists[i].id}>${artists[i].name} </p>
      </li>`
    );
  }
  $(".artists-list-nav").empty()

  if (STORE.artistCurrentPageNumber ==1) {

    const btn = `
        <button class="prev-artist-button hover-link">< prev</button>
        
        `
    const $btn = $(btn)

    $(".artists-list-nav").append($btn)

  }

  if (STORE.artistPrevPageNumber) {
    const btn = `
        <button class="prev-artist-button hover-link">< prev</button>
        
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

  if (STORE.artistNextPageNumber == null) {
    const nextBtn = `
        <span class="artist-page-number">${STORE.artistCurrentPageNumber}</span>
        <button class="next-artist-button hover-link">next ></button>
        
        `
    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()

    })
    $(".artists-list-nav").append($next)

  }


  if (STORE.artistNextPageNumber) {
    
    const nextBtn = `
        <span class="artist-page-number">${STORE.artistCurrentPageNumber}</span>
        <button class="next-artist-button hover-link">next ></button>
        
        `
    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()
      STORE.artistCurrentPageNumber = STORE.artistNextPageNumber
      console.log('NEXT PAGE')
      getArtistListFromQuery()
      //refetch
    })
    $(".artists-list-nav").append($next)
  }
  $("#results").removeClass("hidden");



}

function displayReleaseGroupsList() {
  console.log(`displayReleaseGroupsList() triggered`)
  // displayResultsHeading('Albums:', 'album')

  // $(".albums-list").empty();
  // $('.albums-list').removeClass('hidden')
  $(".albums-page").empty();
  $(".albums-page").removeClass('hidden');

  $('.albums-page').append(`
  <section class="albums-heading-container">
  <h2 class="albums-results-title">${STORE.selectedArtist}</h2>
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
      <div class="albums-list-nav-wrapper">
        <nav class="albums-list-nav" role="navigation"></nav>
      </div>
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
    // console.log(i + ' ' + albums[i].title);
    console.log('i', i)
    $(".albums-list").append(

      `<li class="albums-item">
      <div class="album-info-wrapper">
        <p class="album-title-name pointer"><span class="album-name album-name-span pointer item"
          data-id=${albums[i].id}>${albums[i].title}</span></p>
        <p class="album-date pointer"><span class="album-name item"
          data-id=${albums[i].id}>${albums[i][`first-release-date`].slice(0, 4)}</span></p>
              <div class="thumbnail-container">
                  <img 
                  aria-label="${albums[i].title} cover art"
                  class="album-name pointer item album-image" data-id=${albums[i].id}
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


  if (STORE.albumsCurrentPageNumber == 1) {
    const btn = `
        <button class="prev-albums-button hover-link">< prev</button>
        
        `
    const $btn = $(btn)
  
    $(".albums-list-nav").append($btn)
  }

  if (STORE.albumsPrevPageNumber) {
    const btn = `
        <button class="prev-albums-button hover-link">< prev</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.albumsCurrentPageNumber = STORE.albumsPrevPageNumber

      console.log('PREV PAGE', STORE.albumsCurrentPageNumber)
      // getArtistListFromQuery()
      // getReleaseGroupsFromartistMBID(artistMBID);
      displayReleaseGroupsList();
      //refetch
    })
    $(".albums-list-nav").append($btn)
  }

  // prev-artist-button hover-link

  if (STORE.albumsNextPageNumber == null) {
    const nextBtn = `
        <span class="albums-page-number">${STORE.albumsCurrentPageNumber}</span>
        <button class="next-albums-button hover-link">next ></button>
        
        `
    const $next = $(nextBtn)
    
    $(".albums-list-nav").append($next)
  }


  if (STORE.albumsNextPageNumber) {
    const nextBtn = `
        <span class="albums-page-number">${STORE.albumsCurrentPageNumber}</span>
        <button class="next-albums-button hover-link">next ></button>
        
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


  // if thumbnail size doesnt work try a smaller one
  const thumbnailSize = 500;

  $('.tracks-page').append(`
  <section class="tracks-heading-container">
  <h4 class="tracks-results-title">${STORE.selectedAlbumTitle}</h4>
  <div class="album-cover-container"> 
  <img data-id="album-cover-tracks-page" src="http://coverartarchive.org/release-group/${STORE.selectedAlbumID}/front-${thumbnailSize}">
  </div>
  </section>`
  )

  const tracks = STORE.tracksQueryResponse["media"];
  // displayResultsHeading(STORE.al,'tracks',)

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
      <p><span class="track-name pointer item">${tracks[0].tracks[i].title}</span></p>
        </li>`
    );
  }
}

function displayVideoResults(responseJson) {
  // $('.videos-list').removeClass('hidden')
  // $(".videos-list").empty();
  $(".videos-page").empty();
  $('.videos-page').removeClass('hidden')

  // if there are previous results, remove them
  console.log('from displayVideoResults() ', responseJson);
  // iterate through the items array
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
    // console.log('responseJson.items[i].id.videoId', responseJson.items[i].id.videoId)

    $(".videos-list").append(
      `<li class="grid-item">
      <div class="video-title-summary-box">
          <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank">
              <h3 class="clampedText clampedLines2">${responseJson.items[i].snippet.title}</h3>
          </a>
      </div>
      <div class="embedded-video-container">
          <iframe class="embedded-video" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}"
              allowfullscreen></iframe>
      </div>
  </li>`
    );
  }
  $(".videos-list-nav").empty()

  const nextPage = getNextPageVideos()
  console.log('next page displayVideoResults', nextPage)
  STORE.videosNextPageNumber = null
  if (nextPage) {
    STORE.videosNextPageNumber = nextPage
  }
  // console.log('STORE.videosPrevPageNumber', STORE.videosPrevPageNumber)

  STORE.videosPrevPageNumber = null
  if (STORE.videosCurrentPageNumber > 1) {
    STORE.videosPrevPageNumber = STORE.videosCurrentPageNumber - 1
    // console.log('STORE.videosPrevPageNumber', STORE.videosPrevPageNumber)

  }
  if (STORE.videosCurrentPageNumber == 1) {
    const btn = `
        <button class="prev-videos-button">< prev</button>
        
        `
    const $btn = $(btn)

    $(".videos-list-nav").append($btn)
  }

  if (STORE.videosPrevPageNumber) {
    const btn = `
        <button class="prev-videos-button">< prev</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.videosCurrentPageNumber = STORE.videosPrevPageNumber
      STORE.nextPageToken.pop()
      // console.log('PREV PAGE', STORE.albumsCurrentPageNumber)
      // getArtistListFromQuery()
      // getReleaseGroupsFromartistMBID(artistMBID);
      // displayVideoResults();
      getYouTubeVideos(STORE.trackTitle);
    })
    $(".videos-list-nav").append($btn)
  }

  if (STORE.videosNextPageNumber == null) {
    const nextBtn = `

        <button class="next-videos-button">next ></button>
        
        `
    const $next = $(nextBtn)
  
    $(".videos-list-nav").append($next)
  }

  if (STORE.videosNextPageNumber) {
    const nextBtn = `
        <span class="videos-page-number">${STORE.videosCurrentPageNumber}</span>
        <a href="#top"> 
            <button class="next-videos-button">next ></button>
        </a>
        `
    const $next = $(nextBtn)
    $next.click(ev => {
    //   ev.preventDefault()
      STORE.videosCurrentPageNumber = STORE.videosNextPageNumber

      getYouTubeVideos(STORE.trackTitle);
      // displayVideoResults()
    })
    $(".videos-list-nav").append($next)
  }


  // <p class="clampedText clampedLines2">${responseJson.items[i].snippet.description}</p>


  // <img src='${responseJson.items[i].snippet.thumbnails.medium.url}' >
  //display the results section
  $("#results").removeClass("hidden");
}



///     GETTERS      //////////////

// getAllReleaseGroups(artistMBID = `b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d`)

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
      const nextPage = getNextPageArtists()
      console.log('next page:', nextPage)
      STORE.artistNextPageNumber = null
      if (nextPage) {
        // offset = makeOffsetArtists(nextPage)
        // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
        STORE.artistNextPageNumber = nextPage
      }
      STORE.artistPrevPageNumber = null
      if (STORE.artistCurrentPageNumber > 1) {
        // offset = makeOffsetArtists(STORE.artistCurrentPageNumber-1)
        // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
        STORE.artistPrevPageNumber = STORE.artistCurrentPageNumber - 1
      }
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
  const fetches = []
  for (let i = 0; i < pagesCount; i++) {
    const offset = limit * i;
    const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`
    // const savedURL = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`
    console.log(`getReleaseGroupsFromArtistID() url`, url)
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
    // console.log(STORE.releaseGroupResponseReleaseGroup)
    filteredReleaseGroupResponse(STORE.releaseGroupResponseReleaseGroup)
    sortReleaseGroupsByDate(STORE.releaseGroupResponseReleaseGroupFiltered)
    // ** getAlbumArt() needs to finish before can display
    getAlbumArt(STORE.releaseGroupResponseReleaseGroupFiltered)
    displayReleaseGroupsList()
  })

  // include Live in secondary types and maybe soundtracks and 
  // other things. 
  let test = []
  let filterConditions = []
  function filteredReleaseGroupResponse(array) {
    const filteredArr = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === `8d5f4b07-7e2e-4ffa-ac90-e4772c4d8525`) {
        test.push(array[i])

        console.log('test', array[i])
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
      ]

      if (filterConditions.every(a => a === true)) {
        filteredArr.push(array[i])
      }
    }
    // console.log(filteredArr)
    STORE.releaseGroupResponseReleaseGroupFiltered = filteredArr
  }


  function getAlbumArt(albums) {
    console.log(`getAlbumArt(releasegroupID) invoked`)
    // let url = `http://coverartarchive.org/release/${albums[i].id}`
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
          // STORE.releaseGroupResponseReleaseGroupFiltered[i][`thumbnails-small`] = 
          // responseJson.
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

const cache = {}

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
  if (STORE.nextPageToken[STORE.videosCurrentPageNumber-1] !== null) {
    params.pageToken= STORE.nextPageToken[STORE.videosCurrentPageNumber-1]
  }
  console.log('videos current page number:',STORE.videosCurrentPageNumber)
  console.log('STORE.nextPageToken:',STORE.nextPageToken)
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  console.log('getYouTubeVideos()',url);
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
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      // cache[url]=responseJson  
      console.log('responseJson.nextPageToken',responseJson.nextPageToken)
      STORE.nextPageToken.push(responseJson.nextPageToken);
      STORE.videosCount = responseJson.pageInfo.totalResults;
      console.log('youtube videos response', responseJson)
      displayVideoResults(responseJson)
      //

      console.log('STORE.videosCount', STORE.videosCount)

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
    // $('.js-back-button-container').removeClass('hidden')
    $('.js-back-button-container').show()

    // $('.artists-page').removeClass('hidden')
    // $('.artists-list-nav').removeClass('hidden')
    const artist = $('#js-search-term').val();
    console.log('artist query:', artist)
    STORE.artistQuery = encodeURIComponent(artist)

    getArtistListFromQuery();
    // console.log(encodeURIComponent(artist))
  });
}


function handleSelectArtist() {
  $('.artists-page').on('click', '.artist-name', function (event) {
    event.preventDefault();
    $('.artists-page').addClass('hidden')

    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    // console.log('event target: clicked', $(event.target).attr('id'))
    STORE.artistID = $(event.target).attr('data-id');
    getReleaseGroupsFromArtistID($(event.target).attr('data-id'));
    console.log('selected Artist ', $(event.target).text())
    STORE.selectedArtist = $(event.target).text();

    resetReleaseGroupsData()


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
    STORE.selectedAlbumTitle = $(event.target).closest($('.album-info-wrapper')).find($('.album-name-span')).text()


    STORE.selectedAlbumID = $(event.target).attr('data-id')
    getReleasesFromReleaseGroupID($(event.target).attr('data-id'));
    // $('.albums-list').addClass('hidden')
    // $('.albums-list-nav').addClass('hidden')
  })
}

function handleSelectTrack() {
  $('.tracks-page').on('click', '.track-name', function (event) {
    event.preventDefault();
    resetVideoResultsData() 

    $('.tracks-page').addClass('hidden')
    STORE.trackTitle = $(event.target).text()
    // $('.tracks-list').addClass('hidden')
    // grab the element that was clicked
    console.log('event target track: clicked', $(event.target).text())
    // console.log(typeof $(event.target).text())
    getYouTubeVideos($(event.target).text());
    // just hide whole tracks-page below
    // $('.tracks-list').addClass('hidden')
    console.log('handleSelectTrack() done')
  })
}


function watchForm() {
  backButton()
  incrementHistory()
  handleSearchForm();
  handleSelectArtist();
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
































