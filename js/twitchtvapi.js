
var streamers = [ 
    { name: 'freecodecamp' },
    { name: 'scarlettm' },
    { name: 'dendi' },
    { name: 'admiralbulldog' },
    { name: 'thevalentinanappi' }
]

const fetchUser = function (streamer, idx) {
    let apiUrl = 'https://wind-bow.glitch.me/twitch-api/users/' + streamer.name;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = cb;
    xmlHttp.open("GET", apiUrl); // true for asynchronous 
    xmlHttp.send(null);
    function cb() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let user = JSON.parse(xmlHttp.responseText);
            streamers[idx].img = user.logo;
        }
   }
};


const fetchStreams = function(streamer,idx) {
    let apiUrl = 'https://wind-bow.glitch.me/twitch-api/streams/'+streamer.name;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = cb;
    xmlHttp.open("GET", apiUrl); // true for asynchronous 
    xmlHttp.send(null);
    function cb() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let streamData = JSON.parse(xmlHttp.responseText);
            if(streamData.stream) {
                streamers[idx].isOnline =  streamData.stream !== null;
                streamers[idx].url = streamData.stream.channel.url;
                streamers[idx].game = streamData.stream.game
                streamers[idx].title = streamData.stream.channel.status;
            }
            displayData();
        }
    }
};


const displayData = function(filter) {
    totalResponse++;
    if(totalResponse === streamers.length) {

        let itemsToDisplay = streamers;
        
        let content = document.getElementsByTagName("main")[0];
        content.innerHTML = '';

        itemsToDisplay.forEach( item => {
            let article  = document.createElement('article');
            article.classList.add("streamer-card");

            let img  = document.createElement('img');
            img.classList.add("streamer-img");
            img.setAttribute("alt", item.name + ' icon');
            img.setAttribute("src", item.img);

            let user  = document.createElement('p');
            user.classList.add("streamer-card-item-2");
            user.innerHTML = item.name;

            let game  = document.createElement('p');
            game.classList.add("streamer-card-item-3");
            game.innerHTML = item.game || 'offline';
            
            article.appendChild(img);
            article.appendChild(user);
            article.appendChild(game);

            if(item.title) {
                let title  = document.createElement('p');
                title.classList.add("streamer-card-item-4");
                title.innerHTML = item.title;
                article.appendChild(title);
            }

            content.appendChild(article)

        });
    }
}

let totalResponse = 0;

streamers.forEach( (streamer,idx) => {
    fetchUser(streamer,idx);
    fetchStreams(streamer,idx);
})






//  function fetchDatafn(str, cb) {
//     let apiUrl = 'https://wind-bow.glitch.me/twitch-api/users/'+str.name;
    
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//              let user = JSON.parse(xmlHttp.responseText);
//              str.img = user.logo;
//              cb();
//          }
//     }
//     xmlHttp.open("GET", apiUrl, true); // true for asynchronous 
//     xmlHttp.send(null);
 
//  };
