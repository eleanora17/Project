from visual_scripting.browser import browser_actions
from visual_scripting.core import  selenium_actions

import time

browser_actions.go_to_url("https://mail.google.com/")
time.sleep(5)
selenium_actions.fill_input("dcosta.eleanora@gmail.com","identifierId")
selenium_actions.click(element_text="Next")
time.sleep(5)
selenium_actions.fill_input("12345",element_attaribute_name='name',element_attaribute_value='Passwd')