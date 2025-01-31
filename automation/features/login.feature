Feature: test

    Scenario Outline: test 1
        Given Go to "<url>"
        When login "<Email>" "<pwd>"

        Examples:
        |url |Email|pwd|
        | https://mail.google.com/ | dcostaeleanora@gmail.com | gmail12345 |