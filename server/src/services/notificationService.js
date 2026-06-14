import { Notification } from '../models/Notification.js';
import { emitEvent } from '../realtime/socket.js';

export async function createNotification({ userId, type, title, message, metadata = {}, eventName }) {
  const notification = await Notification.create({ userId, type, title, message, metadata });
  if (eventName) {
    emitEvent(eventName, { notification, metadata });
  }
  return notification;
}
