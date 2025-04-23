Feature: Flipkart

    Scenario Outline: Login to Flipkart
        Given Go to "<url>"
        And Click on "Login"
        # And Click on "Enter Email/Mobile number"
        And Enter input "<ph_no>" in element with context="Enter Email/Mobile number"
        Then Click on "Request OTP"

        Examples:
            | url                       | ph_no      |
            | https://www.flipkart.com/ | 8390402562 |