export interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  videos?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  createdAt: string;
  editedAt?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  isPinned?: boolean;
  pinnedAt?: string;
  isAnonymous?: boolean;
  user: {
    id?: string;
    name: string;
    image?: string;
    discordId?: string;
  };
  warnings?: Array<{
    id: string;
    message: string;
    createdAt: string;
  }>;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    name: string;
    image?: string;
    isAdmin?: boolean;
  };
}
