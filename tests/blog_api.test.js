const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/blog_api_helper')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Author one',
    url: 'url/one',
    likes: 5,
    user: ''
  },
  {
    title: 'HTML is very easy',
    author: 'Author two',
    url: 'url/two',
    likes: 21,
    user: ''
  }
]

const initialUsers = [
  {
    username: 'admin',
    name: 'admin',
    passwordHash: '',
    blogs: []
  }
]

const userLogin = {
  username: 'admin',
  password: 'admin'
}

let authToken = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const passwordHash = await helper.passwordHash('admin')
  initialUsers[0].passwordHash = passwordHash
  let userObject = new User(initialUsers[0])
  await userObject.save()
  const testUser = await helper.usersInDb()
  initialBlogs[0].user = testUser[0].id.trim() 
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  initialBlogs[1].user = testUser[0].id.trim()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  
  const responseLogin = await api
    .post('/api/login')
    .send(userLogin)
    .expect(200)

  authToken = responseLogin.body.token
}, 100000)

describe('general blog tests', () => {
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
      .auth(authToken, { type: 'bearer' })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain(
      'a very interesting post'
    )
  }, 100000)

  test('a blog without authorization', async () => {
    const newBlog = {
      title: 'a very interesting post',
      author: 'not authorized',
      url: 'url/url',
      likes: 4
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    expect(response.status).toBe(401)
  }, 100000)

  test('likes to zero', async () => {

    const badBlog = {
      title: 'not a good post',
      author: 'not mee',
      url: 'url/anotherurl'
    }

    const response = await api
      .post('/api/blogs')
      .auth(authToken, { type: 'bearer' })
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
      .auth(authToken, { type: 'bearer' })
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
      .auth(authToken, { type: 'bearer' })
      .send(badBlog)
      .expect(400)

    expect(response.status).toBe(400)
  }, 100000)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(authToken, { type: 'bearer' })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      initialBlogs.length - 1
    )

    const title = blogsAtEnd.map(r => r.title)

    expect(title).not.toContain(blogToDelete.title)
  }, 100000)
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
      .auth(authToken, { type: 'bearer' })
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
  }, 100000)
})

describe('users of a blog', () => {
  test('add user with less than 3 char length', async () => {
    const shortUsername = {
      username: 'me',
      name: 'me',
      password: 'admin'
    }

    const response = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    expect(response.body.error).toContain(
      'is shorter than the minimum allowed length'
    )
  }, 100000)
  test('add password with less than 3 char length', async () => {
    const shortPsw = {
      username: 'admin',
      name: 'admin',
      password: 'ad'
    }

    const response = await api
      .post('/api/users')
      .send(shortPsw)
      .expect(400)

    expect(response.body.error).toContain(
      'Password must be at least 3 characters long'
    )
  }, 100000)
  test('user must be unique', async () => {
    const uniqueUser = {
      username: 'admin',
      name: 'admin',
      password: 'admin'
    }

    const response = await api
      .post('/api/users')
      .send(uniqueUser)
      .expect(400)

    expect(response.body.error).toContain(
      'username_1 dup key'
    )
  }, 100000)
})

afterAll(() => {
  mongoose.connection.close()
})