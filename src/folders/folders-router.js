const express = require('express')
const FoldersService = require('./folders-service')
const xss = require('xss')
const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter
    .route('/')
    .get((req,res,next) =>{
        
        FoldersService.getAllFolders(
            req.app.get('db')
        )
            .then(
                folders => {
                    res.json(folders)
                }
            )
            .catch(next)
    })
    .post(jsonParser,(req,res,next) => {
        const {folder_name} = req.body
        const newFolder = {folder_name}
        if (!folder_name){
            return res.status(400).json({
                error: {message: 'Missing folder name in request.'}
            })
        }
        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(
                f => {
                    res
                        .status(201)
                        .location(`/api/folders/${f.id}`)
                        .json(f)
                }
            )
            .catch(next)
    })

foldersRouter
    .route('/:folderId')
    .get((req,res,next) => {
        FoldersService.getFolderById(
            req.app.get('db'),
            req.params.folderId
        )
        .then(folder=>{

            if (!folder){
                return res.status(404).json({
                    error: {
                        message: `folder doesn't exist`
                    }
                })
            }
            res.json(folder)
        })
        .catch(next)
    })

module.exports = foldersRouter