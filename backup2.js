var object = document.querySelector('#object');
var title = document.querySelector('#title');
var titleLink = document.querySelector('#titleLink');
var artist = document.querySelector('#artist');
var artistLink = document.querySelector('#artistLink');
var description = document.querySelector('#description');
var genre = document.querySelector('#genre');
var year = document.querySelector('#year');
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
var playlistContainer = document.querySelector('#playlist-container');
var playlist = document.getElementById('playlist');
var addToPlaylist = document.querySelector('#addToPlaylist');



SC.initialize({client_id: 'fd4e76fc67798bfa742089ed619084a6'});

function SoundCloud() {
  this.source = '';
  this.song = SC.stream('/tracks/'+this.source);
}

var scSong1 = new SoundCloud();

// Play function
SoundCloud.prototype.play = function() {
  this.song.then(function(player) {
    player.play();
  })
}

play.addEventListener('click', function() {
  scSong1.play();
})

//Pause function
SoundCloud.prototype.pause = function() {
  this.song.then(function(player) {
    player.pause();
  })
}

pause.addEventListener('click', function() {
  scSong1.pause();
})

//Restart function
SoundCloud.prototype.restart = function() {
  this.song.then(function(player) {
    player.currentTime = 0
    scSong1.play();
  })
}

//Search function
function formReset() {
  searchForm.reset();
}

searchSubmit.addEventListener('click', function() {
  var searchValue = document.querySelector('#searchInput').value;
  search(searchValue);
})

function search(searchValue){
  SC.get("/tracks", {   q: searchValue }).then(function(response) {
    // clears search if current search exist
    while(searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
    }
    for(x=0; x<response.length; x++) {
      var li = document.createElement('li');
      var img = document.createElement('img');
      // console.log(response[x].artwork_url);
      // img.setAttribute('src', response[x].artwork_url);
      if(response[x].artwork_url) {
        img.setAttribute('src', response[x].artwork_url);
      } else {
        img.setAttribute('src','http://vignette2.wikia.nocookie.net/pandorahearts/images/a/ad/Not_available.jpg');
        img.style.height = '100px';
        img.style.width = '100px';
      }
      img.className = 'resultImgs';
      img.setAttribute('id', "index_"+(x));
      searchResults.appendChild(li);
      li.appendChild(img);
      li.appendChild(document.createElement('span')).innerHTML = '<br>Artist: '+response[x].title.split('-')[0]+"<br>Title: "+response[x].title.split('-')[1];
    }
    var trackList = document.getElementsByTagName('li');
    console.log(trackList.length);
    for(x=0; x<trackList.length; x++) {
      var index = x;
      trackList[x].addEventListener('click', function(e) {
        var target = e.target;
        var getId = target.id.split('_')[1];
        // var scSong1 = new SoundCloud(response[getId].id);
        // scSong1.source = response[getId].id;
        scSong1.song = SC.stream('/tracks/'+response[getId].id)
        // console.log(scSong1.song)
        scSong1.play();
        scSong1.restart();
      })
    }
  })
};
