export const SITE_TITLE = 'Un Tradi en el Novus Ordo';
export const SITE_DESCRIPTION =
	'Reflexiones sobre el tradicionalismo católico y la liturgia desde dentro del Novus Ordo.';

export const CATEGORIES: Record<string, string> = {
	liturgia: 'Liturgia',
	'misa-tradicional': 'Misa Tradicional',
	fe: 'Fe',
	oracion: 'Oración',
	apologetica: 'Apologética',
	historia: 'Historia',
};

export const SOCIAL_LINKS = [
	{ label: 'Facebook',  href: '/facebook',  icon: 'facebook'  },
	{ label: 'Twitter/X', href: '/twitter',   icon: 'twitter'   },
	{ label: 'Instagram', href: '/instagram', icon: 'instagram' },
	{ label: 'YouTube',   href: '/youtube',   icon: 'youtube'   },
	{ label: 'WhatsApp',  href: '/whatsapp',  icon: 'whatsapp'  },
	{ label: 'Spotify',   href: '/spotify',   icon: 'spotify'   },
] as const;

export const PODCAST_LINKS = [
	{ label: 'Spotify',      href: '/spotify-podcast'  },
	{ label: 'YouTube',      href: '/youtube-podcast'  },
	{ label: 'Pocket Casts', href: '/pocket-cast'      },
	{ label: 'Anchor / RSS', href: '/anchor'           },
] as const;
