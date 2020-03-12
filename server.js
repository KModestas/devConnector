const express = require('express')
const connectDB = require('./config/db')

const app = express()
// connect to DB
connectDB()

// Middleware
// app.use() is middleware that runs for ALL requests
// parse req.body requests => extended false does not allow nested objects
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API RUNNING'))

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
