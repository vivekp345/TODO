// public/app.js

document.addEventListener('DOMContentLoaded', () => {
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskTimelineInput = document.getElementById('task-timeline');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const activeTodoList = document.getElementById('active-todo-list');
    const completedTodoList = document.getElementById('completed-todo-list');
    const logoutBtn = document.getElementById('logout-btn');
    const messageDiv = document.getElementById('message');
    const activeTasksTab = document.getElementById('active-tasks-tab');
    const completedTasksTab = document.getElementById('completed-tasks-tab');
    const activeTasksContainer = document.getElementById('active-tasks-list-container');
    const completedTasksContainer = document.getElementById('completed-tasks-list-container');
    const motiveStatementElement = document.getElementById('motive-statement'); // <-- New element reference

    flatpickr(taskTimelineInput, {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    // Motive Statements Array
    const motiveStatements = [
        "\"The best way to predict the future is to create it.\" - Peter Drucker",
        "\"Start where you are. Use what you have. Do what you can.\" - Arthur Ashe",
        "\"The journey of a thousand miles begins with a single step.\" - Lao Tzu",
        "\"Your only limit is your imagination. Get to work!\"",
        "\"Focus on progress, not perfection.\""
    ];

    // Function to display a random motive statement
    const displayMotiveStatement = () => {
        const randomIndex = Math.floor(Math.random() * motiveStatements.length);
        motiveStatementElement.textContent = motiveStatements[randomIndex];
    };

    // Call it on page load
    displayMotiveStatement();


    const displayMessage = (msg, type = 'error') => {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    };

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    return;
                }
                throw new Error('Failed to fetch todos.');
            }
            const todos = await response.json();
            renderTodos(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            displayMessage(error.message || 'Error loading tasks.');
        }
    };

    const renderTodos = (todos) => {
        activeTodoList.innerHTML = '';
        completedTodoList.innerHTML = '';

        const activeTasks = todos.filter(todo => !todo.completed);
        const completedTasks = todos.filter(todo => todo.completed);

        activeTasks.forEach(todo => appendTodoItem(todo, activeTodoList));
        completedTasks.forEach(todo => appendTodoItem(todo, completedTodoList));
    };

    const appendTodoItem = (todo, parentElement) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        const timelineDate = todo.timeline && todo.timeline._seconds
            ? new Date(todo.timeline._seconds * 1000).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })
            : 'No Due Date';

        li.innerHTML = `
            <div class="todo-item-header">
                <h3>${todo.name}</h3>
                <span class="todo-timeline">${timelineDate}</span>
            </div>
            ${todo.description ? `<p class="todo-item-description">${todo.description}</p>` : ''}
            <div class="todo-actions">
                <button class="toggle-complete-btn secondary-btn">
                    ${todo.completed ? 'Mark Active' : 'Mark Complete'}
                </button>
                <button class="delete-todo-btn danger-btn">Delete</button>
            </div>
        `;

        parentElement.appendChild(li);
    };

    addTodoBtn.addEventListener('click', async () => {
        const name = taskNameInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const timeline = taskTimelineInput.value;

        if (!name || !timeline) {
            displayMessage('Task name and due date are required!');
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, timeline })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add task.');
            }

            taskNameInput.value = '';
            taskDescriptionInput.value = '';
            taskTimelineInput.value = '';
            displayMessage('Task added successfully!', 'success');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
            displayMessage(error.message || 'Error adding task.');
        }
    });

    activeTodoList.addEventListener('click', handleTodoActions);
    completedTodoList.addEventListener('click', handleTodoActions);

    async function handleTodoActions(event) {
        const target = event.target;
        const listItem = target.closest('.todo-item');
        if (!listItem) return;

        const todoId = listItem.dataset.id;

        if (target.classList.contains('toggle-complete-btn')) {
            const isCompleted = listItem.classList.contains('completed');
            try {
                const response = await fetch(`/api/todos/${todoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: !isCompleted })
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = '/login.html';
                        return;
                    }
                    throw new Error('Failed to update task status.');
                }
                displayMessage('Task status updated!', 'success');
                fetchTodos();
            } catch (error) {
                console.error('Error toggling complete:', error);
                displayMessage(error.message || 'Error updating task.');
            }
        } else if (target.classList.contains('delete-todo-btn')) {
            if (!confirm('Are you sure you want to delete this task?')) {
                return;
            }
            try {
                const response = await fetch(`/api/todos/${todoId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = '/login.html';
                        return;
                    }
                    throw new Error('Failed to delete task.');
                }
                displayMessage('Task deleted!', 'success');
                listItem.remove();
            } catch (error) {
                console.error('Error deleting todo:', error);
                displayMessage(error.message || 'Error deleting task.');
            }
        }
    }

    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error);
            displayMessage('Failed to log out.', 'error');
        }
    });

    activeTasksTab.addEventListener('click', () => {
        activeTasksTab.classList.add('active-tab');
        completedTasksTab.classList.remove('active-tab');
        activeTasksContainer.style.display = 'block';
        completedTasksContainer.style.display = 'none';
    });

    completedTasksTab.addEventListener('click', () => {
        completedTasksTab.classList.add('active-tab');
        activeTasksTab.classList.remove('active-tab');
        completedTasksContainer.style.display = 'block';
        activeTasksContainer.style.display = 'none';
    });

    fetchTodos();
});