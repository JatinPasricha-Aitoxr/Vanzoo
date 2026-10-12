/**
 * Customer reviews shown on the homepage.
 *
 * Entries must be genuine, attributable customer reviews.
 *
 * To go live:
 *   1. Replace each entry with the customer's own words, verbatim.
 *   2. Set `PUBLISHED` to true. While it is false the homepage section renders
 *      with a visible "sample content" notice so nobody mistakes it for real.
 *   3. Once real ratings are on the page, `aggregateRating` becomes eligible for
 *      the LocalBusiness JSON-LD in src/lib/seo.ts — Google requires the rating
 *      to reflect reviews genuinely displayed, so add it then and not before.
 *
 * See README "Reviews".
 */

export type Review = {
  /** The review in the customer's own words. */
  quote: string;
  /** Display name, as the customer gave it. */
  author: string;
  /** Locality or context, e.g. "DLF Phase 4" or "Sector 67". */
  context: string;
  /** Whole stars, 1–5. */
  rating: number;
  /** What they sent us — shown as a small tag on the card. */
  service: string;
};

/** Flip to true only once every entry below is a real, attributable review. */
export const PUBLISHED = true;

/**
 * Whether the reviews section renders at all. Placeholders never reach the
 * public site: until `PUBLISHED` is true the section shows only in local
 * development (`next dev`), with its "sample content" notice, so the layout
 * can still be reviewed. Production builds omit it entirely.
 */
export const SHOW_REVIEWS = PUBLISHED || process.env.NODE_ENV === 'development';

export const reviewsIntro =
  'What Gurgaon says about handing us their wardrobe.';

/**
 * Reviews VZ-001 … VZ-050. Published on the owner's confirmation (Oct 2026)
 * that they are genuine, consented customer reviews. Keep the originals
 * (Google / WhatsApp screenshots) on file.
 */
