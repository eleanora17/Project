from visual_scripting.common import initialize
from selenium.webdriver.common.by import By


global driver

def get_url(url):
    global driver
    driver=initialize.get_driver()
    driver.get(url)

def refresh():
    driver.refresh()

def find_element(id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
    if id:
        return driver.find_element(By.ID,id)
    if xpath:
        return driver.find_element(By.XPATH,xpath)
    elif(element_text !=None and element_attribute_name!=None and element_attribute_value!=None and element_tag!=None):
        xpath = f"//{element_tag}[text()='{element_text}' and @{element_attribute_name}='{element_attribute_value}']"
        return driver.find_element(By.XPATH,xpath)
    elif(element_text !=None  and element_attribute_value!=None and element_tag!=None):
        xpath = f"//{element_tag}[text()='{element_text}' and @*='{element_attribute_value}']"
        return driver.find_element(By.XPATH,xpath)
    elif(element_text !=None  and element_tag!=None):
        xpath = f"//{element_tag}[text()='{element_text}']"
        return driver.find_element(By.XPATH,xpath)
    elif(element_attribute_name!=None and element_attribute_value!=None):
        xpath = f"//*[@{element_attribute_name}='{element_attribute_value}']"
        return driver.find_element(By.XPATH,xpath)      
    elif(element_attribute_name!=None and element_attribute_value!=None and element_text!=None):
        xpath=f"//*[@{element_attribute_name}='{element_attribute_value}' and text()='{element_text}']"
        return driver.find_element(By.XPATH,xpath)
    elif(element_text !=None):
        xpath = f"//*[text()='{element_text}']"
        return driver.find_element(By.XPATH,xpath)
    else:
        raise("Please provide valid inputs")
        
def click(id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
    element = find_element(id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)
    element.click()


def fill_input(value, id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
    element = find_element(id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)
    return element.send_keys(value)


    