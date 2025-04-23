Feature: Gmail compose mail

    Scenario Outline: Login to Gmail
        Given Go to "<url>"
        When login "<Email>" "<pwd>"

        Examples:
            | url                      | Email                    | pwd        |
            | https://mail.google.com/ | dcostaeleanora@gmail.com | gmail12345 |

    Scenario: Compose and send mail
        When Compose mail and send to "ele171102@gmail.com" "This is a test subj"

        