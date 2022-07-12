import { getSolution, unicodeSplit } from './words'
import { VALID_GUESSES } from '../constants/validGuesses'

export type CharStatus = 'absent' | 'present' | 'correct'

export const getStatuses = (
  guesses: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}
  const splitSolution = unicodeSplit(getSolution())

  guesses.forEach((word) => {
    unicodeSplit(word).forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {
        // make status absent
        return (charObj[letter] = 'absent')
      }

      if (letter === splitSolution[i]) {
        //make status correct
        return (charObj[letter] = 'correct')
      }

      if (charObj[letter] !== 'correct') {
        //make status present
        return (charObj[letter] = 'present')
      }
    })
  })

  return charObj
}

export const getGuessStatuses = (guess: string): CharStatus[] => {
  const splitSolution = unicodeSplit(getSolution())
  const splitGuess = unicodeSplit(guess)

  const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = 'correct'
      solutionCharsTaken[i] = true
      return
    }
  })

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return

    if (!splitSolution.includes(letter)) {
      // handles the absent case
      statuses[i] = 'absent'
      return
    }

    // now we are left with "present"s
    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    )

    if (indexOfPresentChar > -1) {
      statuses[i] = 'present'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    } else {
      statuses[i] = 'absent'
      return
    }
  })

  return statuses
}

export const getGuessScore = (guess: string): number => {
  const statuses = getGuessStatuses(guess)
  let score = 0
  for (const status of statuses) {
    if (status == 'present') {
      score += 1
    }
    if (status == 'correct') {
      score += 3
    }
  }
  return score
}

export const getNumberOfRemainingWords = (guesses: string[]): number => {
  let remainingWords = [...VALID_GUESSES]
  for (const guess of guesses) {
    const guessStatuses = getGuessStatuses(guess)
    const letterStatuses: { [letter: string]: string } = {}
    // this algorithm is a little weird, because duplicate green letters show up as absent and correct
    // this is a rough approximation of the correct algorithm
    for (let i = 0; i < guessStatuses.length; i++) {
      const status = guessStatuses[i]
      const letter = guess[i].toLowerCase()
      if (status == 'absent' && !(letter in letterStatuses)) {
        letterStatuses[letter] = 'absent'
      }
      if (status == 'present' && letterStatuses[letter] != 'correct') {
        letterStatuses[letter] = 'present'
      }
      if (status == 'correct') {
        letterStatuses[letter] = 'correct'
      }
      if (status == 'correct') {
        remainingWords = remainingWords.filter(word => word.charAt(i) == letter)
      }
    }
    for (const letter in letterStatuses) {
      const status = letterStatuses[letter]
      if (status == 'absent') {
        remainingWords = remainingWords.filter(word => !word.includes(letter))
      }
      if (status == 'present') {
        remainingWords = remainingWords.filter(word => word.includes(letter))
      }
    }
  }
  return remainingWords.length
}
