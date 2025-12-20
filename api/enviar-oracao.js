export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const USER_ID = process.env.EMAILJS_USER_ID;
  const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;

  if (!USER_ID || !SERVICE_ID || !TEMPLATE_ID) {
    return res.status(500).json({ error: 'Variáveis de ambiente não configuradas.' });
  }

  const { name, email, pedido } = req.body;

  if (!name || !email || !pedido) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: USER_ID,
        template_params: {
          from_name: name,
          from_email: email,
          message: pedido
        }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Erro EmailJS:', text);
      return res.status(500).json({ error: 'Falha ao enviar e-mail.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
