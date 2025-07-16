let currentEpisode = 1;
let currentEpisode_total = 1;
let episodeList = 0;

const urlParams = new URLSearchParams(window.location.search);
const episode = urlParams.get('episode');
const url = urlParams.get('url');
const episode_total = urlParams.get('episode_total');
const title = urlParams.get('title');
const titleEl = document.getElementById('title');
const img = urlParams.get('img');
const episode_totalEl = document.getElementById('episode_total');
const imgEl = document.getElementById('img');
const sourceEl = document.getElementById('source');
const videoEl = document.getElementById('video');

const episodeEl = document.getElementById('episode');

let eid = urlParams.get('eid');
let vid = urlParams.get('vid');
let page = 1;
let limit = 15;



getUrlParams();
playNext(eid, vid, page, limit);

function getUrlParams() {
    window.addEventListener('DOMContentLoaded', () => {
        currentEpisode = episode;
        currentEpisode_total = episode_total;
        titleEl.innerText = title;
        episode_totalEl.innerText = `${episode_total}集全`;
        imgEl.src = img;

        play(url);
    })
}

function play(url) {
    sourceEl.src = `https://playletcdn.nnchenxin.cn${url}`;
    sourceEl.type = 'video/mp4';

    videoEl.load();
}

async function playNext(eid, vid, page, limit) {
    const response = await fetch(`https://playlet.zonelian.com/api/playlet/watch?vid=${vid}&eid=${eid}&page=${page}&limit=${limit}&zlsj=zlsj`)
    const data = await response.json();
    console.log(data);

    const res = data.data.data;
    console.log(res);

    res.forEach(element => {

        const { eid, vid, episode, url } = element;

        const episodeSpanEl = document.createElement('span');
        episodeSpanEl.innerHTML = `
            ${episode}
        `;
        episodeSpanEl.addEventListener('click', () => {
            play(url);
        });

        episodeEl.appendChild(episodeSpanEl);

    });

}