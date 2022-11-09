const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const likesInBlog = async (id) => {
  const blog = await Blog.findById(id)
  return blog.likes
}

const passwordHash = async(password) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

module.exports = {
  blogsInDb,
  likesInBlog,
  passwordHash
}