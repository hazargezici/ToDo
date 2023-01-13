let taskList = [];

if (localStorage.getItem("taskList") !== null) {
  taskList = JSON.parse(localStorage.getItem("taskList"));
}

let editId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

displatTasks("all");

function displatTasks(filter) {
  let ul = document.getElementById("task-list");
  ul.innerHTML = "";

  if (taskList.length == 0) {
    ul.innerHTML = "<p class='p-3 m-0'>Task list is empty</p>";
  } else {
    for (let task of taskList) {
      let completed = task.status == "completed" ? "checked" : "";

      if (filter == task.status || filter == "all") {
        let li = `
                    <li class="task list-group-item">
                        <div class="form-check">
                             <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                             <label for="${task.id}" class="form-check-label ${completed}"> ${task.taskName}</label>
                        </div>
                        <div class="settings">
                            <ul class="d-flex">
                                <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Delete</a></li>
                                <li><a onclick='editTask(${task.id},"${task.taskName}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                        
                            </ul>
                        </div>
                    </li>
                    

                `;
        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document
  .querySelector("#btnAddNewTask")
  .addEventListener("keypress", function() {
    if (event.key == "Enter") {
      document.getElementById("btnAddNewTask").click();
    }
  });

for (let span of filters) {
  span.addEventListener("click", function() {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displatTasks(span.id);
  });
}

function newTask(event) {
  if (taskInput.value == "") {
    alert("Enter a task");
  } else {
    if (!isEditTask) {
      //add
      taskList.push({
        id: taskList.length + 1,
        taskName: taskInput.value,
        status: "pending",
      });
    } else {
      //update
      for (let task of taskList) {
        if (task.id == editId) {
          task.taskName = taskInput.value;
        }
        isEditTask = false;
      }
    }

    taskInput.value = "";
    displatTasks(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }
  event.preventDefault();
}

function deleteTask(id) {
  let deletedId;

  for (let index in taskList) {
    if (taskList[index].id == id) {
      deletedId = index;
    }
  }

  taskList.splice(deletedId, 1);
  displatTasks(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

btnClear.addEventListener("click", function() {
  taskList.splice(0, taskList.length);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  displatTasks("all");
});

function updateStatus(selectedTask) {
  // console.log(selectedTask.parentElement.lastElementChild);
  let label = selectedTask.nextElementSibling;
  let stat;
  if (selectedTask.checked) {
    label.classList.add("checked");
    stat = "completed";
  } else {
    label.classList.remove("checked");
    stat = "pending";
  }

  for (let task of taskList) {
    if (task.id == selectedTask.id) {
      task.status = stat;
    }
  }
  displatTasks(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}
