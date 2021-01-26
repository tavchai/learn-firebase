
let userList = document.querySelector('#userList');
let form = document.querySelector('#addUsers');
function renderUser(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let del = document.createElement('div');
    del.className = 'del';

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    del.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(del);

    userList.appendChild(li);

    // delete user 
    del.addEventListener('click', (e) => {
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('users').doc(id).delete();
    });
}


// add user 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('users').add({
        name: form.name.value,
        city: form.city.value
    });

    form.name.value = '';
    form.city.value = '';
});

// realtime data 
db.collection('users').orderBy('name').onSnapshot(snapshot => {
    const changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') {
            renderUser(change.doc);
        } else if (change.type === 'removed') {
            let li = userList.querySelector(`[data-id=${change.doc.id}]`);
            userList.removeChild(li);
        }
    });
})