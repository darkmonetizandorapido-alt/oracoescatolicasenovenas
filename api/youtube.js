// Serverless Function - Vercel
// Rota: /api/youtube

export default async function handler(req, res) {
    const CHANNEL_ID = 'UCfaoDrlfLZDwNB_6oVJcMaA';
    const MAX_RESULTS = 50;
    const API_KEY = process.env.YOUTUBE_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({
            error: 'YOUTUBE_API_KEY não configurada no servidor.'
        });
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?` +
            `key=${API_KEY}&channelId=${CHANNEL_ID}` +
            `&part=snippet,id&order=date&maxResults=${MAX_RESULTS}&type=video`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error('Erro da API do YouTube:', data);
            return res.status(response.status).json({
                error: 'Erro ao buscar vídeos da API do YouTube',
                details: data.error || data,
                status: response.status
            });
        }

        return res.status(200).json({
            items: data.items || []
        });

    } catch (error) {
        console.error('Erro interno na Serverless Function (YouTube):', error);
        return res.status(500).json({
            error: 'Erro interno do servidor ao processar a requisição do YouTube.'
        });
    }
}
