import cron from 'node-cron';
import prisma from '../prisma/client';
import { sendPaymentReminderSMS } from '../services/notificationService';
import { invalidateJobsCache, invalidateDashboardCache } from '../services/cacheService';

export const startCronJobs = () => {
  // Run every hour: Expire unpaid applications after 24 hours
  cron.schedule('0 * * * *', async () => {
    console.log('Running unpaid applications cleanup...');
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const expiredApplications = await prisma.application.findMany({
        where: {
          paymentStatus: 'PENDING',
          createdAt: { lt: twentyFourHoursAgo },
        },
        include: { user: true, job: true },
      });

      for (const app of expiredApplications) {
        await prisma.application.delete({ where: { id: app.id } });
        console.log(`Deleted expired application: ${app.id}`);
      }

      if (expiredApplications.length > 0) {
        invalidateDashboardCache();
      }
    } catch (error) {
      console.error('Error in unpaid applications cleanup:', error);
    }
  });

  // Run every 6 hours: Send payment reminders for pending applications
  cron.schedule('0 */6 * * *', async () => {
    console.log('Sending payment reminders...');
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const pendingApplications = await prisma.application.findMany({
        where: {
          paymentStatus: 'PENDING',
          createdAt: { lt: oneHourAgo },
        },
        include: { user: true, job: true },
      });

      for (const app of pendingApplications) {
        await sendPaymentReminderSMS(app.user.phone, app.job.title);
        console.log(`Sent payment reminder to ${app.user.phone} for job ${app.job.title}`);
      }
    } catch (error) {
      console.error('Error sending payment reminders:', error);
    }
  });

  // Run daily at midnight: Deactivate expired jobs
  cron.schedule('0 0 * * *', async () => {
    console.log('Deactivating expired jobs...');
    try {
      const now = new Date();
      const expiredJobs = await prisma.job.updateMany({
        where: {
          status: 'ACTIVE',
          deadline: { lt: now },
        },
        data: { status: 'INACTIVE' },
      });

      if (expiredJobs.count > 0) {
        invalidateJobsCache();
        invalidateDashboardCache();
        console.log(`Deactivated ${expiredJobs.count} expired jobs`);
      }
    } catch (error) {
      console.error('Error deactivating expired jobs:', error);
    }
  });

  // Run daily at 2 AM: Clean old notifications (older than 30 days)
  cron.schedule('0 2 * * *', async () => {
    console.log('Cleaning old notifications...');
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const deletedNotifications = await prisma.notification.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      });
      console.log(`Deleted ${deletedNotifications.count} old notifications`);
    } catch (error) {
      console.error('Error cleaning old notifications:', error);
    }
  });

  console.log('Cron jobs started successfully');
};
