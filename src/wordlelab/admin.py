from django.db import models
from django.contrib import admin
import json
from .models import WordleLabAdminUser, Participant, GuessEvent, RoundCompleteEvent
from django.contrib.admin.widgets import AdminTextareaWidget
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm


class SerializedFieldWidget(AdminTextareaWidget):
    def render(self, name, value, attrs=None, renderer=None):
        return super(SerializedFieldWidget, self).render(name, json.dumps(json.loads(value), indent=4) if value else None, attrs, renderer)


def register(model):
    def inner(admin_class):
        admin.site.register(model, admin_class)
        return admin_class

    return inner


class GuessEventInline(admin.TabularInline):
    can_delete = False
    show_change_link = True
    extra = 0
    fields = ("server_time", "guess", "solution", "round_index", "guess_index", "was_valid")
    readonly_fields = ("server_time", "guess", "was_valid", "round_index", "guess_index", "solution")
    model = GuessEvent


class RoundCompleteEventInline(admin.TabularInline):
    can_delete = False
    show_change_link = True
    extra = 0
    fields = ("round_index", "guess_count", "did_win", "solution", "was_bonus_round")
    readonly_fields = ("round_index", "guess_count", "did_win", "solution", "was_bonus_round")
    model = RoundCompleteEvent


@register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ("key", "prolific_pid", "study_id", "session_id", "presurvey_time", "postsurvey_time")
    exclude = ("deleted_by_user",)
    readonly_fields = ('key',)
    search_fields = ('key', 'user_id', "study_id", "prolific_pid", "session_id")
    actions_on_top = True

    inlines = [
        RoundCompleteEventInline,
        GuessEventInline,
    ]

    formfield_overrides = {
        models.JSONField: {'widget': SerializedFieldWidget},
    }

@register(GuessEvent)
class GuessEventAdmin(admin.ModelAdmin):
    list_display = ("participant", "server_time", "guess", "solution", "was_valid", "round_index", "guess_index")
    search_fields = ('participant__user_id', "guess")
    actions_on_top = True

    formfield_overrides = {
        models.JSONField: {'widget': SerializedFieldWidget},
    }


@register(RoundCompleteEvent)
class RoundCompleteEventAdmin(admin.ModelAdmin):
    list_display = ("participant", "round_index", "guess_count", "did_win", "solution", "was_bonus_round")
    search_fields = ('participant__user_id',)
    actions_on_top = True

    formfield_overrides = {
        models.JSONField: {'widget': SerializedFieldWidget},
    }


class WordleLabUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = WordleLabAdminUser


@register(WordleLabAdminUser)
class WordleLabUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display
    form = WordleLabUserChangeForm

    fieldsets = UserAdmin.fieldsets


