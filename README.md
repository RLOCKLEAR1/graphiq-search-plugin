# Graphiq Search Plugin

The Graphiq Search plugin gives you programmatic access to billions of visualizations from Graphiq's knowledge graph.

Best of all, integration is dead simple–adding a single file to your page and a few lines of code exposes all of the search and contextual matching functionality.

To get an API Key, please [get in touch with us](https://www.graphiq.com/plugins).

##Table of Contents

1. [Getting the Plugin](#getting-the-plugin)
2. [Using the Plugin](#using-the-plugin)
3. [CKEditor Integration](#ckeditor-integration)
4. [API Reference](#api-reference)
5. [Frequently Asked Questions](#frequently-asked-questions)

----

##Getting the plugin

Grab the Graphiq Search Plugin API by adding a single JavaScript file to your page

```html
<script src="https://cdn1.graphiq.com/rx/plugin/1/bundle.js"></script>
```

This file should be included wherever you wish to provide access to Graphiq Search, generally this is the Add/Edit Post page in a traditional CMS.

**Note** We recommend loading the plugin from our CDN to get the latest changes and bug fixes, but feel free to host the plugin yourself if you wish–we'll notify you of new major versions and important bug fix releases.

##Using The Plugin

Now that the Plugin API has been added to the page, we'll provide a simple example to demonstrate how it works.

Below is an example of a CMS where we've integrated a button to launch Graphiq Search.

![](https://dl.dropboxusercontent.com/u/10112297/ss/ScreenShot2015-01-07at9.13.28PM.png)

Your team has complete flexibility on when and how Graphiq Search is launched within your CMS–we suggest adding a button like the one pictured above as a simple solution.

From there, clicking the button will pass the contents of the post to our plugin, so we can do the heavy lifting and begin returning visualizations based on your post

![screen shot 2015-04-30 at 6 39 15 pm](https://cloud.githubusercontent.com/assets/875591/7425594/5e0d45f2-ef68-11e4-9687-f57e73953296.png)

When a visualizations is selected, our plugin will pass an embed code back to you, which can then be inserted into your post

The code below demonstrates the minimum amount of code required to achieve integration of the plugin as shown above. We suggest looking through some of the more detailed examples later in this document to see detailed examples of how to integrate with popular CMS editors and a full list of plugin options.

```js
var graphiqSearch = new GraphiqSearch({
    // Place your API key here
    key: 'YOUR_API_KEY',

    // Specify a function which returns the post contents
    text: function() {
        return editor.getText();
    }
});

// When content has been selected, insert it into the post
graphiqSearch.on('select', function(result) {
    editor.insert(result.code);
});

// Show the Graphiq Search interface when the plugin button is clicked
$('#your-button').click(function(){
  graphiqSearch.show();
});
```

##CKEditor Integration

The Graphiq Search Plugin makes it easy to integrate with CKEditor, which is a popular web text editor used in many content management systems. Attaching a CKEditor to a Graphiq Search instance automatically inserts a button to launch the search interface, and also handles inserting content back into your post when something is selected.

```js
CKEDITOR.replace('myEditor', {
  extraPlugins: 'graphiq-search-plugin',
  allowedContent: true
});

var graphiqSearch = new GraphiqSearch({ ... });
graphiqSearch.attachEditor(CKEDITOR.instances.myEditor);
```


##API Reference

####Constructor

```js
new GraphiqSearch(options:object)
```

Creates a new search instance using the specified options (see below for a full list of supported options).

####Options


| option      | type             | description                                                                                                                                                                |
|-------------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *key*       | `string`         | **[REQUIRED]** The plugin API Key you were given                                                                                                                           |
| *userID*    | `string`         | **[REQUIRED]** A string that uniquely identifies the current user of the plugin (generally username or user ID). Our ranking algorithm will learn which types of content each author likes, and improve recommendations for that author over time. |
| *userEmail* | `string`         | **[REQUIRED]** The email address for the current user of the plugin. This will **only** be used prefill signup and custom request forms, it will not be used without the users consent. |
| *text*      | `function`       | A callback function that returns the **contents** of the post as a `string`.                                                                                               |
| *title*     | `function`       | A callback function that returns the **title** of the post as a `string`.                                                                                                  |
| *tags*      | `function`       | A callback function that returns any **tags** associated with the post as an `array` of `strings`.                                                                         |
| *mode*      | `string`         | The interface mode that the plugin will use–either `modal`, `sidebar`, or `container`. By default this is set to `modal`.                                                  |
| *container* | `HTMLElement`    | If `mode` is set to `'container'`, this is the DOM element that the search interface will be rendered into                                                           |
| *color* | `string`    | Customize the theme of your visuals by passing a hexadecimal color here (ex: `#3498db`) |
| *embedType* | `string`    | Graphiq offers two types of embed codes–an `<iframe>`-based code and a `<script>`-based code. We provide the iframe version by default, but some people prefer to use a script for compatibility and responsive reasons. Pass `'iframe'` or `'script'` here to choose which type of embed code you prefer.|
| *locale* | `string` | The preferred language to use for our search interface (ex: 'en_US'). Note: Not every language is available.|

Each of the options above has a corresponding `get` and `set` method

####Methods

| method                                          | description                                                                                                                                                                                                                                                           |
|-------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `show()`                                        | Shows the Graphiq Search interface                                                                                                                                                                                                                                    |
| `hide()`                                        | Hides the Graphiq Search interface                                                                                                                                                                                                                                    |
| `search([ query:string])`                                      | Manually trigger a new search. If an existing search interface is open, results will be shown there, otherwise a new one will be created. By default this will pull the query from the `text` callback, but you can also pass an optional string `query` to trigger a specific search query.                                                                                                                     |
| `on(event:string, callback:function)`           | Adds an event listener for the specified event. See below for a list of all events                                                                                                                                                                                    |
| `off([event:string], [callback:function])`      | Removes event listeners from the search instance. If no event is specified, all callbacks are removed. If an event name is specified, but no callback, all callbacks for that event are removed. If an event and callback are specified, that single callback is removed. |
| `setText(callback:function)`                    | Sets the text callback that should return the post contents to use for searches                                                                                                                                                                                |
| `getText()`                                     | Returns the current text callback                                                                                                                                                                                                                                     |
| `setTitle(callback:function)`                   | Sets the title callback that should return the post title to use for searches                                                                                                                                                                                  |
| `getTitle()`                                    | Returns the current title callback                                                                                                                                                                                                                                    |
| `setTags(callback:function)`                    | Sets the text callback that should return an array of tags to use for searches                                                                                                                                                                                 |
| `getTags()`                                     | Returns the current tags callback                                                                                                                                                                                                                                     |
| `setMode(mode:string, [container:HTMLElement])` | Sets the interface mode (see `mode` in the options table above for a list of all types). If the `mode` is container, you can also pass the containing DOM element as the second parameter for convenience.                                                            |
| `getMode()`                                     | Get the interface mode                                                                                                                                                                                                                                                |
| `setContainer(container:HTMLEelement)`          | If `mode` is container, this method allows you to specify the element that the search results will be rendered into                                                                                                                                                  |
| `getContainer()`                                | Return the current containing element, or `null` if one is not set                                                                                                                                                                                                    |
| `setUserID(name:string)`                        | Set the unique identifier for the current CMS user                                                                                                                                                                                                                |
| `getUserID()`                                   | Return the unique identifier for the current CMS user                                                                                                                                                                                                                                 |
| `setUserEmail(email:string)`                        | Set the email address for the current CMS user                                                                                                                                                                                                                |
| `getUserEmail()`                                   | Return the email address for the current CMS user                                                                                                                                                                                                                                 |
| `setLocale(locale:string)`                        | Sets the locale the plugin will use for internationalization (ex: 'en_US')                                                                                                                                                                                                                |
| `getLocale()`                                   | Get the current locale, or undefined if one was not explicitly set                                                                                                                                                                                                                                 |
| `setColor(color:string)`                        | Set the current theme color                                                                                                                                                                                                                                          |
| `getColor()`                                   | Get the current theme color                                                                                                                                                                                                                                 |
| `setEmbedType(type:string)`                        | Set the preferred embed code type (`script` or `iframe`)                                                                                                                                                                                                                                          |
| `getEmbedType()`                                   | Get the preferred embed code type                                                                                                                                                                                                                                 |
| `attachEditor(editor:CKEDITOR.editor)`          | Integrates the graphiq search plugin into the specified CKEditor instance, which adds a button to launch Graphiq Search and automatically sets up content insertion handlers                                                       |

####Events

For use with the `on()` and `off()` methods listed above

| event    | description                                                         |
|----------|---------------------------------------------------------------------|
| `select` | A piece of content was selected inside the search interface |
| `load`   | The search interface was loaded successfully                |
| `show`   | The search interface was shown                              |
| `hide`   | The search interface was hidden                             |

####Embed Response Format

When a piece of content is selected, an object will be passed to your `select` callback with the embed code and a few other pieces of information. In most cases you'll only need the `code` property, but the other properties may be of use in rare cases.

| property    | description                                                         |
|-------------|---------------------------------------------------------------------|
| `code`      | Embed code that should be inserted into your post |
| `id`        | Unique identifier for this content |
| `title`     | A title that describes the content being embedded |
| `width`     | The default pixel width (everything is responsive so this may change based on device width) |
| `height`    | The default pixel height |
| `url`       | Raw URL for interactive content (Can be used for [oEmbed](http://www.oembed.com/) integrations) |
| `link`      | URL that will be used for attribution anchor tag |
| `link_text` | Text that will be used for attribution anchor tag |
| `image_url` | We sometimes provide a screenshot of this content for use in situations where the embed code is not available. This may not always be available, so plan accordingly |

#### Constants

A couple constant values are available on the plugin

| constant                | icon                                                                                           |
|-------------------------|------------------------------------------------------------------------------------------------|
| GraphiqSearch.ICON      | A URL containing the path to a Graphiq icon that you can use in your CMS |
| GraphiqSearch.VERSION   | The current version of the Graphiq Search plugin                                                  |

## Frequently Asked Questions

**"Our site gets a lot of traffic, will your servers be able to handle the load?"**

Our infrastructure is well-equipped to handle large spikes in traffic. All content is hosted in AWS (Amazon's Cloud), and can scale horizontally by automatically spinning up new web servers to handle the load. There are also  multiple layers of caching involved–Amazon Cloudfront, Varnish reverse proxy cache, and Redis.

**"What is the performance impact of embedding this content into one of my posts?"**

All of our embeddable content is loaded asynchronously, meaning that it will not block the loading of resources of the page it's embedded within. The response time for a single piece of embedded content is usually <50ms, and all static content is served from Amazon Cloudfront or another CDN. The total content that needs to be downloaded can range anywhere from 50kb for simple content to 300kb for pieces of content that contain images or complex data visualizations.

**"Why do you offer both a script-based and iframe-based embed code?"**

Iframes are a popular technique for embedded content on the web, they're used by Youtube, Vimeo, and a number of other well-known products. They do have limitations however–they generally have fixed dimensions and some proprietary content management systems will strip them out of the post. To combat these issues, we developed an alternative embed code  that uses a snippet of javascript to insert the iframe into the page, and also provide extra responsive-ness for mobile devices.

Curious what these embed codes look like? Here are some examples:

*Script*
```html
<a class="ftb-widget" href="http://listings.findthecompany.com/l/7647344/Wal-Mart-Stores-Inc-in-Bentonville-AR#stock%20info&s=1sLeQ7" data-width="600" data-height="400" data-widget-id="csB5Z2q3kMJ"  target="_blank"  style="font:14px/16px arial;color:#3d3d3d;">Wal-Mart Stores, Inc. - Stock Price and Volume | FindTheCompany</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^https:/.test(d.location)?'https':'http';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://cdn1.graphiq.com/rx/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","ftb-widgetjs");</script>
```

*IFrame*
```html
<div style="width:100%;max-width:600px;margin:0 auto;"><iframe src="//w.graphiq.com/w/9IgjhMMx35H" width="600" height="400" frameborder="0" scrolling="no" style="position:static;vertical-align:top;margin:0;max-width:100%;min-height:400px;"></iframe><div style="text-align:center;"><a target="_blank" href="http://listings.findthecompany.com/l/7647344/Wal-Mart-Stores-Inc-in-Bentonville-AR#stock%20info&s=1sLeQ7" style="font:14px/16px arial;color:#3d3d3d;">Wal-Mart Stores, Inc. - Stock Price and Volume | FindTheCompany</a></div></div>
```

**"How does the embedded content look on mobile devices?"**

Our widgets are fully responsive–meaning that they will respond to the size of whatever device they are shown on. As mentioned in the answer to the question above, we recommend using the script-based embed code so that the height can be adjusted dynamically in addition to the width (script-based embed codes may not work with every CMS, so please test).


## Questions

If you have any other questions or suggestions, please reach out by email **dschnurr@graphiq.com**
