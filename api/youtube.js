const fetch = require('node-fetch');

// ID do Canal do YouTube (informação pública)
const CHANNEL_ID = 'UCfaoDrlfLZDwNB_6oVJcMaA'; 
const MAX_RESULTS = 50; // Máximo de resultados a buscar

module.exports = async (req, res) => {
    // A chave da API é lida de forma segura das variáveis de ambiente do Vercel
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
        res.status(500).json({ error: 'YOUTUBE_API_KEY não configurada no servidor.' });
        return;
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            // Loga o erro completo no console do servidor
            console.error('Erro da API do YouTube:', data);
            // Encaminha erros da API do YouTube para o cliente
            res.status(response.status).json({ 
                error: 'Erro ao buscar vídeos da API do YouTube', 
                details: data.error || 'Resposta da API não OK',
                status: response.status
            });
            return;
        }

        if (data.error) {
            // Encaminha erros da API do YouTube
            res.status(response.status).json({ error: 'Erro ao buscar vídeos da API do YouTube', details: data.error });
            return;
        }

        // Retorna apenas os itens necessários
        res.status(200).json({ items: data.items || [] });

    } catch (error) {
        console.error('Erro interno na Serverless Function (YouTube):', error);
        res.status(500).json({ error: 'Erro interno do servidor ao processar a requisição do YouTube.' });
    }
};
