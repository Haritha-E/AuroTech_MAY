document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter');
    const clearTasksButton = document.getElementById('clear-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'uncompleted') return !task.completed;
            return true;
        });
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = task.completed ? 'completed' : '';
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="edit">✏️</button>
                    <button class="delete">X</button>
                </div>
            `;
            taskItem.querySelector('span').addEventListener('click', () => toggleTask(task.id));
            taskItem.querySelector('.edit').addEventListener('click', () => editTask(task.id));
            taskItem.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
            taskList.appendChild(taskItem);
        });
    }

    function addTask(text) {
        const newTask = {
            id: Date.now(),
            text,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    }

    function toggleTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newText = prompt('Edit Task:', task.text);
            if (newText) {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function clearTasks() {
        tasks = [];
        saveTasks();
        renderTasks();
    }

    taskForm.addEventListener('submit', event => {
        event.preventDefault();
        const newTaskText = newTaskInput.value.trim();
        if (newTaskText !== '') {
            addTask(newTaskText);
            newTaskInput.value = '';
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filter = button.id;
            renderTasks();
        });
    });

    clearTasksButton.addEventListener('click', clearTasks);

    renderTasks();
});
