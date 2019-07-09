const templateTodo = function(todo) {
    let t = `
        <div class="todo-cell">
            <svg class="icon todo-done" aria-hidden="true">
                <use xlink:href="#iconcheck-circle"></use>
            </svg>
            <svg class="icon todo-edit" aria-hidden="true">
                <use xlink:href="#iconedit-square"></use>
            </svg>
            <svg class="icon todo-delete" aria-hidden="true">
                <use xlink:href="#iconclose-circle"></use>
            </svg>
            <span class="todo-task">${todo}</span>
        </div>
    `
    return t
}

const loadTodos = () => {
    let s = localStorage.savedTodos
    if (s === undefined) {
        return []
    } else {
        let ts = JSON.parse(s)
        return ts
    }
}

const insertTodos = todos => {
    let todoContainer = e('#id-div-container')
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i]
        let html = templateTodo(todo)
        appendHtml(todoContainer, html)
    }
}

const saveTodo = (todos, todo) => {
    var todos = loadTodos()
    todos.push(todo)
    let s = JSON.stringify(todos)
    localStorage.savedTodos = s
}

const deleteTodo = (container, todoCell) => {
    for (let i = 0; i < container.children.length; i++) {
        let cell = container.children[i]
        if (todoCell === cell) {
            todoCell.remove()
            let todos = loadTodos()
            todos.splice(i, 1)
            let s = JSON.stringify(todos)
            localStorage.savedTodos = s
            break
        }
    }
}

const updateTodo = (container, todoCell, value) => {
    for (let i = 0; i < container.children.length; i++) {
        let c = container.children[i]
        let todos = loadTodos()
        if (todoCell === c) {
            let t = todos[i]
            t.todo = value
            let s = JSON.stringify(todos)
            localStorage.savedTodos = s
        }
    }
}

const bindEventAdd = (todos) => {
    let addButton = e('#id-button-add')
    bindEvent(addButton, 'click', function() {
        let todoInput = e('#id-input-todo')
        let todo = todoInput.value
        saveTodo(todos, todo)
        let todoContainer = e('#id-div-container')
        let t = templateTodo(todo)
        appendHtml(todoContainer, t)
    })
}

const bindEvnetDone = () => {
    let todoContainer = e('#id-div-container')
    bindEvent(todoContainer, 'click', function(event) {
        let target = event.target
        if (target.classList.contains('todo-done')) {
            let todoDiv = target.parentElement
            todoDiv.classList.toggle('done')
        }
    })
}

const bindEventDelete = () => {
    let todoContainer = e('#id-div-container')
    bindEvent(todoContainer, 'click', function(event) {
        let target = event.target
        if (target.classList.contains('todo-delete')) {
            let todoDiv = target.closest('.todo-cell')
            deleteTodo(todoContainer, todoDiv)
        }
    })
}

const bindEventEdit = () => {
    let todoContainer = e('#id-div-container')
    bindEvent(todoContainer, 'click', function(event) {
        let target = event.target
        if (target.classList.contains('todo-edit')) {
            let todoCell = target.closest('.todo-cell')
            let task = todoCell.querySelector('.todo-task')
            task.contentEditable = true
            // 取得焦点
            task.focus()
        }
    })
}

const bindEventUpdate = () => {
    let todoContainer = e('#id-div-container')
    bindEvent(todoContainer, 'keydown', function(event) {
        let target = event.target
        if (target.classList.contains('todo-task')) {
            if (event.key === 'Enter') {
                event.preventDefault()
                target.contentEditable = false
                let todoCell = target.closest('.todo-cell')
                let value = target.innerHTML
                let container = todoCell.parentElement
                updateTodo(container, todoCell, value)
            }
        }
    })
}

const bindEvents = (todos) => {
    bindEventAdd(todos)
    bindEventDelete()
    bindEvnetDone()
    bindEventUpdate()
    bindEventEdit()
}

const __main = () => {
    let todos = loadTodos()
    insertTodos(todos)
    bindEvents()
}

__main()
