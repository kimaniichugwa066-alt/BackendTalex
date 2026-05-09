import PDFDocument from "pdfkit";

interface Application {
  _id: string;
  applicant: {
    fullName: string;
    email: string;
  };
  job: {
    title: string;
    company: string;
    location?: string;
    salary?: number;
  };
  createdAt?: Date;
}

export const createOfferLetter = (application: Application) => {
  const doc = new PDFDocument({ margin: 50 });

  const { applicant, job } = application;
  const currentDate = new Date().toDateString();

  // ========== HEADER ==========
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("OFFER LETTER", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .font("Helvetica")
    .text("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", { align: "center" })
    .moveDown();

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Talex Recruitment System", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Your Gateway to Career Opportunities", { align: "center" })
    .moveDown(2);

  // ========== DATE & REFERENCE ==========
  doc
    .fontSize(11)
    .font("Helvetica")
    .text(`Date: ${currentDate}`)
    .moveDown(0.5);

  doc.text(`Application ID: ${application._id}`)
    .moveDown(2);

  // ========== GREETING ==========
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Dear ${applicant.fullName},`)
    .moveDown(1.5);

  // ========== INTRODUCTION ==========
  doc
    .fontSize(11)
    .font("Helvetica")
    .text(
      `We are pleased to extend this formal offer of employment for the position of ${job.title} at ${job.company}.`,
      { align: "left" }
    )
    .moveDown(1);

  doc.text(
    "After reviewing your qualifications and interview performance, we believe you will be a valuable addition to our team. Your experience and expertise align perfectly with our organizational values.",
    { align: "left" }
  )
    .moveDown(1.5);

  // ========== JOB DETAILS SECTION ==========
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("JOB OFFER DETAILS", { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(11)
    .font("Helvetica")
    .rect(50, doc.y, 495, 110)
    .stroke();

  doc.moveDown(0.3);

  const details = [
    [`Position Title:`, job.title],
    [`Company:`, job.company],
    [`Location:`, job.location || "To be confirmed"],
    [`Employment Type:`, "Full-time"],
    [`Expected Start Date:`, "To be communicated"],
  ];

  details.forEach(([label, value]) => {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(label, 60, doc.y, { width: 150 });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(value, 220, doc.y - 12, { width: 315 });
    doc.moveDown(0.8);
  });

  doc.moveDown(1);

  // ========== TERMS & CONDITIONS ==========
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("TERMS & CONDITIONS", { underline: true })
    .moveDown(0.5);

  const conditions = [
    "This offer is contingent upon successful completion of background verification.",
    "Receipt and verification of all required documents and qualifications.",
    "Valid passport/national ID and work authorization (if applicable).",
    "Compliance with company policies and code of conduct.",
    "Maintenance of confidentiality regarding company information.",
    "Successful medical clearance (if required).",
  ];

  conditions.forEach((condition) => {
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`• ${condition}`, 60, { width: 430 })
      .moveDown(0.6);
  });

  doc.moveDown(1);

  // ========== CLOSING STATEMENT ==========
  doc
    .fontSize(11)
    .font("Helvetica")
    .text(
      `We look forward to welcoming you to the ${job.company} team and working together towards mutual growth and success. Please confirm your acceptance of this offer at your earliest convenience.`,
      { align: "left" }
    )
    .moveDown(2);

  // ========== SIGNATURE SECTION ==========
  doc
    .fontSize(11)
    .font("Helvetica")
    .text("Sincerely,")
    .moveDown(2.5);

  doc.text("_________________________");
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("HR Department");
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Talex Recruitment System");

  doc.moveDown(3);

  // ========== FOOTER ==========
  doc
    .fontSize(9)
    .font("Helvetica")
    .text("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", { align: "center" })
    .moveDown(0.3);

  doc.text(
    "This offer letter is valid for 14 days from the date of issue. Please contact HR for any clarifications.",
    { align: "center" }
  )
    .moveDown(0.3);

  doc.text("© 2026 Talex Recruitment System. All rights reserved.", {
    align: "center",
  });

  doc.end();

  return doc;
};
