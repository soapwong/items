const log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return null
    } else {
        return element
    }
}

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

const appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

const removeClassAll = function(className) {
    let selector = '.' + className
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.remove(className)
    }
}

const addClassAll = function(className) {
    let selector = '.' + className
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.classList.add(className)
    }
}

const bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

const bindAll = function(selector, eventName, callback) {
    let elements = es(selector)
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 查找 element 的所有子元素
const find = function(element, selector) {
    let e = element.querySelector(selector)
    if (e === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return e
    }
}

// closestXXX, 根据 class, id, 标签, 查找子节点的父元素
// parentElement 如果查找不到则会返回 null
const closestClass = function(element, className) {
    let e = element
    while(e !== null) {
        // 判断 e 是否包含 className 这个 class
        if (e.classList.contains(className)) {
            return e
        } else {
            e = e.parentElement
        }
    }
    return null
}

const closestId = function(element, idName) {
    let e = element
    while (e !== null) {
        // 判断 e 是否包含 idName 这个 id
        if (e.id === idName) {
            return e
        } else {
            e = e.parentElement
        }
    }
    return null
}

const closestTag = function(element, tagName) {
    let e = element
    while(e !== null) {
        // 判断 e 是否和 tagName 相等(忽略大小写), 统一大小写
        if (e.tagName.toUpperCase() === tagName.toUpperCase()) {
            return e
        } else {
            e = e.parentElement
        }
    }
    return null
}

const closest = function(element, selector) {
    let c = selector[0]
    if (c === '.') {
        // 说明是 class 选择器
        let className = selector.slice(1)
        return closestClass(element, className)
    } else if (c === '#') {
        // 说明是 id 选择器
        let idName = selector.slice(1)
        return closestId(element, idName)
    } else {
        // 说明是元素选择器
        let tag = selector
        return closestTag(element, tag)
    }
}
