export default function handler(req, res) {
  return res.status(200).json({
    user: process.env.EMAILJS_USER_ID || null,
    service: process.env.EMAILJS_SERVICE_ID || null,
    template: process.env.EMAILJS_TEMPLATE_ID || null
  });
}
