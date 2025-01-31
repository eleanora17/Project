from behave import *
from visual_scripting.browser import browser_actions
from visual_scripting.core import selenium_actions
import time

@step('login "{Email}" "{pwd}"')
def login(context,Email,pwd):
    selenium_actions.fill_input(Email,id='identifierId')
    selenium_actions.click(element_text='Next')
    time.sleep(5)
    selenium_actions.fill_input(pwd,element_attribute_name='name',element_attribute_value='Passwd')
    selenium_actions.click(element_text='Next')