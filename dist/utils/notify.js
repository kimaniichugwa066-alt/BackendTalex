"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNotification = exports.sendNotification = exports.getIO = exports.initializeIO = void 0;
let ioInstance = null;
const initializeIO = (io) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log('🟢 User connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};
exports.initializeIO = initializeIO;
const getIO = () => {
    return ioInstance;
};
exports.getIO = getIO;
const sendNotification = (userId, message) => {
    const io = (0, exports.getIO)();
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
exports.sendNotification = sendNotification;
const broadcastNotification = (message) => {
    const io = (0, exports.getIO)();
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
exports.broadcastNotification = broadcastNotification;
