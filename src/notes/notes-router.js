const express = require('express')
const NotesService = require('./notes-service')
const xss = require('xss')
const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
    .route('/')
    .get((req, res, next) => {
        NotesService.getAllNotes(
            req.app.get('db')
        )
            .then(notes => {
                res.json(notes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { note_name, content, folder_id } = req.body
        const newNote = { note_name, folder_id }
        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `missing ${key} in request` }
                })
            }
        }
        newNote.content = content
        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
            .then(note => {
                res
                    .status(201)
                    .location(`/api/notes/${note.id}`)
                    .json(note)
            })
            .catch(next)
    })
notesRouter
    .route('/:noteId')
    .all((req,res,next) => {
        NotesService.getNoteById(
            req.app.get('db'),
            req.params.noteId
        )
            .then(note => {
                if (!note){
                    return res.status(404)
                        .json({error:{message:`note not found`}})
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req,res,next) => {
        res.json({...res.note})
    })
    .delete((req,res,next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.noteId
        )
        .then(() => {
            res.status(204).end()
        })

        .catch(next)
    })
    .patch(jsonParser,(req,res,next) => {
        const {note_name, content, folder_id} = req.body
        const updateNote = {note_name, content, folder_id}
        const numberOfValues = Object.values(updateNote).filter(Boolean).length
        if (numberOfValues === 0){
            return res.status(400)
                .json({
                    error: {message: `request body must cotain at least one of the following: 'note_name', 'content', 'folder_id'`}
                })
        }
        NotesService.updateNote(
            req.app.get('db'),
            req.params.noteId,
            updateNote
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = notesRouter