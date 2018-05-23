There are a number of different validators available out-of-the-box that should cover a broad set of use cases.

The `VALIDATED` field definition is using all of these validators to control the number of characters that can be provided (`lengthIsGreaterThan` and `lengthIsLessThan`), that a numerical value provided falls within a range (`fallsWithinNumericalRange`) and that the value matches a Regular Expression pattern (`matchesRegex`) to prevent decimal places being used.

These validators are all configured within the `validWhen` definition. Messages are optional and defaults are provided (try removing the `message` attributes from the definition).

Finally note the use of the `trimValue` attribute. This trims whitespace from the value assigned to the form as well as the value passed to validation. Notice that you can add as many leading and trailing spaces to the value you enter and it still appears correctly in the form value.

In the future it will be possible to pass a custom validator as a prop to the `Form` component to cover any more complex or asynchronous validation use cases.