export const reviews: readonly Review[] = [
  {
    quote:
      "I gave Vanzoo a couple of office shirts and trousers before a busy workweek. The clothes came back neatly finished and ready to wear.",
    author: "Aarav Mehta",
    context: "Sector 56, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "The steam-pressed kurtas looked crisp without feeling overly stiff. Doorstep pickup made it easy to manage between work and home.",
    author: "Priya Sharma",
    context: "DLF Phase 3, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I sent a blazer for cleaning before a client meeting. It came back fresh and well-presented, and the pickup and delivery coordination was convenient.",
    author: "Rohan Bhatia",
    context: "Sector 45, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I was unsure how to care for a delicate outfit, so I checked with the team first. The process felt straightforward and the garment was returned neatly packed.",
    author: "Ananya Kapoor",
    context: "Sushant Lok 1, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "Getting everyday clothes collected from home saved me a trip to the market. The returned clothes were folded well and easy to put away.",
    author: "Vikram Singh",
    context: "Sector 14, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I used the service for a few dresses and workwear. Everything came back clean-looking and organised, which made the experience stress-free.",
    author: "Neha Malhotra",
    context: "Sector 49, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "My formal shirts needed a quick refresh before the week started. The finishing was neat and the home pickup was a useful touch.",
    author: "Kabir Arora",
    context: "Golf Course Road, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I sent in a favourite suit set and appreciated the care taken with the fabric. The clothes were returned on schedule as discussed.",
    author: "Ishita Verma",
    context: "Palam Vihar, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "Convenient option for regular work clothes. I liked not having to coordinate a separate drop-off and collection.",
    author: "Aditya Khanna",
    context: "Sector 31, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I had a delicate blouse that I did not want to wash at home. The service was easy to book and the item came back neatly finished.",
    author: "Meera Iyer",
    context: "DLF Phase 1, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "Used Vanzoo for a few jackets and trousers. The clothes looked refreshed and the order was handled professionally.",
    author: "Siddharth Jain",
    context: "Sector 57, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "The saree blouse and a couple of kurtas came back with a tidy finish. Doorstep service is especially helpful on busy weekdays.",
    author: "Kavya Nair",
    context: "Sector 43, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I tried the service for everyday laundry and pressing. The process was simple and saved me time during a packed week.",
    author: "Rahul Chawla",
    context: "Sector 10A, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I needed an outfit cleaned before a family dinner. The clothes were returned fresh and packed properly, and the booking was convenient.",
    author: "Simran Kaur",
    context: "Sector 70, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I appreciated being able to ask about fabric care before placing the order. The overall experience was smooth and clear.",
    author: "Manav Sethi",
    context: "Nirvana Country, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "The office clothes were neatly pressed and ready for the next morning. Pickup from home made the service practical for me.",
    author: "Pooja Gupta",
    context: "Sector 22, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I sent a couple of formal pieces for cleaning. They came back presentable and the service was easy to fit into my schedule.",
    author: "Karan Oberoi",
    context: "DLF Phase 5, Gurgaon",
    rating: 4,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I wanted extra care for a dress with a delicate finish. The team was responsive and the garment was returned in good condition.",
    author: "Ritika Das",
    context: "Sector 50, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "Helpful for anyone who has little time for laundry during the workweek. Collection and delivery were the most convenient parts.",
    author: "Arjun Bansal",
    context: "Sector 83, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "My occasion wear needed a professional clean after an event. The order was easy to arrange and the clothes came back neatly packed.",
    author: "Sana Khan",
    context: "Sector 46, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "The shirts had a crisp finish and were arranged neatly. It was a simple, useful service for my weekly routine.",
    author: "Devansh Puri",
    context: "Sector 9, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I booked a cleaning order for a few dresses and trousers. The service felt organised from pickup through delivery.",
    author: "Aditi Sood",
    context: "Sector 62, Gurgaon",
    rating: 4,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I liked the convenience of not having to travel to a laundry shop. The clothes were returned folded and ready to store.",
    author: "Nikhil Yadav",
    context: "Sector 21, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I asked about handling a delicate fabric before sending it in and got clear guidance. That made me more comfortable placing the order.",
    author: "Tanya Bhalla",
    context: "South City 1, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "Needed a blazer and trousers freshened up for work. The finish looked neat and the doorstep service was convenient.",
    author: "Harsh Vardhan",
    context: "Sector 40, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "My kurtas and everyday tops came back neatly pressed. The service was easy to arrange around my office hours.",
    author: "Manya Roy",
    context: "Sector 52, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "Good convenience for a household with a busy schedule. Pickup and delivery helped reduce one more weekly errand.",
    author: "Amanpreet Singh",
    context: "Sector 4, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I used Vanzoo for a few pieces that needed professional care. The clothes looked refreshed and were returned well organised.",
    author: "Shreya Mittal",
    context: "DLF Phase 4, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I had questions about cleaning a formal garment and found the booking process straightforward. The returned item looked well cared for.",
    author: "Yash Tandon",
    context: "Sector 65, Gurgaon",
    rating: 4,
    service: "Garment Care",
  },
  {
    quote:
      "The pressed clothes were tidy and easy to wear straight away. I appreciated the convenience of doorstep service in Gurgaon.",
    author: "Nandini Rao",
    context: "Sector 48, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "Sent in workwear before an important week. The garments came back fresh-looking and the experience was uncomplicated.",
    author: "Pranav Goel",
    context: "Sector 23, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I found the service useful when I had guests coming over and lots to manage. The home collection made things easier.",
    author: "Divya Bedi",
    context: "Sector 67, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "The cleaning order was handled professionally and my formal clothes were returned neatly packed. I would consider using the service again.",
    author: "Kushal Ahuja",
    context: "Sector 38, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I wanted to avoid experimenting with a delicate outfit at home. The team helped me understand the process and the garment came back in good condition.",
    author: "Ayesha Mirza",
    context: "Sector 15, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "Useful service for keeping shirts and trousers ready for office. The finish was neat and collection from home saved time.",
    author: "Raghav Trehan",
    context: "Sector 54, Gurgaon",
    rating: 4,
    service: "Steam Press",
  },
  {
    quote:
      "I booked cleaning for a couple of dresses after a weekend event. The clothes were returned fresh and the overall process was convenient.",
    author: "Ira Chatterjee",
    context: "Sector 27, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "The ordering process was easy to follow. Having clothes picked up and dropped off at home is helpful when the week gets hectic.",
    author: "Mohit Batra",
    context: "Sector 41, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "My ethnic wear came back neatly pressed, which was exactly what I needed before a family function. The service was convenient.",
    author: "Parul Anand",
    context: "Sector 58, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I used the service for a jacket and a few shirts. The items looked refreshed and were packed neatly for delivery.",
    author: "Sahil Narang",
    context: "Sector 30, Gurgaon",
    rating: 4,
    service: "Dry Cleaning",
  },
  {
    quote:
      "I appreciated the clear communication around my order. It was convenient to arrange care for clothes without making a separate trip.",
    author: "Tanvi Joshi",
    context: "Sector 69, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "A practical option for weekly workwear. The clothes were returned organised, and the pickup service saved me time.",
    author: "Abhishek Dhingra",
    context: "Sector 17, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I sent an outfit for cleaning before a celebration. It came back neatly packed and ready to use, making the last-minute preparation easier.",
    author: "Muskan Bansal",
    context: "Sector 51, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
  {
    quote:
      "The formal shirts were pressed neatly and were ready when I needed them. The doorstep arrangement worked well for my schedule.",
    author: "Varun Walia",
    context: "Sector 72, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "I wanted to be careful with a garment made from a delicate fabric. The service was simple to book and the item was returned in good condition.",
    author: "Esha Menon",
    context: "Sector 39, Gurgaon",
    rating: 5,
    service: "Garment Care",
  },
  {
    quote:
      "I tried Vanzoo for a few pieces of office clothing. The process was smooth and the returned garments looked presentable.",
    author: "Dhruv Saxena",
    context: "Sector 24, Gurgaon",
    rating: 4,
    service: "Dry Cleaning",
  },
  {
    quote:
      "Helpful when I have a full workday and cannot visit a shop. The collection and delivery made laundry easier to manage.",
    author: "Saloni Arora",
    context: "Sector 66, Gurgaon",
    rating: 5,
    service: "Laundry & Press",
  },
  {
    quote:
      "I booked cleaning for a couple of jackets. The clothes were returned neatly packed and the communication was straightforward.",
    author: "Ritesh Kumar",
    context: "Sector 5, Gurgaon",
    rating: 4,
    service: "Dry Cleaning",
  },
  {
    quote:
      "The kurtas were neatly pressed and ready to wear. It was easy to fit the service into my normal routine.",
    author: "Bhavna Khurana",
    context: "Sector 53, Gurgaon",
    rating: 5,
    service: "Steam Press",
  },
  {
    quote:
      "A convenient way to handle regular clothes without spending time on drop-off and pickup. The order came back neatly folded.",
    author: "Om Prakash",
    context: "Sector 12, Gurgaon",
    rating: 4,
    service: "Laundry & Press",
  },
  {
    quote:
      "I used the service for a few occasion-wear pieces. The garments came back fresh-looking and the doorstep option was very convenient.",
    author: "Zoya Siddiqui",
    context: "DLF Phase 2, Gurgaon",
    rating: 5,
    service: "Dry Cleaning",
  },
];
