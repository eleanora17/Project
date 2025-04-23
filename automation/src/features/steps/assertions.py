from behave import *
import time
from visual_scripting.browser import browser_actions


@Step('Verify email sent "{recipient}" "{subj}"')
def verify_sent(context,recipient,subj):
    browser_actions.click(element_text='Sent')
    time.sleep(3)
    browser_actions.click(element_text=subj)
    