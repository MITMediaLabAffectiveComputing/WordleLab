from django.db import models
import string, random
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from coolname import generate

class JsonField(models.TextField):
    pass


def key_generator(size=10, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


class BaseModel(models.Model):
    '''
    Base model from which all other models should inherit. It has a unique key and other nice fields
    '''
    id = models.AutoField(primary_key=True)
    key = models.CharField(max_length=64, unique=True, db_index=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    deleted_by_user = models.BooleanField(blank=True, default=False)

    def generate_key(self):
        if not self.key:
            for _ in range(10):
                key = key_generator(10)
                if not type(self).objects.filter(key=key).count():
                    self.key = key
                    break

    def save(self, *args, **kwargs):
        self.generate_key()
        super(BaseModel, self).save(*args, **kwargs)

    class Meta:
        abstract = True


class WordleLabAdminUser(AbstractUser):
    '''
    This is the user object that's used with the Django Admin Console. You can add extra fields if you want, but mostly it should be ignored.
    '''
    pass


class Participant(BaseModel):
    '''
    This model represents a user of the page. The front end uses local storage to keep track of its game state, and it generates the User ID there. It then calls the backend to log when that user has done various actions.
    '''
    user_id = models.CharField(max_length=64)
    user_agent = models.CharField(max_length=1024, blank=True)
    prolific_pid = models.CharField(max_length=64, blank=True)
    study_id = models.CharField(max_length=64, blank=True)
    experiment_id = models.CharField(max_length=64, blank=True)
    session_id = models.CharField(max_length=64, blank=True)
    wordle_play_frequency = models.CharField(max_length=64)
    native_english = models.BooleanField(blank=True)
    primed_emotion = models.CharField(max_length=64)
    has_enhanced_feedback = models.BooleanField(blank=True)
    emotionprime_1 = models.TextField()
    emotionprime_2 = models.TextField()
    presurvey_time = models.DateTimeField()
    presurvey_events = models.JSONField(blank=True, null=True, default=dict)
    end_arousal = models.CharField(max_length=64, blank=True)
    end_valence = models.CharField(max_length=64, blank=True)
    baseballcost = models.CharField(max_length=64, blank=True)
    widgettime = models.CharField(max_length=64, blank=True)
    lakedays = models.CharField(max_length=64, blank=True)
    postsurvey_time = models.DateTimeField(blank=True, null=True)
    postsurvey_events = models.JSONField(blank=True, null=True, default=dict)
    did_start_bonus_rounds = models.BooleanField(blank=True, default=False)

    def generate_key(self):
        if not self.key:
            for _ in range(20):
                key = ''.join(x.capitalize() for x in generate())
                if not type(self).objects.filter(key=key).count():
                    self.key = key
                    break

    def __str__(self):
        return self.key


class GuessEvent(models.Model):
    '''
    This represents an attempted Wordle guess. It could be a correct word, incorrect word, or even an invalid word.
    '''
    id = models.AutoField(primary_key=True)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name="guesses")
    guess = models.CharField(max_length=64)
    guesses = models.JSONField()
    guess_index = models.PositiveIntegerField()
    round_index = models.PositiveIntegerField()
    was_valid = models.BooleanField(blank=True)
    solution = models.CharField(max_length=64)
    remote_timestamp = models.DateTimeField()
    server_time = models.DateTimeField()

    def __str__(self):
        return f"{self.participant} - {self.round_index}|{self.guess_index}"


class RoundCompleteEvent(models.Model):
    '''
    This represents the time and game state when a user successfully completes a round of Wordle.
    '''
    id = models.AutoField(primary_key=True)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name="rounds")
    guesses = models.JSONField()
    feedback_log = models.JSONField()
    guess_count = models.IntegerField()
    round_index = models.PositiveIntegerField()
    solution = models.CharField(max_length=64)
    did_win = models.BooleanField(blank=True)
    was_bonus_round = models.BooleanField(blank=True)
    remote_timestamp = models.DateTimeField()
    server_time = models.DateTimeField()

    def __str__(self):
        return f"{self.participant} - {self.round_index}"
