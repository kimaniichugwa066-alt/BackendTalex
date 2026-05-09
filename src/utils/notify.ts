let ioInstance: any = null;

export const initializeIO = (io: any) => {
  ioInstance = io;

  io.on('connection', (socket: any) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
    });
  });
};

export const getIO = (): any => {
  return ioInstance;
};

export const sendNotification = (userId: string, message: any) => {
  const io = getIO();

  if (!io) {
    console.warn('Socket.IO not initialized');
    return;
  }

  // Send to specific user
  io.emit(`notification-${userId}`, {
    message,
    time: new Date(),
    timestamp: Date.now()
  });

  console.log(`📩 Notification sent to ${userId}`);
};

export const broadcastNotification = (message: any) => {
  const io = getIO();

  if (!io) {
    console.warn('Socket.IO not initialized');
    return;
  }

  io.emit('notification-broadcast', {
    message,
    time: new Date(),
    timestamp: Date.now()
  });

  console.log('📢 Broadcast notification sent');
};
