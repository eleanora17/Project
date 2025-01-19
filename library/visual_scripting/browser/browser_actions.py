from visual_scripting.core import selenium_actions
from visual_scripting.common import initialize

def go_to_url(url:str, browser="firefox"):
    initialize.setup(browser)
    selenium_actions.get_url(url)