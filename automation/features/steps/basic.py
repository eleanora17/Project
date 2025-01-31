from behave import *
from visual_scripting.browser import browser_actions

@Step('Go to "{url}"')
def go_to_url(context,url):
    browser_actions.go_to_url(url)
