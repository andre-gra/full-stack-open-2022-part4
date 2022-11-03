const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Author one',
    url: 'url/one',
    likes: 5
  },
  {
    title: 'HTML is very easy',
    author: 'Author two',
    url: 'url/two',
    likes: 21
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialBlogs[0])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[1])
  await noteObject.save()
}, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('unique identifier', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.id).toBeDefined
}, 100000)

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'a very interesting post',
    author: 'me',
    url: 'url/url',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(contents).toContain(
    'a very interesting post'
  )
},100000)

test('likes to zero', async () => {
  const badBlog = {
    title: 'not a good post',
    author: 'not mee',
    url: 'url/anotherurl'
  }

  const response = await api
    .post('/api/blogs')
    .send(badBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
},100000)

afterAll(() => {
  mongoose.connection.close()
})