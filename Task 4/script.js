document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCount();
        addTaskInputAnimation();
    }

    // Add input animation
    function addTaskInputAnimation() {
        taskInput.addEventListener('focus', () => {
            taskInput.parentElement.style.transform = 'scale(1.02)';
        });
        taskInput.addEventListener('blur', () => {
            taskInput.parentElement.style.transform = 'scale(1)';
        });
    }

    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            tasks.push(task);
            saveTasks();
            renderTasks();
            updateTaskCount();
            taskInput.value = '';
            showNotification('Task added successfully!');
        }
    }

    // Delete task
    function deleteTask(id) {
        const task = tasks.find(t => t.id === id);
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
        showNotification(`Task "${task.text}" deleted!`);
    }

    // Toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                const newStatus = !task.completed;
                showNotification(`Task marked as ${newStatus ? 'completed' : 'active'}!`);
                return { ...task, completed: newStatus };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        updateTaskCount();
    }

    // Clear completed tasks
    function clearCompleted() {
        const completedCount = tasks.filter(task => task.completed).length;
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
        showNotification(`Cleared ${completedCount} completed tasks!`);
    }

    // Filter tasks
    function filterTasks(filter) {
        currentFilter = filter;
        renderTasks();
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add styles for notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '1rem 2rem';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.animation = 'slideIn 0.5s ease-out';

        // Add keyframes for animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks ${currentFilter !== 'all' ? currentFilter : ''} found</p>
            `;
            taskList.appendChild(emptyMessage);
            return;
        }

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-task">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            const checkbox = taskItem.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const deleteBtn = taskItem.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(taskItem);
        });
    }

    // Update task count
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterTasks(btn.dataset.filter);
        });
    });

    // Initialize the app
    init();
}); 