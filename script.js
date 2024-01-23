// Função para exibir tarefas na área do usuário
function displayTasks() {
  var taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Limpar a lista antes de exibir novamente

  var tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks.forEach(function (task) {
    var taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML =
      "<h3>" +
      task.name +
      "</h3><p>Prazo: " +
      task.deadline +
      "</p><p>" +
      task.description +
      "</p><button onclick=\"editTask('" +
      task.name +
      "')\">Editar</button><button onclick=\"deleteTask('" +
      task.name +
      "')\">Excluir</button>";
    taskList.appendChild(taskDiv);
  });
}

// Função para adicionar tarefa
function addTask(name, deadline, description) {
  var tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  tasks.push({ name: name, deadline: deadline, description: description });
  localStorage.setItem(currentUser, JSON.stringify(tasks));
  displayTasks();
}

// Função para editar tarefa
function editTask(taskName) {
  var tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  var taskToEdit = tasks.find(function (task) {
    return task.name === taskName;
  });

  if (taskToEdit) {
    fillEditForm(taskToEdit);
    openModal("editTaskModal");

    // Adicionar evento para o formulário de edição
    document
      .getElementById("editTaskForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        // Atualizar os detalhes da tarefa no array de tarefas
        taskToEdit.name = document.getElementById("editTaskName").value;
        taskToEdit.deadline = document.getElementById("editTaskDeadline").value;
        taskToEdit.description = document.getElementById(
          "editTaskDescription"
        ).value;

        // Atualizar o localStorage
        localStorage.setItem(currentUser, JSON.stringify(tasks));

        // Fechar o formulário de edição
        closeModal("editTaskModal");

        // Atualizar a exibição das tarefas
        displayTasks();
      });
  }
}

// Função para excluir tarefa
function deleteTask(taskName) {
  var tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
  var updatedTasks = tasks.filter(function (task) {
    return task.name !== taskName;
  });
  localStorage.setItem(currentUser, JSON.stringify(updatedTasks));
  displayTasks();
}

// Função para preencher o formulário de edição com os detalhes da tarefa selecionada
function fillEditForm(task) {
  document.getElementById("editTaskName").value = task.name;
  document.getElementById("editTaskDeadline").value = task.deadline;
  document.getElementById("editTaskDescription").value = task.description;
}

// Função para abrir modal
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

// Função para fechar modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Verificar se o usuário está autenticado
var currentUser = null;
var storedUsername = localStorage.getItem("username");
if (storedUsername) {
  currentUser = storedUsername;
  document.getElementById("userWelcome").textContent = currentUser;
  document.getElementById("userArea").style.display = "block";
  displayTasks();
} else {
  openModal("loginModal");
}

// Adicionar eventos para abrir/fechar modais
document.getElementById("logoutBtn").addEventListener("click", function () {
  currentUser = null;
  localStorage.removeItem("username");
  closeModal("editTaskModal"); // Fechar o modal de edição, se estiver aberto
  closeModal("loginModal");
  closeModal("signupModal"); // Fechar o modal de cadastro, se estiver aberto
  document.getElementById("userArea").style.display = "none";
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username && password) {
      localStorage.setItem("username", username);
      currentUser = username;
      document.getElementById("userWelcome").textContent = currentUser;
      closeModal("loginModal");
      document.getElementById("userArea").style.display = "block";
      displayTasks();
    }
  });

document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var newUsername = document.getElementById("newUsername").value;
    var newPassword = document.getElementById("newPassword").value;
    if (newUsername && newPassword) {
      localStorage.setItem("username", newUsername);
      currentUser = newUsername;
      document.getElementById("userWelcome").textContent = currentUser;
      closeModal("signupModal");
      document.getElementById("userArea").style.display = "block";
      displayTasks();
    }
  });

document
  .getElementById("taskForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var taskName = document.getElementById("taskName").value;
    var taskDeadline = document.getElementById("taskDeadline").value;
    var taskDescription = document.getElementById("taskDescription").value;
    if (taskName && taskDeadline && taskDescription) {
      addTask(taskName, taskDeadline, taskDescription);
      // Limpar campos após adicionar tarefa
      document.getElementById("taskName").value = "";
      document.getElementById("taskDeadline").value = "";
      document.getElementById("taskDescription").value = "";
    }
  });
