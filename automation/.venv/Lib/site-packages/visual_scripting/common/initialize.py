from selenium import webdriver
from visual_scripting import core


def setup(browser='chrome'):
    if core.driver is None:
        if browser == 'chrome':
            core.driver = webdriver.Chrome()
        elif browser == 'firefox':
            core.driver = webdriver.Firefox()
        elif browser == 'edge':
            core.driver = webdriver.Edge()
        return core.driver
    else:
        return core.driver

def get_driver(browser='Firefox'):
    if core.driver is not None:
        return core.driver
    else:
        core.driver=setup(browser)

def teardown():
    core.driver.quit()
