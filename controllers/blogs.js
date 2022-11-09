const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // add user
  const users = await User.find({})
  const user = users[0]

  //check title and url
  if (body.title && body.author) {
    if (!body.likes) body.likes = 0

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } else {
    response.status(400).json({ error: 'Bad request' })
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    _id: request.params.id,
    likes: body.likes
  })

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(201).json('Update completed')
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter