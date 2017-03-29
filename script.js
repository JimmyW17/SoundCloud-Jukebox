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

function Playlist() {
  this.playlist = [];
  this.playlistIndex = 0;
}


var scPlaylist = new Playlist();

Playlist.prototype.add = function(song) {
  this.playlist.push(song);
};

Playlist.prototype.remove = function(e) {
  // NOT IMPLEMENTED
  var target = e.target;
};


function SoundCloud(source) {
  this.source = '/tracks/'+source;
  this.song = SC.stream('/tracks/'+source);
  this.currentTime = 0;
}

SoundCloud.prototype.play = function() {
  // checks if player has played a song before
  console.log(this.currentTime);
  if(this.currenTime === 0) {
    var scSong1 = new SoundCloud(scPlaylist.playlist[scPlaylist.playlistIndex]);
    scSong1.song.then(function(player) {
      player.play();
    });
  } else {
    this.song.then(function(player) {
      player.play();
    });
  }

  // this.song.then(function(player){
  //   player.play();
  //   console.log(player.currentTime());
  // });
  postTrackInfo(this);
};

SoundCloud.prototype.pause = function() {
  this.song.then(function(player){
    player.pause();
    console.log(this.song);
  });
};

SoundCloud.prototype.stop = function() {
  this.song.then(function(player) {
    player.seek(0);
  });
};

SoundCloud.prototype.next = function() {
  this.stop();
  if(scPlaylist.playlistIndex == scPlaylist.playlist.length-1) {
    scPlaylist.playlistIndex = 0;
  } else {
    scPlaylist.playlistIndex += 1;
  }
  // var scSong1 = new SoundCloud(scPlaylist.playlist[scPlaylist.playlistIndex]);
  this.currentTime = 0;
  console.log(this.currentTime);
  this.play();
};


addToPlaylist.addEventListener('click', function() {
  scPlaylist.add(object.innerHTML);
  // console.log(scPlaylist.playlist);
  var scSong1 = new SoundCloud(scPlaylist.playlist[scPlaylist.playlist.length-1]);
  SC.get(scSong1.source).then(function(response) {
    var li = document.createElement('li');
    li.innerHTML = response.title.split('-')[1];
    playlist.appendChild(li);
  });
});

function postTrackInfo(track) {
  SC.get(track.source).then(function(response) {
    console.log(response);
    object.innerHTML = response.id;
    title.innerHTML = response.title.split("-")[1];
    artist.innerHTML = response.title.split("-")[0];
    titleLink.setAttribute('href', response.permalink_url);
    artistLink.setAttribute('href', response.permalink_url.split('/').slice(0,-1).join('/'));
    if (response.description === null) {
      description.innerHTML = 'No description available';
    } else {
      description.innerHTML = response.description;
    }
    genre.innerHTML = response.genre.charAt(0).toUpperCase()+response.genre.slice(1);
    if (response.release_year === null) {
      year.innerHTML = 'Unknown';
    } else {
      year.innerHTML = response.release_year;
    }

    if(response.artwork_url) {
      cover.setAttribute('src', response.artwork_url);
    } else {
      cover.src = 'http://vignette2.wikia.nocookie.net/pandorahearts/images/a/ad/Not_available.jpg/revision/latest?cb=20141028171337';
      cover.style.height = '100px';
      cover.style.width = '100px';
    }
  });
}

function formReset() {
  searchForm.reset();
}

function search(searchValue){
  SC.get("/tracks", {   q: searchValue }).then(function(response) {
    // console.log(response);
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
    // console.log(trackList.length);
    for(x=0; x<trackList.length; x++) {
      var index = x;
      trackList[x].addEventListener('click', function(e) {
        var target = e.target;
        var getId = target.id.split('_')[1];
        console.log(response[getId].id);
        var scSong1 = new SoundCloud(response[getId].id);
        scSong1.play();
        // addPlaylist(response[getId])

        pause.addEventListener('click', function() {
          scSong1.pause();
        });

        play.addEventListener('click', function() {
          scSong1.play();
        });


        next.addEventListener('click', function() {
          // Next button onclick
          scSong1.next();
        });
      });

      // function addPlaylist(trackID) {addToPlaylist.addEventListener('click', function(trackID) {
      //   scPlaylist.add(trackID);
      //   console.log(scPlaylist.playlist);
      // playlist.
      // })
      //   }
    }
  });
}

searchSubmit.addEventListener('click', function() {
  var searchValue = document.querySelector('#searchInput').value;
  search(searchValue);
});
