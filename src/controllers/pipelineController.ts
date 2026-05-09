import { Response } from 'express';
import Application from '../models/Application';
import { sendEmail } from '../utils/sendEmail';
import { createOfferLetter } from '../utils/generateOfferLetter';
import { sendNotification } from '../utils/notify';
import { AuthRequest } from '../middleware/authMiddleware';

// 🔄 STEP 1: Move to REVIEW
export const reviewApplication = async (req: AuthRequest, res: Response) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email')
      .populate('job', 'title company');

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = 'under_review';
    await app.save();

    const applicant = (app.applicant as any);
    const job = (app.job as any);

    // Send email
    await sendEmail({
      to: applicant.email,
      subject: '📋 Application Under Review - Talex',
      html: `
        <h2>Hello ${applicant.fullName},</h2>
        <p>Thank you for applying to <b>${job.title}</b> at <b>${job.company}</b>.</p>
        <p>Your application is now under review. We will keep you updated on the progress.</p>
        <p>Best regards,<br>Talex Recruitment Team</p>
      `
    }).catch(console.error);

    // Send real-time notification
    sendNotification(applicant._id, {
      title: 'Application Under Review',
      message: `Your application for ${job.title} is now under review.`,
      status: 'under_review'
    });

    res.json({ success: true, message: 'Application moved to under_review', data: app });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📅 STEP 2: Schedule Interview
export const scheduleInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { date, link } = req.body;

    if (!date || !link) {
      return res.status(400).json({ success: false, message: 'Interview date and link are required' });
    }

    const app = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email')
      .populate('job', 'title company');

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = 'interview_scheduled';
    app.interviewDate = new Date(date);
    app.interviewLink = link;
    await app.save();

    const applicant = (app.applicant as any);
    const job = (app.job as any);

    // Format date for email
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send email
    await sendEmail({
      to: applicant.email,
      subject: '📞 Interview Scheduled - Talex',
      html: `
        <h2>Interview Invitation</h2>
        <p>Dear ${applicant.fullName},</p>
        <p>Congratulations! Your interview for <b>${job.title}</b> at <b>${job.company}</b> has been scheduled.</p>
        <p><b>📅 Date & Time:</b> ${formattedDate}</p>
        <p><b>🔗 Meeting Link:</b> <a href="${link}">${link}</a></p>
        <p>Please join the meeting at the scheduled time. If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>Talex Recruitment Team</p>
      `
    }).catch(console.error);

    // Send real-time notification
    sendNotification(applicant._id, {
      title: 'Interview Scheduled',
      message: `Your interview for ${job.title} is scheduled on ${formattedDate}`,
      status: 'interview_scheduled',
      interviewDate: date,
      interviewLink: link
    });

    res.json({ success: true, message: 'Interview scheduled', data: app });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📄 STEP 3: Send Offer Letter
export const sendOfferLetter = async (req: AuthRequest, res: Response) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email')
      .populate('job', 'title company');

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = 'offer_sent';
    await app.save();

    const applicant = (app.applicant as any);
    const job = (app.job as any);

    // Generate PDF and convert to buffer
    const doc = createOfferLetter(app as any);
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    doc.on('end', async () => {
      const pdf = Buffer.concat(buffers);

      // Send email with PDF attachment
      await sendEmail({
        to: applicant.email,
        subject: '🎉 Offer Letter - Talex',
        html: `
          <h2>Congratulations ${applicant.fullName}!</h2>
          <p>We are delighted to extend this formal offer of employment for the position of <b>${job.title}</b> at <b>${job.company}</b>.</p>
          <p>Please find your offer letter attached to this email.</p>
          <p>Please review the document and get back to us with your acceptance.</p>
          <p>Best regards,<br>Talex Recruitment Team</p>
        `
      }).catch(console.error);

      // Send real-time notification
      sendNotification(applicant._id, {
        title: 'Offer Received',
        message: `Congratulations! You have received an offer for ${job.title}`,
        status: 'offer_sent'
      });

      res.json({ success: true, message: 'Offer letter sent', data: app });
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🏁 STEP 4: Mark as Hired
export const markHired = async (req: AuthRequest, res: Response) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email')
      .populate('job', 'title company');

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = 'hired';
    await app.save();

    const applicant = (app.applicant as any);
    const job = (app.job as any);

    // Send email
    await sendEmail({
      to: applicant.email,
      subject: '🎉 Welcome to the Team!',
      html: `
        <h2>Congratulations ${applicant.fullName}!</h2>
        <p>You have officially been hired for <b>${job.title}</b> at <b>${job.company}</b>.</p>
        <p>Welcome aboard! We look forward to seeing you contribute to our team.</p>
        <p>Your HR department will contact you shortly with onboarding details.</p>
        <p>Best regards,<br>Talex Recruitment Team</p>
      `
    }).catch(console.error);

    // Send real-time notification
    sendNotification(applicant._id, {
      title: 'Hired',
      message: `You have been hired for ${job.title}. Welcome to the team!`,
      status: 'hired'
    });

    res.json({ success: true, message: 'Applicant hired', data: app });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ❌ STEP 5: Reject Application
export const rejectApplication = async (req: AuthRequest, res: Response) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('applicant', 'fullName email')
      .populate('job', 'title company');

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    app.status = 'rejected';
    await app.save();

    const applicant = (app.applicant as any);
    const job = (app.job as any);

    // Send email
    await sendEmail({
      to: applicant.email,
      subject: 'Application Update - Talex',
      html: `
        <h2>Hello ${applicant.fullName},</h2>
        <p>Thank you for applying to <b>${job.title}</b> at <b>${job.company}</b>.</p>
        <p>Unfortunately, you were not selected this time. However, we encourage you to apply for other roles that match your skills.</p>
        <p>We appreciate your interest in joining our team.</p>
        <p>Best regards,<br>Talex Recruitment Team</p>
      `
    }).catch(console.error);

    // Send real-time notification
    sendNotification(applicant._id, {
      title: 'Application Status',
      message: `Your application for ${job.title} was not selected. Thank you for applying.`,
      status: 'rejected'
    });

    res.json({ success: true, message: 'Application rejected', data: app });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
