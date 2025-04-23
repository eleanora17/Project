Feature: College website

    Scenario Outline: Open Website
        Given Go to "<url>"
        And Click on "close"
        
        Examples:
            | url                          |
            | https://www.chowgules.ac.in/ |