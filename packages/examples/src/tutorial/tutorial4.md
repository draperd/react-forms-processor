Some field types rely on having options available. There are a number of different ways in which options can be provided.

Field `OPTIONS1` shows options defined as a simple string array. This is the simplest way to define options and the value and label are the same.

It is possible to have different labels and values by using an object array as used by `OPTIONS2`. Also notice that it is possible to have groups of options with their own headings - however it is up to the renderer as to whether groupings are supported. For example if you change the `type` from `select` to `radiogroup` you will see that the headings are not displayed.
