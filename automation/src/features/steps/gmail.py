from behave import *
import time
from visual_scripting.browser import browser_actions


@Step('Compose mail and send to "{recipient}" "{subj}"')
def compose(context,recipient,subj):
    #browser_actions.sleepFor(5)
    time.sleep(10)
    browser_actions.click(element_text='Compose')
    time.sleep(5)
    browser_actions.fill_input(recipient,element_attribute_name='role',element_attribute_value='combobox')
    browser_actions.fill_input(subj,element_attribute_name='placeholder',element_attribute_value='Subject')
    browser_actions.fill_input("Automating Gmail",element_attribute_name='role',element_attribute_value='textbox')
    browser_actions.click(element_text='Send')
    time.sleep(5)
    