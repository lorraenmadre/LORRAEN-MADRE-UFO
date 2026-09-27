// The six "start your mothership" setup links, in order.
// Paste each affiliate / setup link into `url`. While a url is empty, the step
// sends people to the LORRAEN MADRE form so no one hits a dead end.
export interface StartStep {
  id: string;
  title: string;
  who: string;
  description: string;
  url: string;
  cta: string;
}

export const START_STEPS: StartStep[] = [
  {
    id: 'queen',
    title: 'Start your church',
    who: 'Queen',
    description: 'File the papers for your church, the spiritual and cultural center of your mothership.',
    url: '', // Alodia affiliate link — paste here
    cta: 'Start with Alodia',
  },
  {
    id: 'will',
    title: 'Start your will',
    who: 'Living will & trust',
    description: 'Put your living will and trust in place so everything you build is protected and passed on.',
    url: 'https://calendly.com/lorraen-madre',
    cta: 'Book with Lorraen',
  },
  {
    id: 'fund',
    title: 'Start your fund',
    who: 'Fund',
    description: 'Open the fund that holds and grows the money your mothership runs on.',
    url: '',
    cta: 'Start your fund',
  },
  {
    id: 'nonprofit',
    title: 'Start your nonprofit',
    who: 'South Node · Foundation',
    description: 'Form the nonprofit foundation that gives back and protects your roots.',
    url: '',
    cta: 'Start your nonprofit',
  },
  {
    id: 'holding',
    title: 'Start your holding company',
    who: 'UFO · Mothership',
    description: 'Form the holding company every planet, house and venture orbits.',
    url: '',
    cta: 'Start your holding company',
  },
  {
    id: 'retirement',
    title: 'Start your retirement plan',
    who: 'North Node · Retirement',
    description: 'Set up the retirement plan that carries your family forward.',
    url: '',
    cta: 'Start your retirement plan',
  },
];

export const START_FALLBACK_URL = 'https://www.lorraenmadre.com/connect';
