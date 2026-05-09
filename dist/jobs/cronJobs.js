"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = __importDefault(require("../prisma/client"));
const notificationService_1 = require("../services/notificationService");
const cacheService_1 = require("../services/cacheService");
const startCronJobs = () => {
    // Run every hour: Expire unpaid applications after 24 hours
    node_cron_1.default.schedule('0 * * * *', async () => {
        console.log('Running unpaid applications cleanup...');
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const expiredApplications = await client_1.default.application.findMany({
                where: {
                    paymentStatus: 'PENDING',
                    createdAt: { lt: twentyFourHoursAgo },
                },
                include: { user: true, job: true },
            });
            for (const app of expiredApplications) {
                await client_1.default.application.delete({ where: { id: app.id } });
                console.log(`Deleted expired application: ${app.id}`);
            }
            if (expiredApplications.length > 0) {
                (0, cacheService_1.invalidateDashboardCache)();
            }
        }
        catch (error) {
            console.error('Error in unpaid applications cleanup:', error);
        }
    });
    // Run every 6 hours: Send payment reminders for pending applications
    node_cron_1.default.schedule('0 */6 * * *', async () => {
        console.log('Sending payment reminders...');
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const pendingApplications = await client_1.default.application.findMany({
                where: {
                    paymentStatus: 'PENDING',
                    createdAt: { lt: oneHourAgo },
                },
                include: { user: true, job: true },
            });
            for (const app of pendingApplications) {
                if (!app.user.phone) {
                    console.log(`Skipping payment reminder for application ${app.id} because user phone is missing.`);
                    continue;
                }
                await (0, notificationService_1.sendPaymentReminderSMS)(app.user.phone, app.job.title);
                console.log(`Sent payment reminder to ${app.user.phone} for job ${app.job.title}`);
            }
        }
        catch (error) {
            console.error('Error sending payment reminders:', error);
        }
    });
    // Run daily at midnight: Deactivate expired jobs
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('Deactivating expired jobs...');
        try {
            const now = new Date();
            const expiredJobs = await client_1.default.job.updateMany({
                where: {
                    status: 'ACTIVE',
                    deadline: { lt: now },
                },
                data: { status: 'INACTIVE' },
            });
            if (expiredJobs.count > 0) {
                (0, cacheService_1.invalidateJobsCache)();
                (0, cacheService_1.invalidateDashboardCache)();
                console.log(`Deactivated ${expiredJobs.count} expired jobs`);
            }
        }
        catch (error) {
            console.error('Error deactivating expired jobs:', error);
        }
    });
    // Run daily at 2 AM: Clean old notifications (older than 30 days)
    node_cron_1.default.schedule('0 2 * * *', async () => {
        console.log('Cleaning old notifications...');
        try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const deletedNotifications = await client_1.default.notification.deleteMany({
                where: { createdAt: { lt: thirtyDaysAgo } },
            });
            console.log(`Deleted ${deletedNotifications.count} old notifications`);
        }
        catch (error) {
            console.error('Error cleaning old notifications:', error);
        }
    });
    console.log('Cron jobs started successfully');
};
exports.startCronJobs = startCronJobs;
