//including libraries
const express = require('express')
const path = require('path')
//for automatic generation id
const {v4} = require('uuid')
const app = express()

//it is our DB :)
let CONTACTS = [ {id:v4(), name: 'Dennis', value: '+358456251186', marked: false} ]

app.use(express.json())

//GET
app.get('/api/contacts', (req, res)=>{
    //this timeout functions was building exclusively for the demonstration how pre-loader is work :)
    setTimeout(() => {
        res.status(200).json(CONTACTS)
    }, 1000)
})

//POST
app.post('/api/contacts', (req, res)=>{
    const contact = {...req.body, id: v4(), marked: false}
    CONTACTS.push(contact)
    res.status(201).json(contact)
})

//DELETE
app.delete('/api/contacts/:id', (req, res)=>{
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
    res.status(200).json({message: 'Contact has been deleted'})
})

//PUT
app.put('/api/contacts/:id', (req, res)=>{
    //find id from array CONTACTS
    const indx = CONTACTS.findIndex(c => c.id === req.params.id)
    //change mark on id
    CONTACTS[indx] = req.body
    res.json(CONTACTS[indx])
})

app.use(express.static(path.join(__dirname, 'client')))

app.get('*', (req, res) => {
    app.sendFile(path.join(__dirname, 'client', 'index.html'))
})
app.listen(3000, ()=>console.log('Server has benn started on port 3000 ... '))