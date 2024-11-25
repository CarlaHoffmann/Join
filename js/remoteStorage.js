
const BASE_URL = 'https://join-156-default-rtdb.europe-west1.firebasedatabase.app/';


async function initialLoadContactsFirebase() {
    let response = await fetch('./js/contacts.json');
    contacts = await response.json();

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        postData('contacts', { name: contact.name, mail: contact.mail, phone: contact.phone, color: contact.color, letters: contact.letters });
    }
    await loadData('contacts');
}


async function initialLoadUsersFirebase() {
    let response = await fetch('./js/users.json');
    users = await response.json();

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        postData('users', { name: user.name, mail: user.mail, password: user.password });
    }
    await loadData('users');
}


async function initialLoadTasksFirebase() {
    let response = await fetch('./js/addTasks.json');
    tasks = await response.json();

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        postData('tasks', { id: task.id, title: task.title, description: task.description, "due date": task["due date"], prio: task.prio, category: task.category, status: task.status, "assigned member": task["assigned member"], subtask: task.subtask });
    }
    await loadData('tasks');
}


async function loadData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    return data = await response.json();
}



async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return resonseToJSON = await response.json();
}



async function editData(path = '', data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'PATCH',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return resonseToJSON = await response.json();
}



async function deleteData(path = '') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "DELETE",
    });
    return responseToJSON = await response.json();
}