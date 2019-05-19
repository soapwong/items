const showCurrentTime = function(audio) {
    // 动态添加时间
    setInterval(function() {
        let currentLabel = e('#id-span-current')
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
        playPause(audio)
    })
}

// chrome 新版禁止了自动播放
const bindEventCanplay = function(audio) {
    audio.addEventListener('canplay', () => {
        // audio.play()
        showCurrentTime(audio)
    })
}

// 单曲循环
const allSongs = function() {
    let l = e('#id-song-list')
    let s = l.querySelectorAll('.song')
    let songs = []
    for (let i = 0; i < s.length; i++) {
        let song = {}
        song.index = i
        song.path = s[i].dataset.path
        song.name = s[i].innerHTML
        songs.push(song)
    }
    return songs
}

const singlePlay = function(audio) {
    let songs = allSongs()
    let src = audio.src.split('/').slice(-1)[0]
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            return songs[i]
        }
    }
}

const loopPlay = function(audio) {
    let songs = allSongs()
    let src = audio.src.split('/').slice(-1)[0]
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            let index = (i + 1) % songs.length
            return songs[index]
        }
    }
}

const loopPlayLast = function(audio) {
    let songs = allSongs()
    let src = audio.src.split('/').slice(-1)[0]
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            let index = (i + songs.length - 1) % songs.length
            return songs[index]
        }
    }
}

const choice = function (array) {
    let a = Math.random()
    a = a * array.length
    let index = Math.floor(a)
    return array[index]
}

const shufflePlay = function(audio) {
    let songs = allSongs()
    let src = audio.src.split('/').slice(-1)[0]
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].path == src) {
            songs.splice(i, 1)
            let song = choice(songs)
            return song
        }
    }
}

const nextSong = function(audio) {
    let button = e('#id-play-mode')
    let song = loopPlay(audio)
    if (button.classList.contains('danquxunhuan')) {
        song = singlePlay(audio)
    } else if (button.classList.contains('liebiaoxunhuan')) {
        song = loopPlay(audio)
    } else if (button.classList.contains('suiji')) {
        song = shufflePlay(audio)
    }
    return song
}
// log('song', song)
const lastSong = function(audio) {
    let button = e('#id-play-mode')
    let song = loopPlay(audio)
    if (button.classList.contains('danquxunhuan')) {
        song = singlePlay(audio)
    } else if (button.classList.contains('liebiaoxunhuan')) {
        song = loopPlayLast(audio)
    } else if (button.classList.contains('suiji')) {
        song = shufflePlay(audio)
    }
    return song
}

const songSelected = function(audio) {
    let sel = e('.selected')
    let l = e('#id-song-list')
    let s = l.querySelectorAll('.song')
    let src = audio.src.split('/').slice(-1)[0]
    if (!(sel.dataset.path == audio.src)) {
        for (let i = 0; i < s.length; i++) {
            if (s[i].dataset.path == src) {
                sel.classList.remove('selected')
                s[i].classList.toggle('selected')
            }
        }
    }
}

const bindEventNext = function(audio) {
    let btn = e('#id-button-next')
    let name = e('.song-name')
    bindEvent(btn, 'click', function (event) {
        let song = nextSong(audio)
        audio.src = song.path
        name.innerHTML = song.name
        songSelected(audio)
        playPause(audio)
    })
}

const bindEventLast = function(audio) {
    let btn = e('#id-button-last')
    let name = e('.song-name')
    bindEvent(btn, 'click', function (event) {
        let song = lastSong(audio)
        audio.src = song.path
        name.innerHTML = song.name
        songSelected(audio)
        buttonPlay(audio)
    })
}

const bindEventSongName = function(audio) {
    let name = e('.song-name')
    bindAll('.song', 'click', function () {
        let self = event.target
        let path = self.dataset.path
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
        // log('click', button)
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

const bindEventSound = function(audio) {
    let icon = e('#id-music-icon')
    let range = e('#id-input-sound')
    bindEvent(range, 'input', function(event) {
        let input = event.target
        let value = input.value
        let mode = 'shengyin'
        audio.volume = Number(value / 100)
        if (audio.volume == 0) {
            mode = 'jingyin'
        }
        icon.innerHTML = templateMode(mode)
    })
}

const bindEvents = function() {
    let audio = e('#id-audio-player')
    bindEventPlay(audio)
    // chrome 新版禁止了自动播放
    bindEventCanplay(audio)
    bindEventMode()
    bindEventSongName(audio)
    bindEventNext(audio)
    bindEventLast(audio)
    bindEventSound(audio)

    // mode
}

const __main = function() {
    bindEvents()
}

__main()
