const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (previousValue, currentValue) => previousValue + currentValue.likes,
    0,
  )
}

const favouriteBlog = (blogs) => {
  const blog = blogs.reduce(
    (prev, cur) => (prev?.likes > cur.likes ? prev : cur),
    null
  )

  delete blog._id && delete blog.url && delete blog.__v
  return blog
}

const mostBlogs = (blogs) => {
  var result = _(blogs)
    .groupBy('author')
    .reduce(
      (prev, cur) => (prev?.length > cur.length ? prev : cur),
      null
    )

  const res =  {
    author: `${result[0].author}`,
    blogs: result.length
  }   

  return res
}

const mostLikes = (blogs) => {
  var result = _(blogs)
    .groupBy('author')
    .reduce(
      (prev, cur) => (_.sumBy(prev, 'likes') > _.sumBy(cur, 'likes') ? prev : cur),
      null
    )

  const res =  {
    author: `${result[0].author}`,
    likes: _.sumBy(result, 'likes')
  }   

  return res
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}