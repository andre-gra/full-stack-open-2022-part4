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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}