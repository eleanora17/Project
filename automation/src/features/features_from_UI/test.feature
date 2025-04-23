Feature: test

  Scenario: Login
    Given login with "eleanora.dcosta@gmail.com" "12345"
    Then Click "<item>"

  Scenario: Crate order
    Given Click "<item>"

  Scenario: Create customer
    Given Create Customer with name="<customer_name>", avoid create=<flag>

