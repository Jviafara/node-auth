import express from 'express'
import { PORT } from './config.js'
import { userRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json())

app.get('/', (req, res) => {
  res.render('example', { username: 'jovialet2' })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await userRepository.login({ username, password })
    res.send(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await userRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/loguot', (req, res) => {})

app.get('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`)
})
