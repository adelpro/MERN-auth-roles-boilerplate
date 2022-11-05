const note = require('../models/note')
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// @Route GET /notes
// @Access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await note.find().lean()
    if (!notes) {
        return res.status(400).json({ message: 'No Notes found' })
    }
    res.json(notes)
})

// @desc Create new note
// @Route POST /notes
// @Access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body
    //Confirm data
    if (!user.match(/^[0-9a-fA-F]{24}$/) || !title || !text) {
        return res
            .status(400)
            .json({ message: 'Verify your data and proceed again' })
    }
    //create new note
    const newNote = await note.create({
        user,
        title,
        text,
    })
    if (newNote) {
        res.json({
            message: `New note with title: ${title} created with success`,
        })
    } else {
        res.status(400).json({
            message:
                'Note creation failed, please verify your data and try again',
        })
    }
})

// @desc Get a note by id
// @Route PATCH /notes/one
// @Access Private
const getOneNote = asyncHandler(async (req, res) => {
    const { id } = req.body
    console.log(req.body)
    //Confirm data

    if (!id) {
        return res
            .status(400)
            .json({ message: 'Verify your data and proceed again r35475' })
    }
    // Check if the note exist
    const oneNote = await note.findById(id).lean()
    if (!oneNote) {
        return res
            .status(400)
            .json({ message: `Can't find a note with this id: ${id}` })
    }
    res.json(oneNote)
})

// @desc Update a note
// @Route PATCH /notes
// @Access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, title, text, completed } = req.body
    //Confirm data
    console.log(req.body)
    if (
        !id ||
        !title ||
        !text ||
        text.length < 10 ||
        typeof completed !== 'boolean'
    ) {
        return res
            .status(400)
            .json({ message: 'Verify your data and proceed again' })
    }
    // Check if the note exist
    const updateNote = await note.findById(id).exec()
    if (!updateNote) {
        return res
            .status(400)
            .json({ message: `Can't find a note with this id: ${id}` })
    }
    updateNote.title = title
    updateNote.text = text
    updateNote.completed = completed
    await updateNote.save()
    res.json({ message: `Note with title: ${title} updated with success` })
})

// @desc delete a note
// @Route DELETE /notes
// @Private access
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res
            .status(400)
            .json({ message: `You must give a valid id: ${id}` })
    }

    const deleteNote = await note.findById(id).exec()
    if (!deleteNote) {
        return res
            .status(400)
            .json({ message: `Can't find a note with id: ${id}` })
    }
    const result = await deleteNote.deleteOne()
    if (!result) {
        return res
            .status(400)
            .json({ message: `Can't delete the note with id: ${id}` })
    }
    res.json({ message: `Note with id: ${id} deleted with success` })
})
module.exports = {
    createNewNote,
    updateNote,
    getAllNotes,
    getOneNote,
    deleteNote,
}
