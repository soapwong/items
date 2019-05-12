const showCurrentTime = function(audio) {
    // 用定时器, 动态添加时间
    setInterval(function() {
        let currentLabel = e('#id-span-current')
        let durationLabel = e('#id-span-duration')
        let current = parseInt(audio.currentTime, 10)
        let duration = parseInt(audio.duration, 10)
        let s = `当前时间: ${current} 秒 / 总时间: ${duration} 秒`
        currentLabel.innerHTML = s
    }, 0)
}
// 绑定播放 暂停按钮
const bindEventPlay = function(audio) {
    let button = e('#id-button-play')
    button.addEventListener('click', () => {
        audio.play()
        showCurrentTime(audio)
    })
}

const bindEventPause = function(audio) {
    let button = e('#id-button-pause')
    button.addEventListener('click', () => {
        audio.pause()
    })
}

const bindEventChange = function(audio) {
    let container = e('#id-div-music')
    container.addEventListener('click', (event) => {
        let self = event.target
        let path = self.dataset.path
        audio.src = path
    })
}

const bindEventCanplay = function(audio) {
    audio.addEventListener('canplay', () => {
        audio.play()
        showCurrentTime(audio)
    })
}

// 单曲循环
const bindEventSingle = function(audio) {
    audio.addEventListener('ended', () => {
        let s = audio.src
        audio.src = s
    })
}

// 载入所有音乐
const allSongs = function() {
    let musics = es('.music')
    let songs = []
    for (let i = 0; i < musics.length; i++) {
        let m = musics[i]
        let path = m.dataset.path
        songs.push(path)
    }
    return songs
}

// 下一首歌
const nextSong = function(audio) {
    let songs = allSongs()
    let src = audio.src.split('/').slice(-1)[0]
    let index = songs.indexOf(src)
    index = (index + 1) % songs.length
    return songs[index]
}

// 顺序播放
const bindEventOrder = function(audio) {
    audio.addEventListener('ended', () => {
        let song = nextSong(audio)
        audio.src = song
    })
}

// 随机播放
const choice = function(array) {
    // 得到 0 - 1 的小数
    // 把 a 转成 0 -array.length 之间的小数
    // 得到 0 - array.length - 1 之间的整数做下标
    // 得到 array 的随机元素
    let a = Math.random()
    a = a * array.length
    let index = Math.floor(a)
    return array[index]
}

const randomSong = function() {
    let songs = allSongs()
    let s = choice(songs)
    return s
}

const bindEventRandom = function(audio) {
    audio.addEventListener('ended', () => {
        let song = randomSong()
        audio.src = song
    })
}

const bindEvents = function() {
    let audio = e('#id-audio-player')
    bindEventPlay(audio)
    bindEventPause(audio)
    bindEventChange(audio)
    bindEventCanplay(audio)

    // bindEventSingle(audio)
    bindEventOrder(audio)
    // bindEventRandom(audio)
}

const __main = function() {
    bindEvents()
}

__main()
