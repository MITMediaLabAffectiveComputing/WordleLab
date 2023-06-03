export enum FeedbackAnimation {
  Wave = 'wave',
  Success = 'success',
  WaveShort = 'wave_short',
  Sadness = 'sadness',
  SlightlyHappy = 'slightly_happy',
  Idle = 'idle',
}

export type FeedbackResponse = {
  text: string
  animation: FeedbackAnimation
}

export type EmotionalFeedback = {
  onReallyClose: FeedbackResponse
  onFastGuess: FeedbackResponse
  onSlowGuess: FeedbackResponse
  firstGuess: FeedbackResponse[]
  fifthGuess: FeedbackResponse[]
  sixthGuess: FeedbackResponse[]
  onGettingClose: FeedbackResponse[]
  newHighScore: FeedbackResponse[]
  notNewHighScore: FeedbackResponse[]
  invalidWord: FeedbackResponse
  onWin: FeedbackResponse[]
  onLoss: FeedbackResponse
  onIdle: FeedbackResponse[]
}

export const getFeedbackKey = (feedbackResponse: FeedbackResponse): string | null => {
  const feedback = getEmotionalFeedback()
  for (const key of Object.getOwnPropertyNames(feedback)) {
    const value = feedback[key as keyof EmotionalFeedback]
    if (value == feedbackResponse) {
      return key
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const element = value[i]
        if (element == feedbackResponse) {
          return key + i
        }
      }
    }
  }
  return null
}

const HELPFUL_TEDDY = {
  onReallyClose: { text: 'You’re so, so close. You got this!', animation: FeedbackAnimation.WaveShort },
  onFastGuess: { text: 'Wow, you\'re so fast! Incredible!', animation: FeedbackAnimation.WaveShort },
  onSlowGuess: { text: 'Taking your time really paid off!', animation: FeedbackAnimation.WaveShort },
  firstGuess: [
    { text: 'Good luck! You got this!', animation: FeedbackAnimation.WaveShort },
    { text: 'Another round! You can do this!', animation: FeedbackAnimation.WaveShort },
    { text: 'You\'ve got the hang of this!', animation: FeedbackAnimation.WaveShort },
    { text: 'I know you can get this one!', animation: FeedbackAnimation.WaveShort }
  ],
  fifthGuess: [
    { text: 'Two guesses left, that\'s plenty of time!', animation: FeedbackAnimation.Idle },
    { text: 'Last two guesses! Trust yourself, you got this.', animation: FeedbackAnimation.Idle },
    { text: 'This is a tough one, but you\'re close!', animation: FeedbackAnimation.Idle },
    { text: 'This one can be hard, but I believe in you!', animation: FeedbackAnimation.Idle }
  ],
  sixthGuess: [
    { text: 'Just breathe and think it through. You got this!', animation: FeedbackAnimation.Wave },
    { text: 'Stay calm and use all the facts you uncovered.', animation: FeedbackAnimation.Wave },
    { text: 'Your final chance. You can do it!', animation: FeedbackAnimation.Wave },
    { text: 'Don\'t give up now! Stay calm and breathe.', animation: FeedbackAnimation.Wave }
  ],
  onGettingClose: [
    { text: 'You\'re getting closer!', animation: FeedbackAnimation.WaveShort },
    { text: 'Oh nice, that really narrowed the field!', animation: FeedbackAnimation.WaveShort },
    { text: 'Ooh, you\'re getting close now!', animation: FeedbackAnimation.WaveShort },
    { text: 'That was a really good guess!', animation: FeedbackAnimation.WaveShort }
  ],
  newHighScore: [
    { text: 'Wow! What a great guess!', animation: FeedbackAnimation.Success },
    { text: 'Ooh nice one! I didn\'t think of that.', animation: FeedbackAnimation.Success },
    { text: 'You learned more information! Nice work!', animation: FeedbackAnimation.Success },
    { text: 'Great guess!', animation: FeedbackAnimation.Success }
  ],
  notNewHighScore: [
    { text: 'Okay! Well now we know what doesn\'t work.', animation: FeedbackAnimation.SlightlyHappy },
    { text: 'Nice! now we know what to avoid.', animation: FeedbackAnimation.SlightlyHappy },
    { text: 'Aww, I was sure that would be it.', animation: FeedbackAnimation.Sadness },
    { text: 'Hmm, what could it be?!', animation: FeedbackAnimation.Sadness }
  ],
  invalidWord: {
    text: 'Oops! I don\'t know that word! Give it another try.',
    animation: FeedbackAnimation.Sadness
  },
  onWin: [
    { text: 'This must be your lucky day!!', animation: FeedbackAnimation.Success },
    { text: 'Two guesses?! Are you a wizard?!', animation: FeedbackAnimation.Success },
    { text: 'Three guesses? You\'re a rock star!', animation: FeedbackAnimation.Success },
    { text: 'Great job! You won in four guesses!', animation: FeedbackAnimation.Success },
    { text: 'You did it! You won in five guesses!', animation: FeedbackAnimation.Success },
    { text: 'That was close, but you did it!', animation: FeedbackAnimation.Success }
  ],
  onLoss: { text: 'You almost had it! Let\'s try again.', animation: FeedbackAnimation.Sadness },
  onIdle: [
    { text: 'It\'s good to think it through carefully.', animation: FeedbackAnimation.WaveShort },
    { text: 'I believe in you!', animation: FeedbackAnimation.WaveShort },
    { text: 'It\'s okay to feel stumped. You\'ll get it!', animation: FeedbackAnimation.WaveShort },
    { text: 'This one is a toughy, isn\'t it?', animation: FeedbackAnimation.Sadness }
  ]
}

export const getEmotionalFeedback = (): EmotionalFeedback => {
  return HELPFUL_TEDDY
}
