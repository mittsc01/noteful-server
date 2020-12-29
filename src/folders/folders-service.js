const FoldersService = {
    getAllFolders(knex){
        return knex.select('*').from('noteful_folders')
    },
    insertFolder(knex,folder){
        return knex.insert(folder)
            .into('noteful_folders')
            .returning('*')
            .then(rows=>rows[0])
    },
    getFolderById(knex,id){
        return knex.select('*').from('noteful_folders')
            .where('id',id)
            .first()
    }

}

module.exports = FoldersService