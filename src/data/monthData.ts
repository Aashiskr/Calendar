export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface MonthInfo {
  name: string;
  shortName: string;
  season: Season;
  image: string;
  quote: string;
}

export const monthData: MonthInfo[] = [
  {
    name: 'January',
    shortName: 'Jan',
    season: 'winter',
    image: '/images/january.png',
    quote: 'In the depth of winter, I found an invincible summer.',
  },
  {
    name: 'February',
    shortName: 'Feb',
    season: 'winter',
    image: '/images/february.png',
    quote: 'February brings the rain, thaws the frozen lake again.',
  },
  {
    name: 'March',
    shortName: 'Mar',
    season: 'spring',
    image: '/images/march.png',
    quote: 'Spring is nature\'s way of saying, let\'s party!',
  },
  {
    name: 'April',
    shortName: 'Apr',
    season: 'spring',
    image: '/images/april.png',
    quote: 'April hath put a spirit of youth in everything.',
  },
  {
    name: 'May',
    shortName: 'May',
    season: 'spring',
    image: '/images/may.png',
    quote: 'May and June, the warm sun brings everything to bloom.',
  },
  {
    name: 'June',
    shortName: 'Jun',
    season: 'summer',
    image: '/images/june.png',
    quote: 'Summer afternoon — the two most beautiful words.',
  },
  {
    name: 'July',
    shortName: 'Jul',
    season: 'summer',
    image: '/images/july.png',
    quote: 'In summer, the song sings itself.',
  },
  {
    name: 'August',
    shortName: 'Aug',
    season: 'summer',
    image: '/images/august.png',
    quote: 'August rain: the best of summer gone, and the new fall not yet born.',
  },
  {
    name: 'September',
    shortName: 'Sep',
    season: 'autumn',
    image: '/images/september.png',
    quote: 'Autumn carries more gold than all the other seasons.',
  },
  {
    name: 'October',
    shortName: 'Oct',
    season: 'autumn',
    image: '/images/october.png',
    quote: 'October gave a party; the leaves by hundreds came.',
  },
  {
    name: 'November',
    shortName: 'Nov',
    season: 'autumn',
    image: '/images/november.png',
    quote: 'The trees are about to show us how lovely it is to let things go.',
  },
  {
    name: 'December',
    shortName: 'Dec',
    season: 'winter',
    image: '/images/december.png',
    quote: 'December\'s wintery breath is already clouding the pond.',
  },
];

export function getMonthInfo(month: number): MonthInfo {
  return monthData[month];
}

export function getSeason(month: number): Season {
  return monthData[month].season;
}
