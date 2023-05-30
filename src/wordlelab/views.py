from django.http import HttpResponse, Http404
import os
import openai
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
from django.utils import timezone
from django.shortcuts import get_object_or_404
from wordlelab.models import Participant, GuessEvent, RoundCompleteEvent
import requests

@csrf_exempt
def presurvey(request):
    '''
    This API endpoint is called once the pre-game survey is complete. It updates the user object with the data entered in the form, or creates a user object if one isn't found.
    '''
    user_id = request.POST.get("user_id")
    prolific_pid = request.POST.get("prolific_pid")
    study_id = request.POST.get("study_id")
    experiment_id = request.POST.get("experiment_id")
    session_id = request.POST.get("session_id")
    wordle_play_frequency = request.POST.get("wordleplayfrequency")
    native_english = request.POST.get("nativeenglish") == "yes"
    emotionprime_1 = request.POST.get("emotionprime1")
    emotionprime_2 = request.POST.get("emotionprime2")
    primed_emotion = request.POST.get("primed_emotion")
    has_enhanced_feedback = request.POST.get("has_enhanced_feedback") == "true"
    presurvey_events = request.POST.get("presurvey_events")

    try:
        participant = Participant.objects.get(user_id=user_id)
    except Participant.DoesNotExist:
        participant = Participant(user_id=user_id)

    participant.user_agent = request.META.get('HTTP_USER_AGENT', '')
    participant.prolific_pid = prolific_pid or participant.prolific_pid
    participant.study_id = study_id or participant.study_id
    participant.experiment_id = experiment_id or participant.experiment_id
    participant.session_id = session_id or participant.session_id
    participant.wordle_play_frequency = wordle_play_frequency
    participant.native_english = native_english
    participant.emotionprime_1 = emotionprime_1
    participant.emotionprime_2 = emotionprime_2
    participant.primed_emotion = primed_emotion
    participant.has_enhanced_feedback = has_enhanced_feedback
    participant.presurvey_time = datetime.datetime.now(tz=timezone.utc)
    participant.presurvey_events = json.loads(presurvey_events)
    participant.save()
    result = dict(success=True)
    return HttpResponse(json.dumps(result))

@csrf_exempt
def postsurvey(request):
    '''
    This API endpoint is called once the post-game survey is complete. It updates the user object with the data entered in the form, or creates a user object if one isn't found.
    '''
    user_id = request.POST.get("user_id")
    arousal = request.POST.get("arousal")
    valence = request.POST.get("valence")
    baseballcost = request.POST.get("baseballcost")
    widgettime = request.POST.get("widgettime")
    lakedays = request.POST.get("lakedays")
    postsurvey_events = request.POST.get("postsurvey_events")

    participant = get_object_or_404(Participant, user_id=user_id)
    participant.baseballcost = baseballcost
    participant.widgettime = widgettime
    participant.lakedays = lakedays
    participant.end_valence = valence
    participant.end_arousal = arousal
    participant.postsurvey_time = datetime.datetime.now(tz=timezone.utc)
    participant.postsurvey_events = json.loads(postsurvey_events)
    participant.save()

    result = dict(success=True)
    return HttpResponse(json.dumps(result))

@csrf_exempt
def log_guess(request):
    '''
    This API endpoint is called every time the user makes a guess, regardless if it's correct or even a valid word.
    '''
    user_id = request.POST.get("user_id")
    guess = request.POST.get("guess")
    guesses = request.POST.get("guesses")
    was_valid = request.POST.get("wasValid") == "true"
    round_index = request.POST.get("roundIndex")
    solution = request.POST.get("solution")
    timestamp = request.POST.get("timestamp")
    prompt = request.POST.get("prompt")
    ai_text_status = request.POST.get("ai_text_status")

    def askGPT(text):
        openai.api_key = API_KEY
        response = openai.ChatCompletion.create(model="gpt-4-0314", messages=[{"role": "user", "content": text}])
        resp = response.choices[0]["message"]["content"]
        resp = resp.split(" ")
        for i in range(len(resp), 0):
            if resp[i][0] == "\\":
                resp.pop(i)
        resp = " ".join(resp)

        return resp


    participant = get_object_or_404(Participant, user_id=user_id)
    guess_count = len(json.loads(guesses))

    if ai_text_status == 'true':
        teddy_response = askGPT(prompt)
    else:
        teddy_response = prompt

    event = GuessEvent(
        participant=participant,
        guess=guess,
        guesses=json.loads(guesses),
        guess_index=guess_count,
        round_index=round_index,
        was_valid=was_valid,
        solution=solution,
        remote_timestamp=timezone.make_aware(datetime.datetime.fromtimestamp(int(timestamp) / 1000.0), timezone.utc),
        server_time=datetime.datetime.now(tz=timezone.utc),
        teddy_response = teddy_response
    )
    event.save()


    return HttpResponse(json.dumps(teddy_response))

@csrf_exempt
def log_round_end(request):
    '''
    This API endpoint is called every time the user completes a round, either by winning or losing. It logs all the data pertaining to that round.
    '''
    user_id = request.POST.get("user_id")
    guesses = request.POST.get("guesses")
    feedback_log = request.POST.get("feedbackLog")
    did_win = request.POST.get("didWin") == "true"
    round_index = request.POST.get("roundIndex")
    solution = request.POST.get("solution")
    was_bonus_round = request.POST.get("wasBonusRound") == "true"
    timestamp = request.POST.get("timestamp")

    participant = get_object_or_404(Participant, user_id=user_id)
    guess_count = len(json.loads(guesses))

    event = RoundCompleteEvent(
        participant=participant,
        guesses=json.loads(guesses),
        feedback_log=json.loads(feedback_log),
        guess_count=guess_count,
        round_index=round_index,
        solution=solution,
        did_win=did_win,
        was_bonus_round=was_bonus_round,
        remote_timestamp=timezone.make_aware(datetime.datetime.fromtimestamp(int(timestamp) / 1000.0), timezone.utc),
        server_time=datetime.datetime.now(tz=timezone.utc)
    )
    event.save()

    result = dict(success=True)
    return HttpResponse(json.dumps(result))


@csrf_exempt
def log_started_bonus_rounds(request):
    '''
    This API endpoint simply updates a user object to mark that they opted to start bonus rounds after they finished the post-game survey and could otherwise leave.
    '''
    user_id = request.POST.get("user_id")

    participant = get_object_or_404(Participant, user_id=user_id)
    participant.did_start_bonus_rounds = True
    participant.save()

    result = dict(success=True)
    return HttpResponse(json.dumps(result))
