from visual_scripting.browser import browser_actions
from visual_scripting.core import  selenium_actions

import time

browser_actions.go_to_url("https://mail.google.com/")
time.sleep(5)
browser_actions.fill_input('dcosta.eleanora@gmail.com',id='identifierId')
browser_actions.click(element_text='Next')
time.sleep(5)
browser_actions.fill_input('12345',element_attribute_name='name',element_attribute_value='Passwd')