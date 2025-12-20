const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // A chave da API e IDs são lidos de forma segura das variáveis de ambiente do Vercel
    const USER_ID = process.env.EMAILJS_USER_ID;
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID; // Assumindo que você tem um template ID

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Método não permitido. Use POST.' });
        return;
    }

    if (!USER_ID || !SERVICE_ID || !TEMPLATE_ID) {
        res.status(500).json({ error: 'Variáveis de ambiente do EmailJS não configuradas no servidor.' });
        return;
    }

    try {
        // O frontend envia 'name', 'email' e 'pedido'. O 'assunto' será fixo.
        const { name, email, pedido } = req.body;

        if (!name || !email || !pedido) {
            res.status(400).json({ error: 'Dados incompletos no corpo da requisição. Campos esperados: name, email, pedido.' });
            return;
        }

        const emailjs_url = 'https://api.emailjs.com/api/v1.0/email/send';
        
        const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    public_key: USER_ID, // 👈 MUITO IMPORTANTE
    template_params: {
        from_name: name,
        from_email: email,
        message: pedido
    }
};


        const response = await fetch(emailjs_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            res.status(200).json({ message: 'E-mail enviado com sucesso!' });
        } else {
            const errorText = await response.text();
            // Loga o erro completo no console do servidor
            console.error('Erro da API EmailJS:', errorText);
            res.status(response.status).json({ 
                error: 'Erro ao enviar e-mail via EmailJS.', 
                details: errorText,
                status: response.status
            });
        }

    } catch (error) {
        console.error('Erro interno na Serverless Function (Email):', error);
        res.status(500).json({ error: 'Erro interno do servidor ao processar a requisição de e-mail.' });
    }
};
