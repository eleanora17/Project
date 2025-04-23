Feature: Login to Amazon

Scenario:
    Given Go to "www.amazon.com"
    And Click on "Sign in"
    And Click on "a-dropdown-button"
    And Click on "a-dropdown-button"
    # And Click on "Enter Email/Mobile number"
    And Enter input "<ph_no>" in element with context="Enter Email/Mobile number"
    Then Click on "Request OTP"