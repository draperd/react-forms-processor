Some field types rely on having options available. There are a number of different ways in which options can be provided.

Field `OPTIONS1` shows options defined as a simple string array. This is the simplest way to define options and the value and label are the same.

It is possible to have different labels and values by using an object array as used by `OPTIONS2`. Also notice that it is possible to have groups of options with their own headings - however it is up to the renderer as to whether groupings are supported. For example if you change the `type` from `select` to `radiogroup` you will see that the headings are not displayed.

Finally there is the advanced option of providing your `Form` component with an `OptionsHandler` prop that is a function that can handle more complex cases for options. These might include building options that are dependant upon the value of other fields or making XHR requests for actions. The `OPTIONS3` field is using this - note that it does **not** specify any options in the definition - if it did, this would block the handler from being used. This example is fetching data from SWAPI.
