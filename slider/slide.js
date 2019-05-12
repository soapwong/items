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
    // 设置父节点的 data-active
    slide.dataset.active = nextIndex
    // 注意, 尽管 js 支持字符串和数字直接相加, 但是我们不要这么做
    // 因为非常容易出 bug, 所以要转成同一个类型才能相加
    var nextSelector = '#id-soapimage-' + String(nextIndex)
    // 删除当前图片的 class 给下一张图片加上 class
    var className = 'soap-active'
    removeClassAll(className)
    // log('remove class', nextSelector)
    var img = e(nextSelector)
    // log('next img')
    img.classList.add(className)

    // 切换小圆点
    // 1. 删除当前小圆点的 class
    removeClassAll('soap-white')
    // 2. 得到下一个小圆点的选择器
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
        // 直接播放第 n 张图片
        var slide = self.closest('.soap-slide')
        showImageAtIndex(slide, index)
    })
}

var playNextImage = function() {
    var slide = e('.soap-slide')
    // 默认是播放下一张, 下一张的 offer 是 1, 直接传
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
