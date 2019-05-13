var nextIndex = function(slide, offset) {
    var numberOfImgs = Number(slide.dataset.imgs)
    var activeIndex = Number(slide.dataset.active)
    // 上一张 offset 是 -1
    // 下一张 offset 是 1
    var i = (numberOfImgs + activeIndex + offset) % numberOfImgs
    return i
}

var bindEventSlide = function() {
    var selector = '.soap-slide-button'
    bindAll(selector, 'click', function(event) {
        log('click')
        var button = event.target
        var slide = button.parentElement
        var offset = Number(button.dataset.offset)
        var index = nextIndex(slide, offset)
        showImageAtIndex(slide, index)
    })
}

var showImageAtIndex = function(slide, index) {
    var nextIndex = index
    slide.dataset.active = nextIndex
    var nextSelector = '#id-soapimage-' + String(nextIndex)
    var className = 'soap-active'
    removeClassAll(className)
    var img = e(nextSelector)
    // log('next img')
    img.classList.add(className)

    removeClassAll('soap-white')
    var indiSelector = '#id-indi-' + String(nextIndex)
    var indi = e(indiSelector)
    indi.classList.add('soap-white')
}

var bindEventIndicator = function() {
    var selector = '.soap-slide-indi'
    // 'mouseover' 改成 'click'
    bindAll(selector, 'mouseover', function(event) {
        var self = event.target
        var index = Number(self.dataset.index)
        // 播放第 n 张图片
        var slide = self.closest('.soap-slide')
        showImageAtIndex(slide, index)
    })
}

var playNextImage = function() {
    var slide = e('.soap-slide')
    var index = nextIndex(slide, 1)
    showImageAtIndex(slide, index)
}

var autoPlay = function() {
    var interval = 3000
    var clockId = setInterval(function() {
        // 每 3s 都会调用一次
        playNextImage()
    }, interval)
}

var __main = function() {
    bindEventSlide()
    bindEventIndicator()
    autoPlay()
}

__main()
