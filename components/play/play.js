let currentEpisode = 1;
let currentEpisode_total = 1;

let episodeList = 0;

getUrlParams();

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const episode = urlParams.get('episode');
    currentEpisode = episode;

    const url = urlParams.get('url');
    const episode_total = urlParams.get('episode_total');
    currentEpisode_total = episode_total;

    const title = urlParams.get('title');
    const titleEl = document.getElementById('title');
    titleEl.innerText = title;

    const img = urlParams.get('img');

    const episode_totalEl = document.getElementById('episode_total');
    episode_totalEl.innerText = `${episode_total}集全`;

    const imgEl = document.getElementById('img');
    imgEl.src = img;

    const sourceEl = document.getElementById('source');
    sourceEl.src = `https://playletcdn.nnchenxin.cn${url}`;
}

function playNext() {
    if (currentEpisode < currentEpisode_total) {

    }
}