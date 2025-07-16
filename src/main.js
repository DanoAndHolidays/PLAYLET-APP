import { showScrollInfo } from './infiniteScroll.js';
import { infiniteScroll } from './infiniteScroll.js';

const mainRandomEl = document.getElementById("main-random");
const upDataBtn = document.getElementById('upDataBtn');
const category = document.getElementById('category');
const categoryBtn = document.getElementById('categoryBtn');

//清空主体的内容
mainRandomEl.innerHTML = '';
showVideos(15);
showCategoryList();
showScrollInfo();
infiniteScroll(700, 300, () => {
    console.log("触发无限滚动");
    showVideos(15);
})

categoryBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
})

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        categoryBtn.classList.remove('unshow');
    } else {
        categoryBtn.classList.add('unshow');
    }
});

upDataBtn.addEventListener('click', () => {
    mainRandomEl.innerHTML = '';
    showVideos(12);
});

function showCategoryList() {
    getCategoryList().then(res => {
        const list = res.data.data;
        list.forEach(element => {
            const { name, name_en, cid } = element;
            const listEl = document.createElement('span');
            listEl.classList.add('list');

            listEl.innerHTML = `
            
            ${name}
            
            `;

            category.appendChild(listEl);
        })
    })
}

async function getCategoryList(page = 1, limit = 15) {
    const response = await fetch(`https://playlet.zonelian.com/api/category/list?page=${page}&limit=${limit}&zlsj=zlsj`);
    const data = await response.json();
    return data;
}

function showVideos(num) {
    addPlaceHolder(num);
    setTimeout(() => {
        fetchVideoList(num).then(response => {
            if (response.code !== 200) {
                throw new Error(response.message || "请求失败");
            }
            const videoList = response.data.data;

            videoList.forEach(element => {
                const { eid, vid, episode, url, episode_total, title, img } = element;
                const videoEl = document.querySelector('.placeholder');

                videoEl.innerHTML = `
                <div><img src="${img}" alt="剧集图片"></div>
                <h4>${title}</h4>
                <small> ${episode_total}集全 </small>
                <p>当前剧集 <span>${episode}</span></p>
            `;
                videoEl.classList.remove('placeholder');

                videoEl.addEventListener('click', () => {
                    toPlay(eid, vid, episode, url, episode_total, title, img);
                })
            });
        })
    }, 500);
}

// 获取分类短剧列表
async function fetchVideoList(num, page = 1) {
    try {
        const response =
            await fetch(`https://playlet.zonelian.com/api/playlet/random?uid&page=${page}&limit=${num}&zlsj=zlsj`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取视频列表失败:', error);
        // 可以在这里添加UI错误提示
        throw error;
    }
}

function addPlaceHolder(num) {
    for (let i = 0; i < num; i++) {
        const videoEl = document.createElement('div');
        videoEl.classList.add('video', 'placeholder');
        videoEl.innerHTML = `
            <div></div>
            <h4></h4>
            <small></small>
            <p></p>
        `
        mainRandomEl.appendChild(videoEl);
    }
}

function toPlay(eid, vid, episode, url, episode_total, title, img) {
    const data = {
        eid: eid,
        vid: vid,
        episode: episode,
        url: url,
        episode_total: episode_total,
        title: title,
        img: img,
    }

    const queryString = new URLSearchParams(data).toString();
    window.location.href = `/components/play/play.html?${queryString}`;
}