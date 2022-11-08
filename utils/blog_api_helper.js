const Blog = require('../models/blog')

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const likesInBlog = async (id) => {
  const blog = await Blog.findById(id)
  return blog.likes
}

module.exports = {
  blogsInDb,
  likesInBlog
}