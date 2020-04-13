export enum TutorialType {
  SWAP = 'swap',
  POOL = 'pool',
}

export enum TutorialContent {
  INTRO = 'intro',
  PLAY = 'play',
}

export enum TutorialView {
  SINGLE_SWAP = 'single',
  DOUBLE_SWAP = 'double',
  STAKING = 'stake',
  EARNING = 'earn',
}

export type TutorialMatch = {type?: string, view?: string, content?: string}
