from behave import *
import time
from visual_scripting.browser import browser_actions


@Step('Go to "{url}"')
def go_to_url(context,url):
    browser_actions.go_to_url(url)

@Step('Click on "{element}"')
def click(context,element):
    browser_actions.click(element_text=element)

@Step('Enter input "{value}" in element with context="{element_context}"')
def enter_input(context,value,element_context):
    browser_actions.fill_input(value,element_text=element_context)

@Step('Refresh current page')
def refresh_page(context):
    browser_actions.wait_for_page_load()
    browser_actions.refreshPage()
    browser_actions.wait_for_page_load()