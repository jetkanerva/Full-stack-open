const mongoose = require('mongoose')

if (process.argv.length < 5) {
  console.log('Write the command in the following form: node script.js <password> <name> <phonenumber>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

const url = `mongodb+srv://full-stack:${password}@cluster0.fpqlrce.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name,
  number: phoneNumber
})

person.save().then(result => {
  console.log(`Added ${name} number ${phoneNumber} to phonebook`)
  mongoose.connection.close()
})
