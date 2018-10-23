Sometimes it is necessary to create more complex validations where the validity of a field is linked to the values assigned to other fields.

In this example the `NAME` field must be less than 5 characters long when the `LENGTH_REQUIREMENTS` field is 'Small'. This has been defined as the `NAME` field is only valid when either the `LENGTH_REQUIREMENTS` field is either 'Medium' or 'Large' or the `NAME` field has less than 5 characters.
