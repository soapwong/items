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

const templateMode = function(mode) {
    let t = `
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon${mode}"></use>
        </svg>
    `
    return t
}

const buttonPlay = function(audio) {
    let button = e("#id-button-play")
    let mode = 'bofang'
    if (audio.paused) {
        mode = 'bofang'
    } else if (audio.readyState === 4) {
        mode = 'zanting'
    }
    button.innerHTML = templateMode(mode)
}

const playPause = function(audio) {
    if (audio.readyState === 4 && audio.paused) {
        audio.play()
    } else {
        audio.pause()
    }
}

const bindEventPlay = function(audio) {
    let button = e("#id-button-play")
    bindEvent(button, 'click', function(event) {
        buttonPlay(audio)
        // log('button')
        playPause(audio)
    })
}

// chrome 新版禁止了自动播放
const bindEventCanplay = function(audio) {
    audio.addEventListener('canplay', () => {
        audio.play()
        showCurrentTime(audio)
    })
}

// 单曲循环
var allSongs = function () {
    var l = e('#id-song-list')
    var s = l.querySelectorAll('.song')
    var songs = []
    for (var i = 0; i < s.length; i++) {
        var song = {}
        song.index = i
        song.path = s[i].dataset.path
        song.name = s[i].innerHTML
        songs.push(song)
    }
    return songs
}

var cycleSingle = function (audio) {
    var songs = allSongs()
    var src = audio.src.split('/').slice(-1)[0]
    for (var i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            return songs[i]
        }
    }
}

var loopPlay = function (audio) {
    var songs = allSongs()
    var src = audio.src.split('/').slice(-1)[0]
    for (var i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            var index = (i + 1) % songs.length
            return songs[index]
        }
    }
}

var loopPlayLast = function (audio) {
    var songs = allSongs()
    var src = audio.src.split('/').slice(-1)[0]
    for (var i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            var index = (i + songs.length - 1) % songs.length
            return songs[index]
        }
    }
}

var choice = function (array) {
    var a = Math.random()
    a = a * array.length
    var index = Math.floor(a)
    return array[index]
}

var shufflePlay = function (audio) {
    var songs = allSongs()
    var src = audio.src.split('/').slice(-1)[0]
    for (var i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            songs.splice(i, 1)
            var song = choice(songs)
            return song
        }
    }
}

const nextSong = function(audio) {
    let button = e('#id-play-mode')
    if (button.classList.contains('danquxunhuan')) {
        var song = cycleSingle(audio)
    } else if (button.classList.contains('liebiaoxunhuan')) {
        var song = loopPlay(audio)
    } else if (button.classList.contains('suiji')) {
        var song = shufflePlay(audio)
    }
    return song
}

const lastSong = function (audio) {
    let button = e('#id-play-mode')
    if (button.classList.contains('danquxunhuan')) {
        var song = cycleSingle(audio)
    } else if (button.classList.contains('liebiaoxunhuan')) {
        var song = loopPlayLast(audio)
    } else if (button.classList.contains('suiji')) {
        var song = shufflePlay(audio)
    }
    return song
}

var songSelected = function (audio) {
    var sel = e('.selected')
    var l = e('#id-song-list')
    var s = l.querySelectorAll('.song')
    var src = audio.src.split('/').slice(-1)[0]
    // log('songs', src)
    if (!(sel.dataset.path == audio.src)) {
        for (var i = 0; i < s.length; i++) {
            if (s[i].dataset.path == src) {
                sel.classList.remove('selected')
                s[i].classList.toggle('selected')
            }
        }
    }
}

var bindEventNext = function (audio) {
    var btn = e('#id-button-next')
    var name = e('.song-name')
    bindEvent(btn, 'click', function (event) {
        var song = nextSong(audio)
        audio.src = song.path
        name.innerHTML = song.name
        songSelected(audio)
        playPause(audio)
    })
}

var bindEventLast = function (audio) {
    var btn = e('#id-button-last')
    var name = e('.song-name')
    bindEvent(btn, 'click', function (event) {
        var song = lastSong(audio)
        audio.src = song.path
        name.innerHTML = song.name
        songSelected(audio)
        buttonPlay(audio)
    })
}

var bindEventSongName = function (audio) {
    var name = e('.song-name')
    bindAll('.song', 'click', function () {
        var self = event.target
        var path = self.dataset.path
        audio.src = path
        name.innerHTML = self.innerHTML
        songSelected(audio)
        buttonPlay(audio)
    })
}

const bindEventMode = function() {
    let button = e('#id-play-mode')
    let mode = 'liebiaoxunhuan'
    bindEvent(button, 'click', function() {
        log('click', button)
        if (button.classList.contains('danquxunhuan')) {
            button.classList.remove('danquxunhuan')
            button.classList.toggle('liebiaoxunhuan')
            mode = 'liebiaoxunhuan'
        } else if (button.classList.contains('liebiaoxunhuan')) {
            button.classList.remove('liebiaoxunhuan')
            button.classList.toggle('suiji')
            mode = 'suiji'
        } else if (button.classList.contains('suiji')) {
            button.classList.remove('suiji')
            button.classList.toggle('danquxunhuan')
            mode = 'danquxunhuan'
        }
        button.innerHTML = templateMode(mode)
    })
}

const bindEvents = function() {
    let audio = e('#id-audio-player')
    bindEventPlay(audio)
    bindEventCanplay(audio)
    bindEventMode()
    bindEventSongName(audio)
    bindEventNext(audio)
    bindEventLast(audio)

    // mode
}

const __main = function() {
    bindEvents()
}

__main()
