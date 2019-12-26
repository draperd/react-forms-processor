Some REST APIs may require that you pass the changes to a field. In the case of a multiselect (or similar) field you may want to pass the fields that have been addded and removed. This can be done by setting `useChangesAsValues` to be `true`.

This will split the `name` value into two separate attributes in the form value to capture the values added and removed. By default the suffices `_added` and `_removed` will be appended to the `name` - however you can provide your own suffices through the `addedSuffix` and `removedSuffix` attributes. Try changing the values in the definition to see how it updates the output value.

You can also provide a `valueDelimiter` to convert string values into arrays and vice-versa. Any string can be used as the delimiter. Note that the `defaultValue` should use the same delimiter as shown in the initial definition.
