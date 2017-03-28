var title = document.querySelector('#title');
var artist = document.querySelector('#artist');
var cover = document.querySelector('#cover');
var searchResults = document.querySelector('#searchResults');
var searchSubmit = document.querySelector('#searchSubmit');
var searchForm = document.querySelector('#search');
var jukebox = document.querySelector('#jukebox');
var play = document.getElementById('play');
var pause = document.getElementById('pause');
var next = document.getElementById('next');
var previous = document.getElementById('previous');
var shuffle = document.getElementById('shuffle');




SC.initialize({client_id: 'fd4e76fc67798bfa742089ed619084a6'});

// var scSong1 = new Song('/tracks/269161148');
// theJukebox.addSong(scSong1);

function SoundCloud() {
  this.song = SC.stream('/tracks/269161148')
}

SoundCloud.prototype.play = function() {
  this.song.then(function(player){
    player.play();
  });
}

SoundCloud.prototype.pause = function() {
  this.song.then(function(player){
    player.pause();
  })
}

var scSong1 = new SoundCloud();

play.addEventListener('click', function() {
  scSong1.play();
})

pause.addEventListener('click', function() {
  scSong1.pause();
})

SC.get(scSong1.source).then(function(response) {
  console.log(response);
  title.innerHTML = response.title.split("-")[1];
  artist.innerHTML = response.title.split("-")[0];
  cover.setAttribute('src', response.artwork_url);
})

function formReset() {
  searchForm.reset();
}

function search(searchValue){
  SC.get("/tracks", {   q: searchValue }).then(function(response) {
    // things to do after the tracks load...
    console.log(response);
    // clears search if current search exist
    while(searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
    }
    for(x=0; x<response.length; x++) {
      var result = document.createElement('img');
      result.setAttribute('src', response[x].artwork_url);
      searchResults.appendChild(result);
    }
  })
}

searchSubmit.addEventListener('click', function() {
  var searchValue = document.querySelector('#searchInput').value;
  search(searchValue);
})
