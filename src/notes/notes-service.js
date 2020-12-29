const NotesService = {
    getAllNotes(knex){
        return knex
            .select('*')
            .from('noteful_notes')
    },
    insertNote(knex,note){
        return knex
            .insert(note)
            .into('noteful_notes')
            .returning('*')
            .then(rows=>rows[0])
    },
    getNoteById(knex,id){
        return knex
            .select('*')
            .from('noteful_notes')
            .where({id})
            .first()
    },
    deleteNote(knex,id){
        return knex('noteful_notes')
            .where('id',id)
            .delete()
    },
    updateNote(knex,id,newNoteFields){
        return knex('noteful_notes')
            .where({id})
            .update(newNoteFields)
    }
}

module.exports = NotesService