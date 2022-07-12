# WordleLab

WordleLab is a research platform designed to evaluate how incidental emotions and computational empathy influence people's ability to solve word puzzles. It is built with a Django backend to capture and save data, and a React frontend app that's forked from the fabulous [React Wordle](https://github.com/cwackerfuss/react-wordle).

Find the deployed WordleLab at [https://wordlelab.media.mit.edu/](https://wordlelab.media.mit.edu/), which consists of 5 components: (1) a pre-game survey, (2) multiple rounds of Wordle, (3) a post-game survey, (4) a link back to Prolific (for participants recruited from Prolific), and (5) an opportunity to play bonus rounds of Wordle.

The deployed WordleLab will randomly assign you to one of 4 conditions:

1) No empathetic agent and no emotional priming
2) Empathetic agent and no emotional priming
3) No empathetic agent and emotional priming.
4) Empathetic agent and emotional priming

![Screen Shot 2022-07-12 at 6 56 38 AM](https://user-images.githubusercontent.com/6493919/178481592-fd5a32c4-6358-44ad-9b82-31769251e5c3.png)

If you want to experience the empathetic agent and emotion priming condition, then simply add the parameters `?mightymorphin=true` to the URL like so: [https://wordlelab.media.mit.edu/?mightymorphin=true](https://wordlelab.media.mit.edu/?mightymorphin=true).


## Build and Run Locally

This guide is for running both the Django development server and React development server locally, ideally on a Linux-based machine or Mac. Neither development server is intended to be used in production, and you should look up guides on how to deploy Django and React on your platform/server of choice.

First, clone the project and `cd` into the project folder.

### Install and run Django backend

Install a virtual environment

```
python3.9 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Generate a logging directory. This part is optional if you edit the logging settings in [settings.py](src/project/settings.py)
```
sudo mkdir /var/log/django
sudo chmod 777 /var/log/django
```

Copy the template passwords file to a new passwords file.

```
cp src/passwords-template.py src/passwords.py
```

Edit the new `passwords.py` file with the appropriate files and connection information for your database of choice. The default is a sqlite file that will live in the project's base directory. For more information on Django settings, please read the amazing [Django Tutorial](https://docs.djangoproject.com/en/4.0/intro/tutorial02/).

Create your database tables and run the server.

```
python src/manage.py migrate
python src/manage.py createsuperuser # This will ask you to create a superuser you will use to access your Django admin console locally.
python src/manage.py runserver
```

You can now access your local Django instance by going to [http://localhost:8000/admin/](http://localhost:8000/admin/) and logging in with the credentials you created above with the `createsuperuser` command.

### React Setup

In a new tab from the one that's running `runserver` from the command above, `cd` into the react directory.

```
cd react
```

Make sure you have NPM installed. I recommend running `brew install node; npm install -g npm@latest` however there are other installation methods if you prefer.

Now, install React's dependencies.

```
mkdir -p .git
npm install
```

Run the React Development Server. 

```
npm run start
```

This will open a new browser tab to [http://localhost:3000](http://localhost:3000), where the React server is running. You can now use that port to access your Django pages/APIs as well, like [http://localhost:3000/admin/](http://localhost:3000/admin/). Make sure you still have your Django `runserver` running in another Terminal tab for the Django pages to be visible.

## Testing Locally

With the React development server and Django development server both running locally, the page will be available at [http://localhost:3000](http://localhost:3000).

In order to force the page to include an emotional agent and emotion priming, access the page via [http://localhost:3000?mightymorphin=true](http://localhost:3000?mightymorphin=true)

Once you complete the Wordle flow, you can check the data you created in the Django admin, by going to [http://localhost:3000/admin/](http://localhost:3000/admin/) and logging in with the credentials you created in the `createsuperuser` step.

## Modifying WordleLab

### Integration with Prolific

To recruit users from [Prolific](https://www.prolific.co/) make sure you link them to the page with the parameter `?prolific_pid=[PROLIFIC_PID]`. You must modify [StudyCompleteModal.tsx](react/src/components/modals/postsurvey/StudyCompletedModal.tsx) to use your Prolific code so your users will get credit for completing their task.

### Changing Emotional Priming

Edit the `PRIMING_EMOTIONS` list and `PRIMING_EMOTION_EXAMPLES` in [strings.ts](react/src/constants/strings.ts). It is recommended to leave `control` in the list, as that is the case when there is no emotional priming. Some included example emotions are: 'anger', 'sadness', 'surprise', 'happiness', 'disgust', 'fear', 'awe', 'love', 'gratitude', 'curiosity'.

Note that when a user first accesses the page, it will assign them a random priming emotion from the `PRIMING_EMOTIONS` list, and will randomly assign whether they have an emotional agent. Thus, if the `PRIMING_EMOTIONS` list has `n` categories in it, you will have `2n` buckets of users. Unless you have many participants, it's important to keep the `PRIMING_EMOTIONS` list to two or three elements at most (including `control`).

### Changing the Word List

Edit the `WORDS` list located in [wordlist.ts](react/src/constants/wordlist.ts). Note that the length of the list controls how many rounds of Wordle your users must complete. Note that, unlike normal Wordle, our word list is designed to be a static list that is the same for all users. We have also included lists of positive, negative, and neutral words that make good candidates.

### Changing the Emotional Agent's personality and lines

The emotional agent's behavior is defined in [react/src/lib/enhancedfeedback.ts](react/src/lib/enhancedfeedback.ts). The Teddy character comes with several built-in animations, defined in `FeedbackAnimation`. You may modify the `HELPFUL_TEDDY` object to change what Teddy says or the animations he performs on each trigger. Note that you can also define other "personality" objects based off of `HELPFUL_TEDDY` and return different personalities from the `getEmotionalFeedback()` function based off various circumstances such as round number or randomly decided user bucket (in which case, you'll want to copy `getHasEnhancedFeedback()` in [react/src/lib/localStorage.ts](react/src/lib/localStorage.ts) and make a similar function that determines what personality Teddy should use. Be sure to add a call to your new function in `getUserData()`!)

### Changing Pre-game or Post-game survey questions

All survey questions are located in Modal files in [react/src/compontents/modals/](react/src/compontents/modals/). You can modify the appropriate modal directly. To bypass a modal or insert your own, just copy how modals are handled in [react/src/App.tsx](react/src/App.tsx).

## License

Copyright 2022 MIT Media Lab Affective Computing Group

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## References

The Teddy character is copyright [JcToon at Rive](https://rive.app/community/2244-4463-animated-login-screen/) and is used under the Creative Commons license.

All React code and design is based off [React Wordle](https://github.com/cwackerfuss/react-wordle).

Wordle was created by [Josh Wardle](https://en.wikipedia.org/wiki/Josh_Wardle).

## Contact Us

If you have any questions, comments, or concerns, please contact us at [wordlelab@media.mit.edu](mailto:wordlelab@media.mit.edu).
