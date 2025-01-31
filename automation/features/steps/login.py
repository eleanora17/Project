from behave import *
from visual_scripting.browser import browser_actions
from visual_scripting.core import selenium_actions
import time

@step('login "{Email}" "{pwd}"')
def login(context,Email,pwd):
    browser_actions.fill_input(Email,id='identifierId')
    browser_actions.click(element_text='Next')
    browser_actions.sleepFor(time_seconds=5)
    browser_actions.fill_input(pwd,element_attribute_name='name',element_attribute_value='Passwd')
    browser_actions.click(element_text='Next')