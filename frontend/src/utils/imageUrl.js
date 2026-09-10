/**
 * Helper utility to construct a valid image URL.
 * Handles relative paths, absolute URLs, and localhost hostnames returned by Django serializers.
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300';

    if (typeof imagePath === 'string') {
        let cleanPath = imagePath;

        // If serializer returned a localhost/127.0.0.1 absolute URL, strip the origin
        if (
            cleanPath.includes('http://localhost') ||
            cleanPath.includes('http://127.0.0.1') ||
            cleanPath.includes('https://localhost') ||
            cleanPath.includes('https://127.0.0.1')
        ) {
            try {
                const url = new URL(cleanPath);
                cleanPath = url.pathname + url.search;
            } catch (e) {
                cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
            }
        }

        // If it's still a valid external http(s) URL (e.g. S3 / Unsplash / placeholder), return as is
        if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
            return cleanPath;
        }

        // Ensure cleanPath starts with a slash
        if (!cleanPath.startsWith('/')) {
            cleanPath = '/' + cleanPath;
        }

        // Prepend VITE_MEDIA_URL if specified
        const mediaBase = import.meta.env.VITE_MEDIA_URL || '';
        if (mediaBase) {
            return `${mediaBase.replace(/\/$/, '')}${cleanPath}`;
        }

        return cleanPath;
    }

    return 'https://via.placeholder.com/300';
};

export default getImageUrl;
