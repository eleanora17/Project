from visual_scripting.core import selenium_actions
from visual_scripting.common import initialize


global driver
    

def go_to_url(url:str, browser="firefox"):
    global driver
    driver=initialize.setup(browser)
    selenium_actions.get_url(url)

def click(id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
   selenium_actions.click(id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)

def fill_input(value, id=None, xpath=None, element_text=None, element_attaribute_name=None, element_attribute_value=None, element_tag=None):
    selenium_actions.fill_input(id, xpath, element_text, element_attaribute_name, element_attribute_value, element_tag)