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
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      initialBlogs.length - 1
    )

    const title = blogsAtEnd.map(r => r.title)

    expect(title).not.toContain(blogToDelete.title)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 204 and with new number of likes', async () => {
    const blogWithLikes = {
      title: 'a blog with some likes',
      author: 'me',
      url: 'url/url',
      likes: 4,
    }

    await api
      .post('/api/blogs')
      .send(blogWithLikes)
      .expect(201)

    const blogs = await helper.blogsInDb()
    const likes = blogs.map(r => r.likes)
    const ids = blogs.map(r => r.id)
    const initialLikes = likes[likes.length - 1]
    expect(initialLikes).toBe(4)
    const id = ids[ids.length - 1]

    const blogWithOtherLikes = {
      likes: 24,
    }

    await api
      .put(`/api/blogs/${id}`)
      .send(blogWithOtherLikes)
      .expect(201)

    const newLikes = await helper.likesInBlog(id)   

    expect(newLikes).toBe(24)
  },100000)
})

afterAll(() => {
  mongoose.connection.close()
})