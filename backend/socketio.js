module.exports = function (io) {
  const users = []
  io.on('connection', (socket) => {
    socket.on('setUserId', (userId) => {
      users[userId] = socket
    })
    socket.on('getNotifications', (userId) => {
      users[userId].emit('notifications', 'important notification message')
    })
    socket.on('disconnect', (userId) => {
      users[userId] = null
    })
  })
}
