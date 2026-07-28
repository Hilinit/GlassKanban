let tasks=[
    {
        id: 1,
        title: "Next.js dərs 23",
        desc: "dərs 30-a kimi bax",
        status: "todo",
        priority: "high",
        createdAt: "27 İyul 2026, 13:19"
    },
    {
        id: 2,
        title: "DevJoint Task2 ",
        desc: "part 1 checkpoint göndər.",
        status: "done",
        priority: "medium",
        createdAt: "27 İyul 2026, 14:00"
    },
    {
        id: 3,
        title: "İspan dili",
        desc: "level A1 bitir",
        status: "progress",
        priority: "low",
        createdAt: "28 İyul 2026, 14:00"
    }
]

function renderTasks() {
    const todoCards=document.getElementById('todo-cards')
    const progressCards=document.getElementById('progress-cards')
    const doneCards=document.getElementById('done-cards')

    if (todoCards) todoCards.innerHTML=''
    if (progressCards) progressCards.innerHTML=''
    if (doneCards) doneCards.innerHTML=''

    tasks.forEach(task => {
        const priorityText = task.priority === 'low' ? 'AŞAĞI' : task.priority === 'medium' ? 'ORTA' : 'YÜKSƏK'
        const cardHTML = `
            <article class="card card-${task.priority}" draggable="true" data-id="${task.id}">
                <span class="badge">${priorityText}</span>
                <h3 class="card-title">${task.title}</h3>
                ${task.desc ? `<p class="card-desc">${task.desc}</p>` : ''}
                <div class="card-footer">
                    <span class="card-date">
                        <i class="fa-regular fa-calendar-days"></i> ${task.createdAt || ''}
                    </span>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="editTask(${task.id})" title="Düzəliş et"><i class="fa-solid fa-pen"></i></button>
                        <button class="icon-btn" onclick="deleteTask(${task.id})" title="Sil"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
            </article>
        `;
        if (task.status==='todo' && todoCards) todoCards.innerHTML+=cardHTML;
        else if (task.status==='progress' && progressCards) progressCards.innerHTML+=cardHTML;
        else if (task.status==='done' && doneCards) doneCards.innerHTML+=cardHTML;
    });
    [todoCards, progressCards, doneCards].forEach(container => {
        if (container.children.length===0) container.innerHTML='<div class="empty">Boşdur</div>'
    })
}
renderTasks();