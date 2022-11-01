const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('favorite blogs', () => {
  const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5b422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful two',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '5c422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful three',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 15,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('if there are many top favorites, it is enough to return one of them', () => {
    const result = listHelper.favouriteBlog(listWithBlogs)
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful three',
        author: 'Edsger W. Dijkstra',
        likes: 15
      }
    )
  })
})

describe('most blogs', () => {
  const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5b422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful two',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '5c422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful three',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 15,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('if there are many top authors, it is enough to return one of them', () => {
    const result = listHelper.mostBlogs(listWithBlogs)
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 5
      }
    )
  })
})

describe('most blogs', () => {
  const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5b422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful two',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '5c422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful three',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 15,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 4,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 1,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Pinco',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 15,
      __v: 0
    },
    {
      _id: '5d422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful four',
      author: 'Robert C. Martin',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('if there are many top bloggers, it is enough to return one of them', () => {
    const result = listHelper.mostLikes(listWithBlogs)
    expect(result).toEqual(
      {
        author: 'Robert C. Martin',
        likes: 28
      }
    )
  })
})