**THIS EXAMPLE IS CURRENTLY BROKEN - FIX COMING SOON**

The reason why there is both an `id` attribute and a `name` attribute in the field definition is that there may be occasions when you want to use multiple fields to capture data a single value.

In this example the fields `DEFAULTS` and `CUSTOM` are both used to capture data for the `number` attribute. However they work together because `CUSTOM` is defines a rule so that it is only `visibleWhen` the `DEFAULTS` field has the value `OTHER`. The value it is assigned is not included when it is not displayed by setting `omitWhenHidden` to be `true`.

The `DEFAULTS` field uses the `omitWhenValueIs` attribute to ensure that when the user chooses to enter a custom value it does not modify the `number` attribute in the form value.
