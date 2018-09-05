var noteSchema = require('../models/noteSchema');
var _ = require('underscore');
function fetchNotes(email) {

    return new Promise((resolve, reject) => {
        if (mongoClient) {
            var noteModel = mongoClient.model('note', noteSchema);

            noteModel.find({ owner: email }, (err, result) => {

                if (err) {
                    console.log('error in fetching notes');
                    console.log(err);
                    reject(err);
                }
                else if (result) {
                    // console.log('fetch notes are ');
                    // console.log(result);
                    resolve(result);
                }
                else {
                    resolve([]);
                }


            });
        }
        else {
            console.log('mongoclient is empty');
            reject(new Error('Mongoclient is empty'));

        }
    })

}

function saveNote(noteObj) {

    return new Promise((resolve, reject) => {
        if (mongoClient) {
            var noteModel = mongoClient.model('note', noteSchema);


            console.log(noteObj["_id"]);
            if (noteObj._id !== '') {
                //noteObj = _.omit(noteObj,"_id");
                var note = new noteModel(noteObj);
                noteModel.updateOne({ _id: noteObj._id }, note, (err, result) => {
                    if (err) {
                        console.log('error in saving note ' + err);
                        reject(err);
                    }
                    else {
                        console.log('note updated successfully');
                        resolve(result);
                    }

                });
            }
            else {
                noteObj = _.omit(noteObj, "_id");
                var note = new noteModel(noteObj);
                note.save((err, result) => {
                    if (err) {
                        console.log('error in saving note ' + err);
                        reject(err);
                    }
                    else {
                        console.log('note saved successfully');
                        resolve(result);
                    }

                })
            }

        }
        else {
            console.log('mongoclient is empty');
            reject(new Error('Mongoclient is empty'));
        }
    });



}

function fetchNote(id) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            var noteModel = mongoClient.model('note', noteSchema);
            noteModel.findById(id, (err, result) => {
                if (err) {
                    console.log('error in 1 fetch');
                    console.log(err);
                    reject(err);
                }

                //console.log(result);
                resolve(result);
            });
        }
        else {
            console.log('mongoclient is empty');
            reject(new Error('Mongoclient is empty'));
        }
    });
}

function deleteNote(id) {
    return new Promise((resolve, reject) => {
        if (mongoClient) {
            var noteModel = mongoClient.model('note', noteSchema);
            noteModel.deleteOne({ _id: id }, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
            });
        }
        else {
            console.log('mongoclient is empty');
            reject(new Error('Mongoclient is empty'));
        }
    });
}

module.exports = {
    fetchNotes,
    saveNote,
    fetchNote,
    deleteNote
}