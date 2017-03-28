var title = document.querySelector('#title');
var titleLink = document.querySelector('#titleLink');
var artist = document.querySelector('#artist');
var artistLink = document.querySelector('#artistLink');
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

function SoundCloud(source) {
  this.source = '/tracks/'+source;
  this.song = SC.stream('/tracks/'+source)
}

SoundCloud.prototype.play = function() {
  this.song.then(function(player){
    player.play();
  });
  postTrackInfo(this);
}

SoundCloud.prototype.pause = function() {
  this.song.then(function(player){
    player.pause();
    console.log(this.song)
  })
}

function postTrackInfo(track) {
  SC.get(track.source).then(function(response) {
    console.log(response);
    title.innerHTML = response.title.split("-")[1];
    artist.innerHTML = response.title.split("-")[0];
    titleLink.setAttribute('href', response.permalink_url);
    artistLink.setAttribute('href', response.permalink_url.split('/').slice(0,-1).join('/'))
    cover.setAttribute('src', response.artwork_url);
  })
}

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
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.setAttribute('src', response[x].artwork_url);
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
        console.log(response[getId].id)
        var scSong1 = new SoundCloud(response[getId].id);
        scSong1.play();

        pause.addEventListener('click', function() {
          scSong1.pause();
        })

        play.addEventListener('click', function() {
          scSong1.play();
        })
      })
    }
  })
}

searchSubmit.addEventListener('click', function() {
  var searchValue = document.querySelector('#searchInput').value;
  search(searchValue);
})
