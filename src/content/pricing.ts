/**
 * Tariffs, transcribed verbatim from vanzoo.in/couture-care-tariffs and
 * /steam-iron-tariffs.
 *
 * `price` is kept as a display string rather than a number because roughly half
 * the rows are "Starting from ₹x" — collapsing that into a number would state a
 * fixed price Vanzoo does not quote. See README to update these tables.
 */

import type { IconName } from '@/components/ui/Icon';

export type TariffRow = { item: string; price: string };
export type TariffGroup = {
  id: string;
  label: string;
  /** Shown in the table header and the category chip, purely as a scanning aid. */
  icon: IconName;
  rows: readonly TariffRow[];
};

export const tariffNote = 'All prices mentioned are exclusive of GST. GST will be charged extra.';

export const tariffIntro = 'Seamless, sustainable, and sophisticated — premium care, simplified.';

export const coutureTariffs: readonly TariffGroup[] = [
  {
    id: 'mens-garments',
    label: 'Men’s Garments',
    icon: 'shirt',
    rows: [
      { item: 'Pant/Trouser', price: '₹199' },
      { item: 'Jeans', price: '₹249' },
      { item: 'Shirt', price: 'Starting from ₹199' },
      { item: 'T-shirt', price: '₹199' },
      { item: 'Coat', price: '₹499' },
      { item: 'Men Suit 2 Pcs', price: '₹699' },
      { item: 'Men Suit 3 Pcs', price: '₹899' },
    ],
  },
  {
    id: 'traditional-ethnic',
    label: 'Traditional & Ethnic Wear',
    icon: 'dress',
    rows: [
      { item: 'Sherwani', price: 'Starting from ₹999' },
      { item: 'Kurta', price: 'Starting from ₹249' },
      { item: 'Kurta Fancy', price: '₹799' },
      { item: 'Kurta Heavy', price: '₹1,099' },
      { item: 'Salwar', price: 'Starting from ₹249' },
      { item: 'Saree', price: 'Starting from ₹299' },
      { item: 'Lehenga', price: 'Starting from ₹699' },
    ],
  },
  {
    id: 'casual-outerwear',
    label: 'Casual & Outerwear',
    icon: 'jacket',
    rows: [
      { item: 'Dress', price: 'Starting from ₹299' },
      { item: 'Shawl', price: 'Starting from ₹399' },
      { item: 'Sweater Full Sleeves', price: '₹299' },
      { item: 'Jacket', price: '₹499' },
      { item: 'Leather Jacket', price: '₹999' },
    ],
  },
  {
    id: 'home-textiles',
    label: 'Home Textiles',
    icon: 'bed',
    rows: [
      { item: 'Carpet (per Sqft)', price: '₹59' },
      { item: 'Curtain (per panel)', price: '₹349' },
      { item: 'Double Blanket', price: '₹599' },
      { item: 'Single Blanket', price: '₹499' },
      { item: 'Double Bedsheet', price: '₹499' },
      { item: 'Single Bedsheet', price: '₹299' },
    ],
  },
  {
    id: 'footwear',
    label: 'Footwear',
    icon: 'shoe',
    rows: [
      { item: 'Sports Shoes', price: '₹549' },
      { item: 'Leather Shoes', price: '₹799' },
      { item: 'Suede Leather Shoes', price: '₹799' },
      { item: 'Sneakers Shoes', price: '₹649' },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories & Special Items',
    icon: 'bag',
    rows: [
      { item: 'Leather Handbag', price: 'Starting from ₹699' },
      { item: 'Soft Toy', price: 'Starting from ₹299' },
    ],
  },
];

export const steamIronTariffs: readonly TariffGroup[] = [
  {
    id: 'everyday-wear',
    label: 'Everyday Wear',
    icon: 'shirt',
    rows: [
      { item: 'Pant/Trouser', price: '₹99' },
      { item: 'Jeans', price: '₹79' },
      { item: 'Shirt', price: 'Starting from ₹99' },
      { item: 'T-shirt', price: '₹89' },
      { item: 'Sweat Pants', price: '₹99' },
    ],
  },
  {
    id: 'formal-outerwear',
    label: 'Formal & Outerwear',
    icon: 'jacket',
    rows: [
      { item: 'Coat', price: '₹149' },
      { item: 'Waist Coat', price: '₹99' },
      { item: 'Leather Jacket', price: '₹299' },
      { item: 'Sweater Full Sleeves Plain', price: '₹99' },
      { item: 'Jacket Full Sleeves', price: '₹199' },
    ],
  },
  {
    id: 'ethnic-occasion',
    label: 'Ethnic & Occasion Wear',
    icon: 'dress',
    rows: [
      { item: 'KURTA', price: 'Starting from ₹89' },
      { item: 'Sherwani', price: 'Starting from ₹199' },
      { item: 'Saree', price: 'Starting from ₹129' },
      { item: 'Lehenga', price: 'Starting from ₹199' },
      { item: 'Dress', price: 'Starting from ₹149' },
      { item: 'Blouse', price: 'Starting from ₹79' },
      { item: 'Salwar', price: 'Starting from ₹79' },
      { item: 'Shawl', price: 'Starting from ₹99' },
    ],
  },
  {
    id: 'home-textiles-steam',
    label: 'Home Textiles',
    icon: 'bed',
    rows: [
      { item: 'Curtain Window', price: 'Starting from ₹149' },
      { item: 'Single Bedsheet', price: '₹99' },
      { item: 'Double Bedsheet', price: '₹149' },
    ],
  },
];
