export enum FeedbackAnimation {
  Wave = 'wave',
  Success = 'success',
  WaveShort = 'wave_short',
  Sadness = 'sadness',
  SlightlyHappy = 'slightly_happy',
  Idle = 'idle',
}

export type FeedbackResponse = {
  ai_text: string
  text: string[]
  animation: FeedbackAnimation
}

export type EmotionalFeedback = {
  onReallyClose: FeedbackResponse
  onFastGuess: FeedbackResponse
  onSlowGuess: FeedbackResponse
  firstGuess: FeedbackResponse
  fifthGuess: FeedbackResponse
  sixthGuess: FeedbackResponse
  newGame: FeedbackResponse
  onGettingClose: FeedbackResponse
  newHighScore: FeedbackResponse
  notNewHighScore: FeedbackResponse
  invalidWord: FeedbackResponse
  onWin: FeedbackResponse
  onLoss: FeedbackResponse
  onIdle: FeedbackResponse
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
  onReallyClose: { ai_text: 'Say a new 20 character empathetic message to someone who is close to geussing the right word', text: ["You’re so, so close. You got this!"],animation: FeedbackAnimation.WaveShort },
  onFastGuess: { ai_text: 'Say a new 20 character empathetic message to someone who guessed a word in wordle really fast', text: ['Wow, you\'re so fast! Incredible!'], animation: FeedbackAnimation.WaveShort },
  onSlowGuess: { ai_text: 'Say a new 20 character empathetic message to someone who took a long time to guess a word', text: ['Taking your time really paid off!'], animation: FeedbackAnimation.WaveShort },
  firstGuess: { ai_text: 'Say a new 20 character empathetic message to someone after their first wordle attempt',text: ['Good luck! You got this!','Another round! You can do this!','You\'ve got the hang of this!', 'I know you can get this one!'], animation: FeedbackAnimation.WaveShort },
  fifthGuess: 
    { ai_text: 'Say a new 20 character empathetic message to someone on their second to last wordle attempt', text: ['Two guesses left, that\'s plenty of time!', 'Last two guesses! Trust yourself, you got this.','This is a tough one, but you\'re close!','This one can be hard, but I believe in you!'], animation: FeedbackAnimation.Idle },
  sixthGuess: 
    { ai_text: 'Say a new 20 character empathetic message to someone on their last wordle attempt', text: ['Just breathe and think it through. You got this!','Stay calm and use all the facts you uncovered.','Your final chance. You can do it!','Don\'t give up now! Stay calm and breathe.'], animation: FeedbackAnimation.Wave }
  ,
  newGame: 
    { ai_text: 'Say a new 20 character empathetic message to someone starting a new wordle game and is on their first geussS',text: ["You got this!"],animation: FeedbackAnimation.WaveShort }
  ,
  onGettingClose: 
    { ai_text: 'Say a new 20 character empathetic message to someone whose close to geussing the right word',text: ['You\'re getting closer!','Oh nice, that really narrowed the field!','Ooh, you\'re getting close now!','That was a really good guess!'],animation: FeedbackAnimation.WaveShort }
  ,
  newHighScore: 
    { ai_text: 'Say a new 20 character empathetic message to someone who just set a new high score',text: ['Wow! What a great guess!','Ooh nice one! I didn\'t think of that.', 'You learned more information! Nice work!','Great guess!'],animation: FeedbackAnimation.Success }
  ,
  notNewHighScore: 
    { ai_text: 'Okay! Well now we know what doesn\'t work.',text: ['Okay! Well now we know what doesn\'t work.','Nice! now we know what to avoid.','Aww, I was sure that would be it.', 'Hmm, what could it be?!'],animation: FeedbackAnimation.SlightlyHappy }
  ,
  invalidWord: {
    ai_text: 'Oops! I don\'t know that word! Give it another try.', text: ['Oops! I don\'t know that word! Give it another try.'],
    animation: FeedbackAnimation.Sadness
  },
  onWin: { ai_text: 'Say a new 20 character empathetic message to someone who just won wordle',text: ['You did it!'],animation: FeedbackAnimation.Success }
  ,
  onLoss: { ai_text: 'You almost had it! Let\'s try again.',text: ["You almost had it! Let\'s try again."],animation: FeedbackAnimation.Sadness },
  onIdle: { ai_text: 'Say a new 20 character empathetic message to someone who is taking a long time to guess a word in wordle',text: ["It\'s good to think it through carefully."],animation: FeedbackAnimation.WaveShort }
  
}

export const getEmotionalFeedback = (): EmotionalFeedback => {
  return HELPFUL_TEDDY
}