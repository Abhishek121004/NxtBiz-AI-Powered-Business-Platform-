let ioInstance;

export function registerSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.emit('connected', { service: 'NxtBiz realtime' });
  });
}

export function emitEvent(eventName, payload) {
  if (ioInstance) {
    ioInstance.emit(eventName, payload);
  }
}
