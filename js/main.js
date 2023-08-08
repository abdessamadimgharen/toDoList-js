let  theInput = document.querySelector('.add-task input');
let  addBtn = document.querySelector('.add-task .plus');
let  noTaskMsg = document.querySelector('.no-tasks-msg');
let  tasksContainer = document.querySelector('.tasks-catcher');
let finishedAll = document.querySelector('.finishedAll');
let deleteAll = document.querySelector('.deleteAll');

let tasksCount = document.querySelector('.tasks-count span')
let tasksCompleted = document.querySelector('.tasks-completed span')

window.onload = () => {
    theInput.focus();
}


let arrToStoreMyTasks = [];


if(localStorage.getItem('tasks')) {
    arrToStoreMyTasks = JSON.parse(localStorage.getItem('tasks'));
}  else {
    showNoMsg()  
}
// trigger get data from localstorage 
getDataFromLocalStorage()

addBtn.addEventListener('click', () => {
    if(theInput.value === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The input is empty!',
        })
    } else {
        addTaskToArray(theInput.value);
        theInput.value ='';
        hideNoMsg();
    }
})


// Click on deleteBtn and remove its parent
tasksContainer.addEventListener('click', e => {
    if(e.target.classList.contains('delete')) {
        removeTaskFromLocalWith(e.target.parentElement.getAttribute('data-id'))
        e.target.parentElement.remove();
        countTasks();
    }
    if(e.target.classList.contains('task-box')) {
        // toggle completed for the task 
        toggleStatusTaskWith(e.target.getAttribute('data-id'));
        // toggle done class 
        e.target.classList.toggle('finished');
        countTasks();
    }
})


function addTaskToArray(taskValue) {
    if (arrToStoreMyTasks.find((task) => task.title === taskValue)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You have two tasks with the same value!',
        })
        return
    }
    let task = {
        id: Date.now(),
        title: taskValue,
        completed: false
    }
    arrToStoreMyTasks.push(task);
    addElementToPageFrom(arrToStoreMyTasks);
    addDataToLocalStorageFrom(arrToStoreMyTasks)
}

function addElementToPageFrom(arrToStoreMyTasks) {
    // Empty Tasks Div 
    tasksContainer.innerHTML = '';
    // Loop on array of tasks and create div for each task 
    arrToStoreMyTasks.forEach(element => {
        let mainSpan = document.createElement('span');
        mainSpan.className = 'task-box';

        if(element.completed) {
            mainSpan.className = 'task-box finished';
            countTasks()
        }

        mainSpan.textContent = element.title;
        mainSpan.setAttribute('data-id', element.id)

        let childSpan = document.createElement('span');
        childSpan.className = 'delete';
        childSpan.innerHTML = 'Delete';

        mainSpan.appendChild(childSpan);
        tasksContainer.prepend(mainSpan);


        countTasks();
        
        theInput.focus();

    });
}

function addDataToLocalStorageFrom(arrToStoreMyTasks) {
    localStorage.setItem('tasks', JSON.stringify(arrToStoreMyTasks));
}

function getDataFromLocalStorage() {
    let data = localStorage.getItem('tasks');
    if(data) {
        let tasks = JSON.parse(data);
        addElementToPageFrom(tasks)
    }
}

function removeTaskFromLocalWith(taskId) {
    arrToStoreMyTasks = arrToStoreMyTasks.filter((task) => task.id != taskId);
    addDataToLocalStorageFrom(arrToStoreMyTasks);
}
// localStorage.clear()

function toggleStatusTaskWith(taskId) {
    for(let i = 0; i < arrToStoreMyTasks.length; i++) {
        if(arrToStoreMyTasks[i].id == taskId) {
            arrToStoreMyTasks[i].completed == false ? (arrToStoreMyTasks[i].completed = true): (arrToStoreMyTasks[i].completed = false);
        }
    }
    addDataToLocalStorageFrom(arrToStoreMyTasks);
}


deleteAll.onclick = () => {
    localStorage.clear();
    tasksContainer.innerHTML = '';
    arrToStoreMyTasks = []
    countTasks();
    showNoMsg()
}

finishedAll.onclick = () => {
    document.querySelectorAll('.tasks-catcher .task-box').forEach((task) => {
        task.classList.toggle('finished');
        countTasks()
    })
}


function countTasks() {
    tasksCount.innerHTML = document.querySelectorAll('.tasks-catcher .task-box').length;
    tasksCompleted.innerHTML = document.querySelectorAll('.tasks-catcher .finished').length;

    if(parseInt(tasksCount.innerHTML) === 0)  {
        showNoMsg()
    }
}

function hideNoMsg() {
    noTaskMsg.style.display = 'none'
}
function showNoMsg() {
    noTaskMsg.style.display = 'block'
}


if(tasksContainer.children.length === 0) {
    showNoMsg();
}