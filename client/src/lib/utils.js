import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const generateSlug = (name) => {
	if (!name) return '';
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
};

export const optimizeCloudinaryUrl = (url) => {
	if (!url || typeof url !== 'string') return url;
	if (!url.includes('cloudinary.com')) return url;
	if (url.includes('f_auto') && url.includes('q_auto')) return url;

	return url.replace('/upload/', '/upload/f_auto,q_auto/');
};
