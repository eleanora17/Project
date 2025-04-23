from behave import *
from visual_scripting.browser import browser_actions
from visual_scripting.core import selenium_actions
import time
# from OQA.browser import bactions

@step('login "{Email}" "{pwd}"')
def login(context,Email,pwd):
    # bactions.veryPresenceOfElement('identifierId')
    browser_actions.fill_input(Email,id='identifierId')
    browser_actions.click(element_text='Next')
    browser_actions.sleepFor(time_seconds=5)
    browser_actions.fill_input(pwd,element_attribute_name='name',element_attribute_value='Passwd')
    browser_actions.click(element_text='Next')

@Step('Login to google with "{email}" and "{password}"')
def login(context,email,password):
    browser_actions.click(element="Sign in")
    browser_actions.click(element_text="Use another account")
    browser_actions.fill_input(email,id='identifierId')
    browser_actions.click(element_text='Next')
    browser_actions.sleepFor(time_seconds=5)
    browser_actions.fill_input(password,element_attribute_name='name',element_attribute_value='Passwd')
    browser_actions.click(element_text='Next')
