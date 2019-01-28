const fs = require('fs');
let files;

class NoteService {

    constructor(jsonFile) {
        this.jsonFile = jsonFile;
    }

    create(note,tab) {
        return this.jsonFile.write((data) => {

            let maxId = data.notes[tab].reduce((maxId, noteItem) => {
                if (maxId > noteItem.id) {
                    return maxId;
                } else {
                    return noteItem.id;
                }
            }, 0) + 1;

            note.id = maxId;
            files = fs.readdirSync(__dirname + '/../assets/images/');
            note.image = __dirname + '/assets/images/' + files[Math.floor(files.length*Math.random())];
            data.notes[tab].push(note);
            return {
                id: note.id,
                data: data
            }
        })
    }

    delete(noteId,tab){
        return this.jsonFile.write((data)=>{
            data.notes[tab].splice(noteId,1);
            data.notes[tab].map((e)=>{
                if (e.id > noteId) {
                    e.id --;
                }
            })
            return {
                id: this.nextId - 1,
                data: data
            }
        })
    }

    list(tab){
        return this.jsonFile.read(async (data)=>{
            for (let i in data.notes[tab]) {
                // Check if individual note has an image address
                if (data.notes[tab][i].image == undefined ) {
                    files = fs.readdirSync(__dirname + '/../assets/images/');
                    data.notes[tab][i].image = files[Math.floor(files.length*Math.random())];
                    let dataId = data.notes[tab][i].id;
                    let dataImage = data.notes[tab][i].image;
                    await this.jsonFile.write((data)=>{
                        data.notes[tab][dataId].image = dataImage;
                        return {
                            data: data
                        };
                    })
                // Check if the image address is still valid
                } else if (!fs.existsSync(__dirname + '/../assets/images/' + data.notes[tab][i].image)) {
                    console.log('invalid images address')
                    files = fs.readdirSync(__dirname + '/../assets/images/');
                    data.notes[tab][i].image = files[Math.floor(files.length*Math.random())];
                    let dataId = data.notes[tab][i].id;
                    let dataImage = data.notes[tab][i].image;
                    await this.jsonFile.write((data)=>{
                        data.notes[tab][dataId].image = dataImage;
                        return {
                            data: data
                        };
                    })
                }
            }


            return data.notes[tab];
        })
    }

    update(noteId,input,tab){
        return this.jsonFile.write((data)=>{
            data.notes[tab][noteId].content = input;
            return {
                data: data
            };
        })
    }

}

module.exports = NoteService;

// let noteService = new NoteService(new JsonFile('note.json'));

// test add note
// noteService.create(
//     {
//         "id": 0,
//         "content": 'Hello'
//     });


// test delete note
// noteService.delete(2);

// test list note
// noteService.list('tab1').then((res)=>{
//     console.log(res);
//     }
// )

//test update
// noteService.update(2,'Hello');



