
let currentEpisode_total = 1;
let episodeList = [];

let currentEpisodeIndex = 0;

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
const currentEpEl = document.getElementById('currentEp');
const episodeEl = document.getElementById('episode');

let currentEpisode = parseInt(urlParams.get('episode') || 1);

let eid = urlParams.get('eid');
let vid = urlParams.get('vid');
let page = 1;
let limit = 15;

videoEl.addEventListener('click', () => {
    if (videoEl.paused) {
        videoEl.play();
        document.getElementById('playBtn').style.display = "none";
        document.getElementById('pauseBtn').style.display = "inline";

    } else {
        videoEl.pause();
        document.getElementById('playBtn').style.display = "inline";
        document.getElementById('pauseBtn').style.display = "none";

    }
});

videoEl.addEventListener('progress', () => {
    if (videoEl.buffered.length > 0) {
        const bufferedEnd = videoEl.buffered.end(videoEl.buffered.length - 1);
        const duration = videoEl.duration;

        if (duration > 0) {
            const bufferedPercent = (bufferedEnd / duration) * 100;
            document.getElementById('buffer').style.width = `${bufferedPercent}%`;
        }
    }
})

const progressBar = document.getElementById('duration-container');

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoEl.currentTime = pos * videoEl.duration;
})

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const volumeXmarkBtn = document.getElementById('volumeXmarkBtn');
const volumeHighBtn = document.getElementById('volumeHighBtn');



getUrlParams();
playNext(eid, vid, page, limit);

function getUrlParams() {
    window.addEventListener('DOMContentLoaded', () => {
        currentEpisode = episode;
        currentEpisode_total = episode_total;
        titleEl.innerText = title;
        episode_totalEl.innerText = `${episode_total}集全`;
        imgEl.src = img;
        currentEpEl.innerHTML = `当前选集: <span>${episode}</span>`
        play(url);
    })
}

function play(url) {
    sourceEl.src = `https://playletcdn.nnchenxin.cn${url}`;
    sourceEl.type = 'video/mp4';
    currentEpEl.innerHTML = `当前选集: <span>${currentEpisode}</span>`
    videoEl.load();
}


async function playNext(eid, vid, page, limit) {
    episodeEl.innerHTML = "";
    const response = await fetch(`https://playlet.zonelian.com/api/playlet/watch?vid=${vid}&eid=${eid}&page=${page}&limit=${limit}&zlsj=zlsj`)
    const data = await response.json();

    const res = data.data.data;

    episodeList = data.data.data;

    currentEpisodeIndex = episodeList.findIndex(ep => parseInt(ep.episode) === currentEpisode);
    if (currentEpisodeIndex === -1) currentEpisodeIndex = 0; // 默认第一集

    res.forEach(element => {

        const { eid, vid, episode, url } = element;

        const episodeSpanEl = document.createElement('span');
        episodeSpanEl.innerHTML = `
        <p>
            ${episode}
        </p>
            `;
        episodeSpanEl.addEventListener('click', () => {
            currentEpisode = parseInt(episode)

            play(url);
            playNext(eid, vid, page, limit);
        });

        episodeEl.appendChild(episodeSpanEl);
    });
}

const id = setInterval(showDuration, 1000);

playBtn.addEventListener('click', () => {
    videoEl.play();
    document.getElementById('playBtn').style.display = "none";
    document.getElementById('pauseBtn').style.display = "inline";
})

pauseBtn.addEventListener('click', () => {
    videoEl.pause();
    document.getElementById('playBtn').style.display = "inline";
    document.getElementById('pauseBtn').style.display = "none";
})

setInterval(showDuration, 1000);

function showDuration() {
    const durationEl = document.getElementById('duration');
    durationEl.style.width = `${videoEl.currentTime / videoEl.duration * 100}%`;
    console.log(durationEl.style.width);


    const timeEl = document.getElementById('time');
    timeEl.innerText = `${formatTime(videoEl.currentTime)}/${formatTime(videoEl.duration)}`;
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};


progressBar.addEventListener('mousemove', (e) => {

    console.log('mousemove');

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const hoverTime = pos * video.duration;

    // 创建或更新提示元素
    let timeTooltip = document.getElementById('timeTooltip');
    if (!timeTooltip) {
        timeTooltip = document.createElement('div');
        timeTooltip.classList.add('timeTooltip');
        timeTooltip.id = 'timeTooltip';
        document.getElementById('controls').appendChild(timeTooltip);
    }

    // 设置提示位置和内容
    timeTooltip.style.left = `${e.clientX - rect.left + 205}px`;
    timeTooltip.textContent = `${formatTime(hoverTime)}`;
    timeTooltip.style.opacity = '1';
});

// 鼠标离开时隐藏提示
progressBar.addEventListener('mouseleave', () => {

    console.log('mouseleave');

    const timeTooltip = document.getElementById('timeTooltip');
    if (timeTooltip) {
        timeTooltip.style.opacity = '0';
    }
});


document.getElementById('next').addEventListener('click', () => {
    if (currentEpisodeIndex < episodeList.length - 1) {
        const nextEpisode = episodeList[currentEpisodeIndex + 1];
        currentEpisode = parseInt(nextEpisode.episode);
        currentEpisodeIndex++;
        play(nextEpisode.url);
        updateEpisodeDisplay(); // 更新UI显示
        highlightCurrentEpisode(); // 高亮当前选中的集数
    }
});

function updateEpisodeDisplay() {
    currentEpEl.innerHTML = `当前选集: <span>${currentEpisode}</span>`;

    // 禁用/启用"下一集"按钮（如果是最后一集）
    const nextBtn = document.getElementById('next');
    if (currentEpisodeIndex >= episodes.length - 1) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
    }
}

// 高亮当前选中的集数
function highlightCurrentEpisode() {
    const episodeElements = episodeEl.querySelectorAll('span p');
    episodeElements.forEach((el, index) => {
        if (index === currentEpisodeIndex) {
            el.classList.add('current-episode');
        } else {
            el.classList.remove('current-episode');
        }
    });
}
