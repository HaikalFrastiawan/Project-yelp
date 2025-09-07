const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

//models
const Place = require('./models/place')

//connect to db
mongoose.connect('mongodb://127.0.0.1/bestpoint').then(() => {
  console.log('DB Connected')
}).catch(err => {
  console.log(`DB Connection Error: ${err.message}`)
})

//middleware
app.use(express.urlencoded({ extended: true })) // supaya bisa baca req.body\
app.use(methodOverride('_method')) // supaya bisa pakai method PUT dan DELETE


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))





app.get('/', (req, res) => {
     console.log('GET / route accessed')
     res.render('home')
   })

app.get('/places/create', (req, res) => {
    res.render('places/create/create')
})


app.get('/places', async (req, res) => {
    const places = await Place.find()
    res.render('places/index', { places })
})

app.post('/places',  async (req, res)  => {
    const place = new Place(req.body.place)
    await place.save()
    res.redirect('/places/create')  
})  



app.get('/places/:id', async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    res.render('places/show', { place })
})

app.get('/places/:id/edit', async (req, res) => {
  const place = await Place.findById(req.params.id)
  res.render('places/create/edit', { place })
})

app.put('/places/:id', async (req, res) => {

  await Place.findByIdAndUpdate(req.params.id, req.body.place)
  res.redirect('/places')
})

app.delete('/places/:id', async (req, res) => {

  await Place.findByIdAndDelete(req.params.id)
  res.redirect('/places')
})


// app.get('/seed/place', async (req, res) => {
//     const place = new Place({
//         title: 'My house',
//         price: '100',   
//         description: 'My house is the best place to stay',
//         location: 'My street, My city, My country'
//     })
//     await place.save()
//     res.send(place)

// })
  
app.listen(3000, () => {
  console.log(`Example app listening on port http://127.0.0.1:3000`)
})