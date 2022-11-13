const user = require('./models/user')

module.exports = function (io) {
  let users = []

  io.on('connection', (socket) => {
    socket.on(
      'setUserId',
      async (userId) => {
        if (userId) {
          const oneUser = await user.findById(userId).lean().exec()
          if (oneUser) {
            users[userId] = socket
            console.log(`🔗 user with id ${userId} connected to socket`)
          }
        }
      }
    )

    socket.on('getNotifications', (userId) => {
      users[userId]?.emit('notifications', 'important notification message')
    })
    socket.on('disconnect', (userId) => {
      console.log(`user with id ${userId} disconnected from socket`)
      users[userId] = null
    })
  })
}
