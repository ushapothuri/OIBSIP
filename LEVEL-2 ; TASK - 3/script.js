let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addTask");
const pendingContainer = document.getElementById("pendingTasks");
const completedContainer = document.getElementById("completedTasks");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let taskName = taskInput.value.trim();
    if (taskName === "")
        return;

    let newTask = {
        id: Date.now(),
        title: taskName,
        completed: false,
        created:
            new Date().toLocaleString(),
        completedDate: ""
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
}

function renderTasks() {
    pendingContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    if (tasks.length === 0) {
        pendingContainer.innerHTML = `<p class="empty">No pending tasks</p>`;
    }

    tasks.forEach((task, index) => {
        let card = document.createElement("div");
        card.className = "task";
        card.innerHTML = `<h3>${task.title}</h3><p>Created:${task.created}</p>
${task.completed ? `<p>Completed:${task.completedDate}</p>` : ""
            }

<div class="actions">
<button class="complete"
onclick="toggleTask(${index})">
${task.completed ? "Move To Pending" : "Complete"}

</button>
<button class="edit"
onclick="editTask(${index})">
Edit
</button>

<button class="delete"
onclick="deleteTask(${index})">
Delete
</button>
</div>`;

        if (task.completed)
            completedContainer.appendChild(card);
        else
            pendingContainer.appendChild(card);
    });

    updateStats();
}

function toggleTask(index) {
    if (tasks[index].completed) {
        tasks[index].completed = false;
        tasks[index].completedDate = "";
    }
    else {
        tasks[index].completed = true;
        tasks[index].completedDate =
            new Date().toLocaleString();
    }
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    let confirmDelete = confirm("Delete this task?");

    if (confirmDelete) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function editTask(index) {
    let updatedTask = prompt("Edit Task", tasks[index].title);
    if (updatedTask && updatedTask.trim() !== "") {
        tasks[index].title = updatedTask;
        saveTasks();
        renderTasks();
    }
}
function updateStats() {
    document.getElementById("totalCount").innerText = tasks.length;
    document.getElementById("pendingCount").innerText = tasks.filter(task => !task.completed).length;
    document.getElementById("completedCount").innerText = tasks.filter(task => task.completed).length;
}

addButton.onclick = addTask;
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter")
        addTask();
}
);

const themeButton = document.getElementById("themeToggle");

themeButton.onclick = function () {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );
};

if (localStorage.getItem("theme") === "true")
    document.body.classList.add("dark");
renderTasks();