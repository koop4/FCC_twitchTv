var streamers = [ 
    { name: 'freecodecamp' },
    { name: 'scarlettm' },
    { name: 'dendi' },
    { name: 'admiralbulldog' },
    { name: 'thevalentinanappi' },
    { name: 'esl_sc2' }
]

let totalResponse = 0;

var isFiltering = false;
var filter = ['online', 'offline'];

const fetchUser = function (streamer, idx) {
    let apiUrl = 'https://wind-bow.glitch.me/twitch-api/users/' + streamer.name;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = cb;
    xmlHttp.open("GET", apiUrl); 
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
    xmlHttp.open("GET", apiUrl); 
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
        }
    }
};


const displayData = function() {
        let itemsToDisplay;
        if(filter.length === 2)
            itemsToDisplay = streamers;
        else 
            itemsToDisplay = streamers.filter( i => filter.indexOf('online')>=0 ? i.title : !i.title);
        
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

            let game  = document.createElement('a');
            game.classList.add("streamer-card-item-3");
            game.setAttribute("href", 'https://www.twitch.tv/'+item.name);
            game.setAttribute("target", '_blank');
            
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

        isFiltering = false;
}


function reload() {
    let content = document.getElementsByTagName("main")[0];
    content.innerHTML = `<article class="streamer-card"> 
        <img class="streamer-img" src="https://static-cdn.jtvnw.net/jtv_user_pictures/esl_sc2-profile_image-d6db9488cec97125-300x300.jpeg" alt=""> 
        <p class="streamer-card-item-2">I M LOADING</p>
        <p class="streamer-card-item-3">just wait </p>
        <p class="streamer-card-item-4">results will come soon</p>
    </article>`;
    totalResponse = 0 ;
    streamers.forEach( (streamer,idx) => {
        fetchUser(streamer,idx);
        fetchStreams(streamer,idx);
    });
    setTimeout(displayData, 1500); // to be promisify, imma lazy bitch
}

reload();

function filterStreamer(s) {
    // se sta filtrando o si sta rimuovendo l ultimo filtro non fa nulla
    if (isFiltering || ( filter.length === 1 && filter.indexOf(s)>=0 ) ) return;
    isFiltering = true;
    let currentFilter = document.getElementById(s+'Filter');
    if (currentFilter.classList.value.indexOf('active') >= 0) {
        currentFilter.classList.value = currentFilter.classList.value.replace('active', '');
        filter.splice(filter.indexOf(s),1);
    } else {
        currentFilter.classList.value = currentFilter.classList.value + 'active';
        filter.push(s);
    }
    displayData();
}
