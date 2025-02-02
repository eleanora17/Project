Feature: Workflow_Gmail

    Scenario Outline: Login to Gmail
        Given Go to "<url>"
        When login "<Email>" "<pwd>"

        Examples:
        |url |Email|pwd|
        | https://mail.google.com/ | dcostaeleanora@gmail.com | gmail12345 |

    Scenario Outline: Compose and send mail
        When Compose mail and send to "<recipient>"
        #Then Verify email sent to "<recipient>"

        Examples:
        |recipient|
        | ele171102@gmail.com|