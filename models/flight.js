import mongoose from "mongoose"

const Schema = mongoose.Schema

const ticketSchema = new Schema({
  seat: {type: String, match: /[A-F][1-9]\d?/},
  price: { type: Number, min: 0, required: true }
}, {
  timestamps: true
})

const flightSchema = new Schema({
  airline: {
    type: String,
    enum: ['American', 'Southwest', 'United', 'PanAm']    
  },

  airport: { 
    type: String, 
    enum: ['AUS', 'DEN', 'LAX', 'SAN', 'ZHR'] 
  },

  flightNo: { 
    type: Number, 
    min: 10, 
    max: 9999,
  },

  departs: {
    type: Date, 
    default: function() {
      let date = new Date()
      date.setFullYear(new Date().getFullYear() + 1)
      return date
    },  
  },

  tickets: [ticketSchema],
  
}, {
  timestamps: true
})

const Flight = mongoose.model('Flight', flightSchema)

export {
  Flight
}