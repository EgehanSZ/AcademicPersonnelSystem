import jwt from 'jsonwebtoken';

// Token kontrolü yapan middleware
export const authenticateToken = (req, res, next) => {
    // EGE-KOD: TokenI header'dan alıyoruz
    const rawToken = req.headers['authorization'];
    const token = rawToken?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Erişim Engellendi: Token Eksik' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Geçersiz Token' });
    }
};

// Yetki kontrolü yapan middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
        }
        next();
    };
};
