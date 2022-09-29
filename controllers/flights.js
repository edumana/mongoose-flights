import { Flight } from '../models/flight.js'
import { Meal } from "../models/meal.js"


function create(req, res) {
  if (req.body.departs === '') delete req.body.departs
  Flight.create(req.body)
  .then(flight => {
    res.redirect('/flights')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
}

function newFlight(req, res) {
  res.render('flights/new', {
    title: "Add Flight",
  })
}

function deleteFlight(req, res) {
  Flight.findByIdAndDelete(req.params.id)
  .then(flight => {
    res.redirect('/flights')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function deleteTicket(req, res) {
  Flight.findByIdAndUpdate(req.params.id, {
    $pull: { tickets: { _id: req.params.ticketId } },
    new: true , useFindAndModify: false})
    .catch(err => {
    console.log(err)
    res.redirect('/')
  })
  res.redirect(`/flights/${req.params.id}`)
}

function index(req, res) {
  Flight.find({})
  .then(flights => {
    res.render('flights/index', {
      flights: flights,
      title: 'All Flights'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights/new')
  })
}

function show(req, res) {
  Flight.findById(req.params.id)
  .populate('meals')
  .then(flight => {
    Meal.find({_id: {$nin: flight.meals}})
    .then(meals => {
      res.render('flights/show', {
        title: 'Flight Detail',
        flight,
        meals,
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  })
}

function edit(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    res.render("flights/edit", {
      flight, 
      title: "Edit Flight"
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function addToFlight(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.meals.push(req.body.mealId)
    flight.save()
    .then(() => {
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

function update(req, res) {
  if (req.body.departs === '') delete req.body.departs
  Flight.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then(flight => {
    res.redirect(`/flights/${flight.id}`)
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function createTicket(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.tickets.push(req.body)
    flight.save()
    .then(() => {
      res.redirect(`/flights/${flight._id}`)
    })
    })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
  }

export {
  newFlight as new,
  index,
  create,
  deleteFlight as delete,
  show,
  edit,
  update,
  createTicket,
  deleteTicket,
  addToFlight,
}