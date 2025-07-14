//这里更加适合使用防抖
export function showScrollInfo() {
    const throttledShow = setThrottle(() => {
        console.log(
            "已滚动", window.scrollY,
            "innerHeight", window.innerHeight,
            "\n可见部分", window.scrollY, "-", window.scrollY + window.innerHeight,
            "body总长",
            document.body.offsetHeight)
    }, 500)

    window.addEventListener('scroll', throttledShow)

}

export function infiniteScroll(distance, throttleTime, callback) {

    const throttledScrollHandel = setThrottle(() => {
        scrollHandle(distance, callback);
    }, throttleTime);

    window.addEventListener('scroll', throttledScrollHandel)

    return () => {
        window.removeEventListener('scroll', throttledScrollHandel);
    };
}

function scrollHandle(distance, callback) {
    if (window.scrollY + window.innerHeight
        >= document.body.offsetHeight - distance) {
        callback();
    }
}

//call、bind、apply忘记了
function setThrottle(func, delay) {
    let timer = null;
    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, arguments);
                timer = null;
            }, delay);
        }
    }
}