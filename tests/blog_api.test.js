const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/blog_api_helper')

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
}, 100000)

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
}, 100000)

test('missed title', async () => {
  const badBlog = {
    author: 'not mee',
    url: 'url/anotherurl',
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .send(badBlog)
    .expect(400)

  expect(response.status).toBe(400)
}, 100000)

test('missed author', async () => {
  const badBlog = {
    title: 'Who',
    url: 'url/anotherurl',
    likes: 5
  }

  const response = await api
    .post('/api/blogs')
    .send(badBlog)
    .expect(400)

  expect(response.status).toBe(400)
}, 100000)

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.blogsInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/blogs/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.blogsInDb()

    expect(notesAtEnd).toHaveLength(
      initialBlogs.length - 1
    )

    const title = notesAtEnd.map(r => r.title)

    expect(title).not.toContain(noteToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})