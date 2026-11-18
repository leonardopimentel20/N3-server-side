import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const partes = authHeader.split(' ');
    
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({ erro: 'Token inválido' });
    }

    const token = partes[1];

    try {
        const dadosDecodificados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dadosDecodificados;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}
