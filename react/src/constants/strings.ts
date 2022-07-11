export const GAME_TITLE = 'WordleLab'

export const WIN_MESSAGES = ['Great Job!', 'Awesome', 'Well done!']
export const GAME_COPIED_MESSAGE = 'Game copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough letters'
export const WORD_NOT_FOUND_MESSAGE = 'Word not found'
export const HARD_MODE_ALERT_MESSAGE =
  'Hard Mode can only be enabled at the start!'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'For improved color vision'
export const CORRECT_WORD_MESSAGE = (solution: string) =>
  `The word was ${solution}`
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Must use ${guess} in position ${position}`
export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `Guess must contain ${letter}`
export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Delete'
export const STATISTICS_TITLE = 'Statistics'
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_WORD_TEXT = 'New word in'
export const SHARE_TEXT = 'Share'
export const TOTAL_TRIES_TEXT = 'Total tries'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'

export const NEXT_GAME_TEXT = 'Next Round!'
export const INFO_CONTINUE_TEXT = 'Continue'

export const FULL_UNUSED_PRIMING_EMOTIONS = ['anger', 'sadness', 'surprise', 'happiness', 'disgust', 'fear', 'awe', 'love', 'gratitude', 'curiosity', 'control']
export const PRIMING_EMOTIONS = ['anger', 'control']
export const PRIMING_EMOTION_EXAMPLES: { [name: string]: string } = {
  'anger': 'being treated unfairly by someone, being insulted or offended',
  'sadness': 'losing a loved one–a parent, a friend, or a pet; breaking up with a person whom you love; witnessing a person suffering, etc',
  'surprise': 'experiencing something like you’ve never experienced before, listening to a story with an unexpected ending',
  'happiness': 'spending time with your closest friends, enjoying a vacation',
  'disgust': 'witnessing something that is offensive or distasteful, smelling or seeing spoiled foods or dead animals',
  'fear': 'being in a dangerous or threatening situation, confronting snakes, heights, or public speaking',
  'awe': 'reverence towards something sublime, recognizing the vastness of the cosmos or the grandeur of the Grand Canyon, the Great Pyramids of Giza, and other places on Earth',
  'love': 'feeling affection towards another person, feeling compassion for humans, animals, and the rest of nature',
  'gratitude': 'feeling appreciation for gifts, help, or favors, being thankful for someone or something',
  'curiosity': 'desiring to learn about something, exploring something that you want to know more about or be better at'
}

export const ENCOURAGEMENT_MESSAGES = ['You got this!', 'You can do it!', 'You\'re so close!', 'Don\'t give up now!']
