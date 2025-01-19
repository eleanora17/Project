from behave import *
from visual_scripting.browser import browser_actions

@step('login')
def login(context):
    browser_actions.go_to_url("https://mail.google.com/")
