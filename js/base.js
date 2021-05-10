var AUTO_INCREMENT = 0;
var notes = [];
var editionMode = false;
var specialEdition = false;
var idEdition = null;
var idSpecial = null;

const printingYear = () => {
    let yearfooter = $('#year');
    let date = new Date();
    let year = date.getFullYear();
    yearfooter.append(year);
}

const saveStorageNote = (object) => {
    let id = object.parentElement.parentElement.children[0].value, i = 0;
    let storage = new storageCtrl();
    let name = 'storage-', number = 0;
    console.log('Comenzando...');

    while(i<1000){
        if(!storage.keyExists(name+i)){
            number = i;
            break;
        }
        i++;
    }
    let id_data = name+number;
    let title = notes[id].title;
    let description = notes[id].description;
    let data = {id:id_data, title: title, description: description};

    storage.set(id_data,data,1);
    notes.splice(id, 1);
    print();
    localStoragePrint();

}

const eliminateStorageNote = (object) => {
    let id = object.parentElement.parentElement.children[0].value;
    let storage = new storageCtrl();
    storage.delete(id);
    localStoragePrint();
}

const modifyStorageNote = (object) => {
    if (specialEdition) {
        changingBTN_edition();
        localStoragePrint();
        specialEdition = false;
    } else {
        idSpecial = object.parentElement.parentElement.children[0].value;
        changingBTN_edition();
        specialEdition = true;
        return true;
    }
}

const changingBTN_edition = () => {
    let canvas = $('#principal-btn');

    if (!specialEdition) {
        let storage = new storageCtrl();
        let item = storage.get(idSpecial, 1);
        let title = $('#title');
        let description = $('#description');
        let modTitle = item.title;
        let modDescription = item.description;
        title.val(modTitle);
        description.val(modDescription);
        canvas.attr('class', 'btn btn-warning btn-block');
        canvas[0].innerHTML = 'Modificar nota';
        return true;

    } else {
        canvas.attr('class', 'btn btn-danger btn-block');
        canvas[0].innerHTML = 'Agregar nota';
        reset();
        return true;
    }
}



const localStoragePrint = () => {
    let canvas = $('#notes_storage');
    // let nota_prueba = {id:'storage-1',title:'Título de storage', description: 'Descripción'};
    // localStorage.setItem('storage-1', JSON.stringify(nota_prueba));
    let storage = new storageCtrl();
    let data = storage.getAllStorage(1);
    let template = '';

    data.forEach(element => {
        template += `
        <div class="row border border-primary rounded bg-white mt-3 mb-3">
            <div class="col-11">
                <span class="m-2"><b>${element.title}</b></span>
                <hr>
                <span class="m-2">${element.description}</span>
            </div>

            <div class="col text-center">
                <input type="hidden" value="${element.id}">
                <div class="row justify-content-center">                    
                    <button class="m-1 btn btn-danger" onclick="eliminateStorageNote(this)">
                        &#10060;
                    </button>
                 </div>
                <div class="row justify-content-center">                    
                    <button class="m-1 btn btn-warning" onclick="modifyStorageNote(this)">                    
                        &#9999;
                    </button>
                </div> 
            </div>   
        </div>        
        `;

        canvas.html(template);
        return true;
    });

}

$(document).ready(function () {
    printingYear();
    localStoragePrint();
});

const reset = () => {
    $('#title').val('');
    $('#description').val('');
    return true;
}

const saveNotes = (id, title, description) => {
    notes[id] = {
        id: id,
        title: title,
        description: description
    }

    return notes[id];
}

const print = () => {
    let canvas = $('#notes');
    let template = '';

    notes.forEach(element => {
        template += `
        <div class="row border border-primary rounded bg-white mt-3 mb-3">
            <div class="col-11">
                <span class="m-2"><b>${element.title}</b></span>
                <hr>
                <span class="m-2">${element.description}</span>
            </div>

            <div class="col text-center">
                <input type="hidden" value="${element.id}">
                <div class="row justify-content-center">                    
                    <button class="m-1 btn btn-danger" onclick="eliminateNote(this)">
                        &#10060;
                    </button>
                </div>
                <div class="row justify-content-center">                    
                    <button class="m-1 btn btn-warning" onclick="modifyNote(this)">                    
                        &#9999;
                    </button>
                </div> 
                <div class="row justify-content-center">                    
                    <button class="m-1 btn btn-primary" onclick="saveStorageNote(this)">                    
                        &#128190;
                    </button>
                </div> 
            </div>   
        </div>        
        
        `;
    });

    canvas.html(template);

    return true;

}


const eliminateNote = (object) => {
    let id = object.parentElement.parentElement.children[0].value;
    notes.splice(id, 1);
    print();
}

const modifyNote = (object = false) => {
    if (editionMode) {
        changingBTN();
        print();
        editionMode = false;
    } else {
        idEdition = object.parentElement.parentElement.children[0].value;
        changingBTN();
        editionMode = true;
        return true;
    }

}

const changingBTN = () => {
    let canvas = $('#principal-btn');
    if (!editionMode) {
        let title = $('#title');
        let description = $('#description');
        let modTitle = notes[idEdition].title;
        let modDescription = notes[idEdition].description;
        title.val(modTitle);
        description.val(modDescription);
        canvas.attr('class', 'btn btn-warning btn-block');
        canvas[0].innerHTML = 'Modificar nota';
        return true;

    } else {
        canvas.attr('class', 'btn btn-danger btn-block');
        canvas[0].innerHTML = 'Agregar nota';
        reset();
        return true;
    }
}

$('#note-submit').on('submit', (e) => {
    e.preventDefault();
    let title = $('#title');
    let description = $('#description');

    if (specialEdition) {
        let storage = new storageCtrl();
        storage.delete(idSpecial);
        let data = { id: idSpecial, title: title.val(), description: description.val() };
        storage.set(idSpecial, data, 1);
        modifyStorageNote();
        return true;
    }

    if (editionMode) {
        notes[idEdition].title = title.val();
        notes[idEdition].description = description.val();
        modifyNote();
    } else {
        let id = AUTO_INCREMENT;

        saveNotes(id, title.val(), description.val());
        reset();
        print();

        AUTO_INCREMENT++;
    }
});