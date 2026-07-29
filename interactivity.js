let tasks = JSON.parse(localStorage.getItem('kanban-tasks')) || [
    {
        id: 1,
        title: "Next.js dərs 23",
        desc: "Dərs 30-a kimi bax",
        status: "todo",
        priority: "high",
        createdAt: "27 İyul 2026, 13:19"
    },
    {
        id: 2,
        title: "DevJoint Task2",
        desc: "Part 1 checkpoint göndər.",
        status: "done",
        priority: "medium",
        createdAt: "27 İyul 2026, 14:00"
    },
    {
        id: 3,
        title: "İspan dili",
        desc: "Level A1 bitir",
        status: "progress",
        priority: "low",
        createdAt: "28 İyul 2026, 14:00"
    }
]
function saveTasksToLocalStorage() { localStorage.setItem('kanban-tasks', JSON.stringify(tasks)) }

//******************************************************************************************************************** 
function protectHTML(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}
//********************************************************************************************************************* 
const todoCards = document.getElementById('todo-cards')
const progressCards = document.getElementById('progress-cards')
const doneCards = document.getElementById('done-cards')

const countTodo = document.getElementById('count-todo')
const countProgress = document.getElementById('count-progress')
const countDone = document.getElementById('count-done')

const modalOverlay = document.getElementById('modalOverlay')
const modalHeading = document.getElementById('modalHeading')
const openModalBtn = document.getElementById('openModalBtn')
const closeModalBtn = document.getElementById('closeModalBtn')
const taskForm = document.getElementById('taskForm')

const taskIdInput = document.getElementById('taskId')
const taskTitleInput = document.getElementById('taskTitle')
const taskDescInput = document.getElementById('taskDesc')
const taskStatusInput = document.getElementById('taskStatus')
const taskPriorityInput = document.getElementById('taskPriority')

const searchInput = document.getElementById('searchInput')
const priorityFilter = document.getElementById('priorityFilter')
function renderTasks() {
    todoCards.innerHTML = '';
    progressCards.innerHTML = '';
    doneCards.innerHTML = '';

    let todoCount = 0;
    let progressCount = 0;
    let doneCount = 0;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedPriority = priorityFilter ? priorityFilter.value : 'all';

    const filteredTasks = tasks.filter(task => {
        const Search = task.title.toLowerCase().includes(query) || (task.desc && task.desc.toLowerCase().includes(query));
        const Priority = selectedPriority === 'all' || task.priority === selectedPriority;
        return Search && Priority;
    });

   filteredTasks.forEach(task => {
        const priorityText = task.priority === 'low' ? 'Aşağı' : task.priority === 'medium' ? 'Orta' : 'Yüksək';
        const safeTitle = protectHTML(task.title);
        const safeDesc = protectHTML(task.desc || "");
        const cardHTML = `
            <article class="card card-${task.priority}" draggable="true" data-id="${task.id}">
                <span class="badge">${priorityText}</span>
                <h3 class="card-title">${safeTitle}</h3>
                ${safeDesc ? `<p class="card-desc">${safeDesc}</p>` : ''}
                <div class="card-footer">
                    <span class="card-date">
                        <i class="fa-regular fa-calendar-days"></i> ${task.createdAt || ''}
                    </span>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="editTask(${task.id})" title="Düzəliş et">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="icon-btn" onclick="deleteTask(${task.id})" title="Sil">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </article>
        `
        if (task.status === 'todo' && todoCards) {
            todoCards.innerHTML += cardHTML;
            todoCount++;
        } 
        else if (task.status === 'progress' && progressCards) {
            progressCards.innerHTML += cardHTML;
            progressCount++;
        } 
        else if (task.status === 'done' && doneCards) {
            doneCards.innerHTML += cardHTML;
            doneCount++;
        }
    })
    countTodo.textContent = todoCount;
    countProgress.textContent = progressCount;
    countDone.textContent = doneCount;
    [{ container: todoCards, count: todoCount },
     { container: progressCards, count: progressCount },
     { container: doneCards, count: doneCount }
    ].forEach(item => {
        if (item.container && item.count === 0) item.container.innerHTML = '<div class="empty">Boşdur</div>'
    })
    dragAndDrop()
}

searchInput.addEventListener('input', renderTasks);
priorityFilter.addEventListener('change', renderTasks);

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
}

let editingTaskId = null; // yeni tapşırıq yaradırıq ya mövcud olani reaktə edirik?
function editTask(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if (!taskToEdit) return;
    editingTaskId = id
    modalHeading.textContent = "Tapşırığa Düzəliş Et"

    taskIdInput.value = taskToEdit.id;
    taskTitleInput.value = taskToEdit.title;
    taskDescInput.value = taskToEdit.desc || '';
    taskStatusInput.value = taskToEdit.status;
    taskPriorityInput.value = taskToEdit.priority;
    modalOverlay.classList.add('active')
}
function closeModal() {
    modalOverlay.classList.remove('active');
    taskForm.reset();
    editingTaskId = null
}
openModalBtn.addEventListener('click', () => {
    editingTaskId = null;
    modalHeading.textContent = "Yeni Tapşırıq";
    taskForm.reset();
    modalOverlay.classList.add('active');
    });

closeModalBtn.addEventListener('click', closeModal)
modalOverlay.addEventListener('click', (e) => {if (e.target===modalOverlay) closeModal()})

// ********************************************* Tarix-saat formatlanması ******************************************
function FormatDate() {
    const monthsAz = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"]
    const now = new Date()
    return `${now.getDate()} ${monthsAz[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}
// ******************************************************************************************************************

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title=taskTitleInput.value.trim();
    const desc=taskDescInput.value.trim();
    const status=taskStatusInput.value;
    const priority=taskPriorityInput.value;

    const exists = tasks.some(task =>
        task.id !== editingTaskId &&
        task.title.toLowerCase() === title.toLowerCase()
    )
    if (exists) {
        alert("Bu başlıqda tapşırıq artıq mövcuddur.")
        return
    }

    if (!title) return;
    if (editingTaskId !== null) {
        tasks = tasks.map(task => {
            if (task.id===editingTaskId) {
                return { ...task,title, desc,status,priority}
            } return task
        });
    } else {
        const newId=tasks.length>0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1; // yeni yeni növbəti id yaratmaq üçün massivin içindəki ən böyük id tapıb üzərinə 1 əlavə edirəm
        tasks.push({id:newId,title,desc,status,priority,createdAt:FormatDate()})
    }
    saveTasksToLocalStorage()
    renderTasks()
    closeModal()
    })
function dragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const columns = document.querySelectorAll('.column');
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.dataset.id);
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            columns.forEach(col => col.classList.remove('drag-over'));
        });
    });
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        column.addEventListener('dragleave', () => { column.classList.remove('drag-over')})

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');

            const taskId = Number(e.dataTransfer.getData('text/plain'))
            const targetStatus = column.dataset.status

            if (taskId && targetStatus) {
                const task = tasks.find(t => t.id === taskId)
                if (task && task.status !== targetStatus) {
                    task.status = targetStatus
                    saveTasksToLocalStorage()
                    renderTasks()
                }
            }
        })
    })
}
renderTasks();