 const PORT = 8000
 const express = require('express')
 const {MongoClient} = require('mongodb')
 const { v4:uuidv4 } = require('uuid')
 const bcrypt = require('bcrypt')
 const jwt = require('jsonwebtoken')
 const cors = require('cors')
 const { restart } = require('nodemon')

 const uri = 'mongodb+srv://dinruser:admin@cluster0.8uknu.mongodb.net/?retryWrites=true&w=majority'

 const app = express()
 app.use(cors())
app.use(express.json())


 app.get('/', (req, res) => {
  res.json('Hello to my app')
 })

 //------------Sign Up---------------------
 //User Post
 app.post('/signup/user', async (req, res) => {
  const client = new MongoClient(uri)
  const {email, password} = req.body
  const generatedUserId = uuidv4()
  console.log(generatedUserId)
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const existingUser = await users.findOne({email})


    if (existingUser) {
      return res.status(409).send('User already exists. Please login')
    }
    const sanitizedEmail = email.toLowerCase()

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword
    }
    const insertedUser = await users.insertOne(data)

    const token = jwt.sign(insertedUser, sanitizedEmail, {expiresIn: 60 * 24,
    })

    res.status(201).json({token, userId: generatedUserId})
  } catch (err) {
      console.log(err)
  } finally {
      await client.close()
  }
 })

//Restaurant Post
 app.post('/signup/restaurant', async (req, res) => {
  const client = new MongoClient(uri)
  const {email, password} = req.body
  const generatedRestaurantId = uuidv4()
  console.log(generatedRestaurantId)
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await client.connect()
    const database = client.db('app-data')
    const restaurants = database.collection('restaurants')

    const existingRestaurant = await restaurants.findOne({email})


    if (existingRestaurant) {
      return res.status(409).send('Restaurant already exists. Please login')
    }
    const sanitizedEmail = email.toLowerCase()

    const data = {
      restaurant_id: generatedRestaurantId,
      email: sanitizedEmail,
      hashed_password: hashedPassword
    }
    const insertedRestaurant = await restaurants.insertOne(data)

    const token = jwt.sign(insertedRestaurant, sanitizedEmail, {expiresIn: 60 * 24,
    })

    res.status(201).json({token, restaurantId: generatedRestaurantId})
  } catch (err) {
      console.log(err)
  } finally {
      await client.close()
  }
 })

app.get('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const userId = req.query.userId

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = {user_id: userId}
    const user = await users.findOne(query)
    res.send(user)
  } finally {
    await client.close()
  }
})

//Get All Users
app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    
    const returnedUsers = await users.find().toArray()
    res.send(returnedUsers)
  } finally {
    await client.close()
  }
})

//Get All Restaurants
app.get('/rests', async (req, res) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const restaurants = database.collection('restaurants')

    const returnedRestaurants = await restaurants.find().toArray()
    res.send(returnedRestaurants)
  } finally {
    await client.close()
  }
})

//Update Users
app.put('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const personFormData = req.body.personFormData

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const query = {user_id: personFormData.user_id}
    const updateDocument = {
      $set: {
      first_name: personFormData.first_name,
      dob_month: personFormData.dob_month,
      dob_day: personFormData.dob_day,
      dob_year: personFormData.dob_year,
      profile_photo: personFormData.profile_photo,
      zipcode: personFormData.zipcode,
      matches: personFormData.matches
      },
    }
    const insertedUser = await users.updateOne(query, updateDocument)
    res.send(insertedUser)
  } finally {
    await client.close()
  }
})

//Update Restaurants
app.put('/rest', async (req, res) => {
  const client = new MongoClient(uri)
  const restaurantFormData = req.body.restaurantFormData

  try {
    await client.connect()
    const database = client.db('app-data')
    const restaurants = database.collection('restaurants')
    const query = {rest_id: restaurantFormData.rest_id}
    const updateDocument = {
      $set: {
      rest_name: restaurantFormData.rest_name,
      rest_logo: restaurantFormData.rest_logo,
      rest_photo1: restaurantFormData.rest_photo1,
      rest_description: restaurantFormData.rest_description,
      rest_url: restaurantFormData.rest_url,
      rest_phone: restaurantFormData.rest_phone,
      food_type: restaurantFormData.type_of_food,
      rest_street: restaurantFormData.rest_street,
      rest_apt: restaurantFormData.rest_apt,
      rest_city: restaurantFormData.rest_city,
      rest_state: restaurantFormData.rest_state,
      rest_zipcode: restaurantFormData.rest_zipcode,
      matches: restaurantFormData.matches
      },
    }
    const insertedRestaurant = await restaurants.updateOne(query, updateDocument)
    res.send(insertedRestaurant)
  } finally {
    await client.close()
  }
})


 //-------
 app.get('/onboarding', (req, res) => {
  res.json('/onboarding')
 })

 app.get('/dashboard', (req, res) => {
  res.json('/dashboard')
 })



 app.listen(PORT, () => console.log("Server running on PORT " + PORT))