# Charts
This site features many charts which are fundamental to the reporting features of Barista as a whole. Our charts are from the [ngx-charts](https://github.com/swimlane/ngx-charts) library which provides an Angular wrapper to specific D3 charts. Through this page, we'll cover the following:

* [Why we're using ngx-charts](#1)
* [The locations of the charts and pages that use them](#2)
* [Adding a new chart to the project](#3)
* [Creating the chart template in HTML](#4)
* [Implementing the chart in other areas of the site](#5)

<a name="1"> </a>
## Why ngx-charts?
ngx-charts was chosen due to it being open source. This is invaluable to the Barista project. It was used over just D3 or other chart libraries because it allowed us to write everything natively in Angular TypeScript and not in JavaScript. ngx-charts also seems to be actively maintained and widely used. We're using other swimlane products across this project as well. 

<a name="2"> </a>
## Location:
All charts are stored inside the web component (barista-web). They can be found at (`barista-web/src/shared/app-components/charts/...`). 

Examples of charts on our site can be found on the Home page (`barista-web/src/app/features/home/...`) and on the Project stats page (`barista-web/src/app/features/projects/project-details/project-stats/...`).

---

<a name="3"> </a>
## Adding a new chart:
If you want to add functionality to the page for a chart that currently doesn't exist, that is also supported by ngx-charts, here is what you should do. 

Familiarize yourself with how the other charts are organized, pay specific attention to how they implement the `chart-base` component. `chart-base` will be the foundation for your chart. When you have a grasp of the page and have looked at `chart-base`, we can create a new folder to store your chart in. 

### Creating the component:

> `ng g c <component-name> --module=app`

Running this command uses Angular's CLI, `ng`, to `g`enerate a new `c`omponent called \<component-name> and then routes it to the correct spot by specifying that it belongs to the module 'app'. When filling in your component's name, do not use the < > in the command. Here's an example command that was used to create the `gauge-chart` component:

> `ng g c gauge-chart --module=app`

This creates the following:

* gauge-chart/
  - gauge-chart.component.html
  - gauge-chart.component.scss
  - gauge-chart.component.ts
  - gauge-chart.component.spec.ts

Everything should be properly routed to the module at this point. 

### Implementing chart-base:

In order to reduce the overall footprint of the charts, we implemented redundant features to be inherited from `chart-base`. Here are the three main changes you need to do to extend functionality from `chart-base`:

1. Import chart base at the top of your code
   - `import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';`
2. Add `chart-base` stylesheet to the styleUrls array
    - `'../chart-base/chart-base.component.scss'`
3. Extend `chart-base` into your component
    - `export class MyChartComponent extends ChartBaseComponent`

Doing these steps should now give you access to the variables set in `chart-base`. 

### Adding chart-specific features:

Many charts have different possible variables that they can take in. We've taken the most common ones and pulled them into `chart-base`. It's important to note that you don't need to implement **all** of the possible variables that ngx-charts provides functionality for. Use your best judgement on what you believe you'll need to provide a flexible chart with only the functionality that we need. 

The best way to handle chart variables for this project has been to use `@Input()` decorators, by doing this we can pass input into our charts from our HTML templates. Use these decorators for anything that needs to be variable across the charts. If it doesn't need to be variable, assigning a value to a variable in the `.component.ts` file should be adequate. Things like title, data, and any specific fields that will change are examples of things that should use `@Input()`. 

---

<a name="4"> </a>
## Creating a chart in HTML:
The HTML for a chart is not inherited from `chart-base`, but is created as a template inside the chart's folder. Create the template in the template file specified by your component. We should be using the following lines regardless of our chart:

> `<div *ngIf="data && data.length >= 1" class="chart-container">`
>
> `<div class="chart">`

These should be closed as well. Look at an existing chart's HTML for an example of these two lines in use. They are needed to assign the SCSS formatting from `chart-base` to the chart and to assure that our charts have data in them before rendering. 

Following this, we need to get the chart selector. This is received from the ngx-charts documentation page. They will have an example template that you can take the selector for the chart from. they usually look something like `ngx-charts-chart-type`. Put that inside the divs, ensuring that everything is closed. We can then use the angular input tag to input our variables into the graph.

> `[results]="data"`

This is a line that should appear in all of our graphs. `[results]` is accessing the variable inside the ngx-charts selector and `"data"` is the variable from our chart's `component.ts` file. Our variables names don't necessarily matter, however using consistent names as to what already exists will ensure that we have no more problems with implementation. 

Once the HTML is filled out and all our variables are passed in to the ngx-charts template we're done implementing a chart! Past this, we will talk about implementing this chart elsewhere. Once you implement this chart, some of the things that we were doing to implement the ngx-charts selector will become more clear. 

---

<a name="5"> </a>
## Implementing our chart elsewhere:
For an example of where we implement our charts, see the introduction section. I'll be using the Home page as the primary example.

 Because we successfully routed our new component by using `--module=app` in our creation command, we shouldn't have to use any other imports to get access to our charts. They should be automatically exposed because of that command. 

 We can start using our charts by calling its selector which you can see in the chart's `component.ts` file; for example, the gauge chart's is 'app-gauge-chart', yours should look pretty similar. We can call that selector in the HTML element that we're implementing it in. 

 > \<app-my-chart> \</app-my-chart>

 Using this selector, our chart template will render. The only other thing we'll need to do is pass in all the variables for our `@Input()` variables. This is done as options inside the selctor tag. 

 > \<app-my-chart
 > [data]="data"
 > [xAxisLabel]="'Label:'"
 > [yAxisLabel]="'Other Label:'"
 > \> \</app-my-chart>

 Notice how if I pass in a string literal, they need to be wrapped with single quotes inside the double quotes. It's important to remember that while it may seem like strings are being passed in, it's really other things that are being injected. So `data` is a variable being passed in, if we were using something like `(click)` to handle certain events, we may want to pass in a function like `"doSomething()"`.

 By doing this, we can call the selector for our chart with the specific inputs we need, which will call the ngx-charts selector with the inputs that they need, from which magic happens. 

 After you do all this, consider styling the charts and assuring their sizing using SCSS. The charts are set up currently to size dynamically, and as such you need to have a rigid (somewhat defined) layout so that the charts can be flexible across different screen sizes and also not take up too much space.
