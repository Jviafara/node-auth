import DBLocal from 'db-local'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { hasSubscribers } from 'node:diagnostics_channel'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
})

export class userRepository {
  static async create({ username, password }) {
    // Validaciones
    Validation.username(username)
    Validation.password(password)

    // Asegurar username unico
    const user = User.findOne({ username })
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)

    User.create({ _id: id, username, password: hashedPassword }).save()

    return id
  }

  static async login({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('username does not exist')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password or username are incorrect')

    const { password: _, ...publicUser } = user
    return publicUser
  }
}

class Validation {
  static username(username) {
    if (typeof username !== 'string')
      throw new Error('username must be a string')
    if (username.length < 3)
      throw new Error('username must be at least 3 characters')
  }

  static password(password) {
    if (typeof password !== 'string')
      throw new Error('password must be a string')
    if (password.length < 6)
      throw new Error('username must be at least 3 characters')
  }
}
