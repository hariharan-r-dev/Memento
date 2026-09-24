export type CharmCategory = 'Lucky' | 'Protection' | 'Cute' | 'Animals' | 'Characters'

export type Charm = {
  id: string
  name: string
  category: CharmCategory
  description: string
  tags: string[]
}

export const CATEGORIES: Array<'All' | CharmCategory> = [
  'All',
  'Lucky',
  'Protection',
  'Cute',
  'Animals',
  'Characters',
]

export const charms: Charm[] = [
  {
    id: 'maneki-neko',
    name: 'Maneki Neko',
    category: 'Lucky',
    description: 'The little one that brings good fortune.',
    tags: ['Lucky', 'Classic', 'Companion'],
  },
  {
    id: 'evil-eye',
    name: 'Evil Eye',
    category: 'Protection',
    description: 'Watches over you from the shadows.',
    tags: ['Protection', 'Amulet', 'Ancient'],
  },
  {
    id: 'hamsa',
    name: 'Hamsa',
    category: 'Protection',
    description: 'An open hand that holds away harm.',
    tags: ['Protection', 'Classic', 'Sacred'],
  },
  {
    id: 'koi-fish',
    name: 'Koi Fish',
    category: 'Lucky',
    description: 'Swims upstream, carries your dreams.',
    tags: ['Lucky', 'Serene', 'Classic'],
  },
  {
    id: 'fox-spirit',
    name: 'Fox Spirit',
    category: 'Characters',
    description: 'Clever, playful, and always watching.',
    tags: ['Mysterious', 'Forest', 'Spirit'],
  },
  {
    id: 'cloud-bunny',
    name: 'Cloud Bunny',
    category: 'Cute',
    description: 'Floats gently between worlds.',
    tags: ['Cute', 'Dreamy', 'Soft'],
  },
  {
    id: 'bear-cub',
    name: 'Bear Cub',
    category: 'Animals',
    description: 'Small but steady. Always by your side.',
    tags: ['Cozy', 'Forest', 'Companion'],
  },
  {
    id: 'moon-cat',
    name: 'Moon Cat',
    category: 'Cute',
    description: 'Drawn to moonlight, fond of silence.',
    tags: ['Nocturnal', 'Mystical', 'Quiet'],
  },
  {
    id: 'lucky-frog',
    name: 'Lucky Frog',
    category: 'Lucky',
    description: 'A coin in its mouth, a smile on its face.',
    tags: ['Lucky', 'Prosperous', 'Classic'],
  },
  {
    id: 'red-panda',
    name: 'Red Panda',
    category: 'Animals',
    description: 'Rare and wonderful. A true find.',
    tags: ['Rare', 'Forest', 'Curious'],
  },
  {
    id: 'tanuki',
    name: 'Tanuki',
    category: 'Characters',
    description: 'A shapeshifter who brings unexpected luck.',
    tags: ['Lucky', 'Playful', 'Spirit'],
  },
  {
    id: 'star-bird',
    name: 'Star Bird',
    category: 'Cute',
    description: 'Carries a tiny wish wherever it goes.',
    tags: ['Cute', 'Hopeful', 'Light'],
  },
]
