const electron = require('electron');
window.$ = window.jQuery = require(__dirname + '/assets/libs/jquery/jquery.min.js')
let justAddedNote = false;
const fs = require('fs');
let files;

const JsonFile = require(__dirname + '/services/JsonFile');
const NoteService = require(__dirname + '/services/NoteService');
let noteService = new NoteService(new JsonFile('note.json'),'tab1');

$(() => {
    noteService.list('tab1').then((res) => {
            constructData(res);
        }
    )

    // Add note
    $('#addNote').click(() => {
        noteService.create({},'tab1').then((res) => {
            noteService.list('tab1').then((res) => {
                    constructData(res);
                }
            )
        })
        justAddedNote = true;
    })

})

let constructData = (data) => {
    $('#notes div.active').remove();
    data.forEach(element => {
        let noteTemplate = $('#noteTemplate').clone();
        noteTemplate.contents().find('form').parent('div').attr('class', 'active');
        noteTemplate.contents().find('textarea').html(element.content);
        noteTemplate.contents().find('form').attr('action', `${element.id}`);
        noteTemplate.contents().find('img').attr('src',__dirname + '/assets/images/' + element.image)

        if (!window.matchMedia("(min-width: 800px)").matches) {
            $('section#notes div.column:eq(0)').append(noteTemplate.html());
        } else {
            if (element.id % 4 == 0) {
                $('section#notes div.column:eq(0)').append(noteTemplate.html());
            } else if (element.id % 4 == 1) {
                $('section#notes div.column:eq(1)').append(noteTemplate.html());
            } else if (element.id % 4 == 2) {
                $('section#notes div.column:eq(2)').append(noteTemplate.html());
            } else if (element.id % 4 == 3) {
                $('section#notes div.column:eq(3)').append(noteTemplate.html());
            }
        }
    });

    if (justAddedNote == true) {
        let j = 0;
            while ($(`#notes div div form[action="${j}"]`).length != 0) {
                j++
            }
            j--;
            console.log(j);
        $(`#notes div div form[action="${j}"] textarea`).focus()
        justAddedNote = false;
    }

    // When lost focus on indiviual note, save to jsonfile
    $('textarea').blur((e) => {
        let curel = $(e.currentTarget);
        noteService.update(curel.parent('form').attr('action'),curel.val(),'tab1').then((res) => {
            noteService.list('tab1').then((res) => {
                    constructData(res);
                }
            )
        })
    })

    // Adjust note height according to sentence length
    $('textarea').keyup((e) => {
        $(e.target).css('height', 'auto');
        $(e.target).css('height', ($(e.target)[0].scrollHeight) + "px");
    })

    // Close note when pressed X
    $('#notes i').click((e) => {
        let curel = $(e.currentTarget);
        noteService.delete(curel.parent('div').children('form').attr('action'),'tab1').then((res) => {
            noteService.list('tab1').then((res) => {
                    constructData(res);
                }
            )
        })
    })

    ResizeNotes()
}


// Resize note according to window resize
let ResizeNotes = () => {

    $('textarea').each(function () {
        // Reseting height to default first!!!
        this.setAttribute('style', 'height:inherit');
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
      }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
}

// Detect window resize
window.addEventListener('resize', function(e){
    ResizeNotes();
})

