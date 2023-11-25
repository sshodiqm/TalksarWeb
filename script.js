var DataBos = {};

const firebaseConfig = {
    apiKey: "AIzaSyDpUf-DVIOJlAJBM1w0swL5cJsDLj3Gjs8",
    authDomain: "talk-sar-8aacf.firebaseapp.com",
    projectId: "talk-sar-8aacf",
    storageBucket: "talk-sar-8aacf.appspot.com",
    messagingSenderId: "166172141134",
    appId: "1:166172141134:web:364fc8ae95dd27b3b4c51f"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

//---------------FILLING THE TABLE---------------------//
var stdNo = 0;
var tbody = document.getElementById('tbody1');

function createRow(gambar, judul, deskripsi, docid, respon) {

    var trow = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');

    td1.innerHTML = ++stdNo;
    td2.innerHTML = '';
    var img = document.createElement('img');
    img.src = gambar;
    img.style.maxWidth = '50%';
    td2.appendChild(img);
    td3.innerHTML = judul;
    td4.innerHTML = deskripsi;

    const docRef = db.collection('kritik').doc(docid);
    docRef.get().then((doc) => {
        if (doc.exists && doc.data().respon !== "" && doc.data().respon !== undefined) {
            td5.innerHTML = doc.data().respon;
            var editButton = document.createElement('button');
            editButton.innerHTML = 'Edit Respon';
            editButton.onclick = function () {
                td5.innerHTML = '';
                var input = document.createElement('input');
                input.type = "text";
                input.name = "respon";
                input.placeholder = "Edit Respon";
                input.value = doc.data().respon;

                var saveButton = document.createElement('button');
                saveButton.innerHTML = 'Simpan';
                saveButton.onclick = function () {
                    var responInput = input.value;
                    var kritikRef = db.collection("kritik").doc(docid);
                    kritikRef.update({
                        respon: responInput
                    })
                    .then(function () {
                        alert("Respon berhasil diupdate!");
                        td5.innerHTML = responInput;
                        td5.appendChild(editButton);
                    })
                    .catch(function (error) {
                        console.error("Error mengupdate respon: ", error);
                    });
                };
                td5.appendChild(input);
                td5.appendChild(saveButton);
            };
            td5.appendChild(editButton);
        } else {
            var input = document.createElement('input');
            input.type = "text";
            input.name = "respon";
            input.placeholder = "Masukkan respon disini";
            input.style.display = 'none';

            var button = document.createElement('button');
            button.innerHTML = 'Beri Respon';
            button.onclick = function () {
                input.style.display = 'block';
                button.style.display = 'none';
                submitButton.style.display = 'inline-block';
            };

            var submitButton = document.createElement('button');
            submitButton.innerHTML = 'Kirim';
            submitButton.style.display = 'none';
            submitButton.onclick = function () {
                var responInput = input.value;
                var kritikRef = db.collection("kritik").doc(docid);
                kritikRef.update({
                    respon: responInput
                })
                .then(function() {
                    alert("Respon berhasil disimpan!");
                    td5.innerHTML = responInput;
                    input.style.display = 'none';
                    button.style.display = 'inline-block';
                    submitButton.style.display = 'none';
                })
                .catch(function(error) {
                    console.error("Error menambahkan respon: ", error);
                });
            };

            td5.appendChild(input);
            td5.appendChild(button);
            td5.appendChild(submitButton);
        }
    }).catch((error) => {
        console.log("Error getting dokumen:", error);
    });

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    
    return trow;
}

function renderToView(DocsList) {
    let keys = Object.keys(DocsList);
    stdNo=0;
    tbody.innerHTML="";
    keys.forEach(key => {

        let element = DocsList[key];
        let row = createRow(element.gambar,element.judul,element.deskripsi, key);
        tbody.append(row);
    });

    let unansweredCount = countUnansweredCritiques(DocsList);

    var orangeCircle = document.querySelector('.orange-circle');
    orangeCircle.textContent = unansweredCount;
}

window.onload = GetAllDataRealtime;