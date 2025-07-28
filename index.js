const express = require('express')
const path = require('path')
const app = express()
const port = 3000

// Serve static files from the "public" directory
app.use(express.static('public'))

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Route for the about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
