/**
 * One short clip per page, shown in the bottom-right corner player.
 * Files live in public/videos (compressed from the originals); `poster` is the
 * still shown before the clip loads. `portrait` only changes the thumbnail's
 * shape — the fullscreen view always fits the clip.
 */
export type PageVideo = { src: string; poster: string; label: string; portrait?: boolean };

const v = (slug: string, label: string, portrait = false): PageVideo => ({
  src: `/videos/${slug}.mp4`,
  poster: `/videos/posters/${slug}.jpg`,
  label,
  portrait,
});

export const pageVideos: Record<string, PageVideo> = {
  '/': v('home', 'Watch Vanzoo', true),
  '/about-us/': v('about-us', 'Watch our story'),
  '/locate-us/': v('locate-us', 'Tour our store', true),
  '/membership/': v('sofa-cleaning', 'Watch sofa cleaning'),
  '/services/sofa-bed-mattress-cleaning/': v('sofa-cleaning', 'Watch sofa, bed & mattress cleaning'),
  '/services/couture-care/': v('couture-care', 'Watch suit care', true),
  '/services/ethnic-wear/': v('ethnic-wear', 'Watch saree care', true),
  '/services/delicate-fabrics/': v('lehenga', 'Watch lehenga care', true),
  '/services/shoe-care/': v('shoe-care', 'Watch shoe care', true),
  '/services/bags-leather-care/': v('bags-leather-care', 'Watch bag care'),
  '/services/toys-accessories-care/': v('toys-accessories-care', 'Watch toy & baby care', true),
  '/services/curtain-cleaning/': v('curtain-cleaning', 'Watch curtain care'),
  '/services/carpet-cleaning/': v('carpet-cleaning', 'Watch carpet care'),
  '/services/home-textiles/': v('home-textiles', 'Watch blanket care'),
  '/services/steam-iron/': v('steam-iron', 'Watch steam ironing', true),
  '/services/pickup-delivery/': v('pickup-delivery', 'Watch pickup & delivery', true),
};
