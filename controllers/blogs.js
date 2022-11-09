const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  
  const blog = await Blog.findById(request.params.id)

  const user = request.user

  if (!blog) {
    return response.status(400).json({error: 'This id doesn\'t exist'})
  }

  if (blog.user.toString() !== user._id.toString()) {
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