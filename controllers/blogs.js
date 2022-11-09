const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  let decodedToken = ''
  try {
    decodedToken = jwt.verify(`${request.token}`, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  //check title and url
  if (body.title && body.author) {
    if (!body.likes) body.likes = 0

    const blog = new Blog({
      title: body.title,
      author: user.name,
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
  let decodedToken = ''
  try {
    decodedToken = jwt.verify(`${request.token}`, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
    
  console.log('decoded', decodedToken)

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({error: 'This id doesn\'t exist'})
  }

  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

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