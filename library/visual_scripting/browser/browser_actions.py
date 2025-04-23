from visual_scripting.core import selenium_actions
from visual_scripting.common import initialize
from visual_scripting.utils import utils
import logging

global driver
    

def go_to_url(url:str, browser="firefox"):
    global driver
    driver=initialize.setup(browser)
    selenium_actions.get_url(url)

def click(element=None,id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
   logging.info(f"Clicking on element with text='{element_text}'")
   selenium_actions.click(element,id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)

def fill_input(value, id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
    selenium_actions.fill_input(value,id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)

def sleepFor(time_seconds):
    selenium_actions.sleep(time_seconds)

def wait_for_page_load(time):
    selenium_actions.wait_for_page_load(time)

def refrehPage():
    selenium_actions.refreshPage()