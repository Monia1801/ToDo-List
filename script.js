const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme;
}

document.getElementById("standard-theme").addEventListener("click", function() {
    body.className = "standard-theme";
    localStorage.setItem('theme', 'standard-theme');
});

document.getElementById("light-theme").addEventListener("click", function() {
    body.className = "light-theme";
    localStorage.setItem('theme', 'light-theme');
});

document.getElementById("dark-theme").addEventListener("click", function() {
    body.className = "dark-theme";
    localStorage.setItem('theme', 'dark-theme');
});

function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    hours = String(hours).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    document.getElementById('date').textContent = `${formattedDate}`;
    document.getElementById('time').textContent =`${formattedTime}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

const form = document.querySelector("form");
const userInput = document.querySelector(".user-input");
const taskList = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-template");

window.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const taskText = userInput.value.trim();
    if (taskText === "") return;

    addTask(taskText, false); 
    saveTasks();

    userInput.value = "";
});

taskList.addEventListener("click", function(e) {

    if (e.target.closest(".check-btn")) {
        const task = e.target.closest(".task");
        const span = task.querySelector("span");
        span.style.textDecoration =
            span.style.textDecoration === "line-through" ? "none" : "line-through";

        saveTasks();
    }

    if (e.target.closest(".delete-btn")) {
        const task = e.target.closest(".task");
        task.remove();

        if (taskList.children.length === 0) {
            taskList.style.display = "none";
        }

        saveTasks();
    }
});

function addTask(text, completed) {
    taskList.style.display = "flex";

    const newTask = taskTemplate.content.cloneNode(true);
    const span = newTask.querySelector("span");
    span.textContent = text;

    if (completed) {
        span.style.textDecoration = "line-through";
    }

    taskList.appendChild(newTask);
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll(".task").forEach(task => {
        const text = task.querySelector("span").textContent;
        const completed = task.querySelector("span").style.textDecoration === "line-through";
        tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (!saved) return;

    const tasks = JSON.parse(saved);
    if (tasks.length > 0) {
        taskList.style.display = "flex";
    }

    tasks.forEach(t => addTask(t.text, t.completed));
}
