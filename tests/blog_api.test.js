const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialNotes = [
  {
    title: 'HTML is easy',
    authot: 'Author one',
    url: 'url/one',
    likes: 5
  },
  {
    title: 'HTML is very easy',
    authot: 'Author two',
    url: 'url/two',
    likes: 21
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialNotes[0])
  await noteObject.save()
  noteObject = new Blog(initialNotes[1])
  await noteObject.save()
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialNotes.length)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})