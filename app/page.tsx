import PostFeed from '@/components/PostFeed';
import AnnouncementBanner from '@/components/AnnouncementBanner';

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <div className="container mx-auto px-4 py-8">
        <PostFeed />
      </div>
    </>
  );
}
