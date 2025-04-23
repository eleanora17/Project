from visual_scripting.common import initialize
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common import StaleElementReferenceException, NoSuchElementException
from selenium.webdriver import ActionChains,Keys
from selenium.common.exceptions import TimeoutException


global driver
global wait
global global_timeout
global action_chains

def init_global_params():
    global wait
    global global_timeout
    global action_chains

    global_timeout=20
    wait=WebDriverWait(driver,global_timeout)
    action_chains=ActionChains(driver)

def get_url(url):
    global driver
    driver=initialize.get_driver()
    init_global_params()
    driver.maximize_window()
    driver.get(url)

def refresh():
    driver.refresh()

def find_element(element=None,id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
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
    elif(element):
        xpath = f"//*[@*='{element}']"
        return driver.find_element(By.XPATH,xpath)
    else:
        raise("Please provide valid inputs")
        
def click(element=None,id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
    element = find_element(element,id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)
    element.click()
    

def fill_input(value, id=None, xpath=None, element_text=None, element_attribute_name=None, element_attribute_value=None, element_tag=None):
    element = find_element(id, xpath, element_text, element_attribute_name, element_attribute_value, element_tag)
    return element.send_keys(value)

  
def wait_for_page_load(wait=15)-> bool:
    attempt=0
    retry=True
    while (retry) and (attempt < wait):
        try:
            if execute_javascript("return document.readyState")=="complete":
                loader=find_element(xpath="//*[@*='loading']")
                if loader and len(loader)>0:
                    retry=True
                else:
                    retry=False
        except NoSuchElementException:
            retry=True
        sleep(1)
        attempt+=1
    return True

def sleep(time=60):
    t=1
    while t<=time:
        print(f"Sleeping {t}/{time}",end="\r",flush=True)
        t+=1 

def wait_for_presence_of_element(element_id='', element_xpath='', total_attempt=1):
    wait_for_page_load()
    attempt = 1
    while True:
        # __exe_logger.info(f"attempt:{attempt}, Waiting for presence of element. ")
        try:
            if element_id != '':
                element = wait.until(EC.presence_of_element_located((By.ID, element_id)))
                return element
            elif element_xpath != '':
                element = wait.until(EC.presence_of_element_located((By.XPATH, element_xpath)))
                return element
        except (StaleElementReferenceException, NoSuchElementException, TimeoutException):
            pass
        if attempt == total_attempt:
            return None
        attempt += 1
        sleep(1)


def execute_script(action_to_perform, element):
    driver.execute_script("arguments[0]." + action_to_perform + "", element)

 
def execute_javascript(action, element=None):
    return driver.execute_script(action, element)

def clickElement(element):
    action_chains.move_to_element(element).click().perform()


def explicitWaitForElementPresence(element_id='', element_xpath='', timeout=30):
    explicit_wait = WebDriverWait(driver, timeout)
    try:
        if element_id != '':
            element = explicit_wait.until(EC.presence_of_element_located((By.ID, element_id)))
            return element
        elif element_xpath != '':
            element = explicit_wait.until(EC.presence_of_element_located((By.XPATH, element_xpath)))
            return element
    except (StaleElementReferenceException, NoSuchElementException, TimeoutException):
        return None


def explicitWaitForElementClickable(element_id='', element_xpath='', timeout=30):
    explicit_wait = WebDriverWait(driver, timeout)
    try:
        if element_id != '':
            element = explicit_wait.until(EC.element_to_be_clickable((By.ID, element_id)))
            return element
        elif element_xpath != '':
            element = explicit_wait.until(EC.element_to_be_clickable((By.XPATH, element_xpath)))
            return element
    except (StaleElementReferenceException, NoSuchElementException, TimeoutException):
        return None


def explicitWaitForElementInvisibility(element_id='', element_xpath='', timeout=30):
    explicit_wait = WebDriverWait(driver, timeout)
    try:
        if element_id != '':
            element = explicit_wait.until(EC.invisibility_of_element_located((By.ID, element_id)))
            return element
        elif element_xpath != '':
            element = explicit_wait.until(EC.invisibility_of_element_located((By.XPATH, element_xpath)))
            return element
    except (StaleElementReferenceException, NoSuchElementException, TimeoutException):
        return None

def refreshPage():
    driver.refresh()