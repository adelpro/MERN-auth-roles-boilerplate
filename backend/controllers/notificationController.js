const notification = require('../models/notification');

// @desc Get all notifications
// @Route GET /notes
// @Access Private
const getAllNotifications = async (req, res) => {
  const { id, page, limit } = req.body;
  const filtredNotifications = notification.find({ user: id });
  const total = await filtredNotifications.countDocuments();
  const notifications = await notification
    .find({ user: id })
    .limit(limit)
    .skip(limit * page)
    .lean();
  if (!notifications) {
    return res.status(400).json({ message: 'No notifications found' });
  }

  res.json({ totalpage: Math.ceil(total / limit), notifications });
};

// @desc delete a notification
// @Route DELETE /notifications
// @Private access
const deleteNotification = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }

  const deleteNotification = await notification.findById(id).exec();
  if (!deleteNotification) {
    return res
      .status(400)
      .json({ message: `Can't find a notification with id: ${id}` });
  }
  const result = await deleteNotification.deleteOne();
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the notification with id: ${id}` });
  }
  res.json({ message: `Notification with id: ${id} deleted with success` });
};

// @desc delete All notification
// @Route DELETE /notifications/all
// @Private access
const deleteAllNotifications = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsDeleteMany = await notification.deleteMany({ user: id });
  if (!notificationsDeleteMany) {
    return res
      .status(400)
      .json({ message: 'Error Deleting all notifications as read' });
  }
  res.json({ message: `All notifications for user ${id}marked was deleted` });
};
// @desc Mark One Notification As Read
// @Route Patch /notifications/
// @Access Private
const markOneNotificationasread = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const updateNotification = await notification.find({ id }).exec();
  if (!updateNotification) {
    return res.status(400).json({ message: 'No notifications found' });
  }
  updateNotification.read = false;
  await updateNotification.save();
  res.json(updateNotification);
};
// @desc Mark All Notifications As Read
// @Route Patch /notifications/All
// @Access Private
const markAllNotificationsAsRead = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsUpdateMany = await notification.updateMany(
    { user: id },
    { $set: { read: true } }
  );
  if (!notificationsUpdateMany) {
    return res
      .status(400)
      .json({ message: 'Error Marking all notifications as read' });
  }
  res.json({ message: `All notifications for user ${id}marked as read` });
};
module.exports = {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  markOneNotificationasread,
  markAllNotificationsAsRead,
};
