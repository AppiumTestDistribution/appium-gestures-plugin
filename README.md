<h1 align="center">
	<br>
	<img src="assets/GesturesPlugin.jpg" alt="AppiumGestures">
	<br>
	<br>
	<br>
</h1>

# appium-gestures-plugin [![npm version](https://badge.fury.io/js/appium-gestures-plugin.svg)](https://badge.fury.io/js/appium-gestures-plugin)

This is an Appium plugin designed to perform basic gestures using W3C Actions.

## Prerequisite

Appium version 2.0

## Installation - Server

Install the plugin using Appium's plugin CLI, either as a named plugin or via NPM:

```shell
appium plugin install --source=npm appium-gestures-plugin
```

## Activation

The plugin will not be active unless turned on when invoking the Appium server:

```shell
appium --use-plugins=gestures
```

# Usage

Sample app used to demonstrate below gesture is available [here](https://github.com/webdriverio/native-demo-app/releases)

# Swipe Left

```java
RemoteWebElement carousel = (RemoteWebElement) wait.until(presenceOfElementLocated(AppiumBy.accessibilityId("Carousel")));

driver.executeScript("gesture: swipe", Map.of("elementId", carousel.getId(), "percentage", 50, "direction", "left"));
```

# Swipe Right

```java
RemoteWebElement carousel = (RemoteWebElement) wait.until(presenceOfElementLocated(AppiumBy.accessibilityId("Carousel")));

driver.executeScript("gesture: swipe", Map.of("elementId", carousel.getId(), "percentage", 50, "direction", "right"));
```

# Swipe Up

```java
RemoteWebElement scrollView = (RemoteWebElement) wait.until(presenceOfElementLocated(AppiumBy.accessibilityId("Swipe-screen")));

driver.executeScript("gesture: swipe", Map.of("elementId", scrollView.getId(),
                "percentage", 50,
                "direction", "up"));
```

# Swipe Down

```java
RemoteWebElement scrollView = (RemoteWebElement) wait.until(presenceOfElementLocated(AppiumBy.accessibilityId("Swipe-screen")));

driver.executeScript("gesture: swipe", Map.of("elementId", scrollView.getId(),
                "percentage", 50,
                "direction", "down"));
```

# scrollElementIntoView

**JAVA**

```java
RemoteWebElement scrollView = (RemoteWebElement) wait.until(presenceOfElementLocated(AppiumBy.accessibilityId("Swipe-screen")));

driver.executeScript("gesture: scrollElementIntoView", Map.of("scrollableView", scrollView.getId(),
    "strategy", "accessibility id",
    "selector", "WebdriverIO logo",
    "percentage", 50,
    "direction", "up",
    "maxCount", 3));

```

**PYTHON**

```python
list_view = driver.find_element(by=AppiumBy.ID, value='android:id/list')
driver.execute_script('gesture: scrollElementIntoView',
                      {'scrollableView': list_view.id, 'strategy': 'accessibility id', 'selector': 'Picker',
                       'percentage': 50, 'direction': 'up', 'maxCount': 3})
```

Sample app used to demonstrate below gesture is available [here](https://github.com/AppiumTestDistribution/appium-demo/blob/main/VodQA.apk)

# Drag and Drop

**JAVA**

```java
RemoteWebElement source = (RemoteWebElement) wait.until(elementToBeClickable(AppiumBy.accessibilityId("dragMe")));
RemoteWebElement destination = (RemoteWebElement) wait.until(elementToBeClickable(AppiumBy.accessibilityId("dropzone")));

driver.executeScript("gesture: dragAndDrop", Map.of("sourceId", source.getId(), "destinationId", destination.getId()));
```

**PYTHON**

```python
el1 = driver.find_element(by=AppiumBy.ID, value='io.appium.android.apis:id/drag_dot_1')
el2 = driver.find_element(by=AppiumBy.ID, value='io.appium.android.apis:id/drag_dot_2')

driver.execute_script('gesture: dragAndDrop', {
    'sourceId': el1.id,
    'destinationId': el2.id,
})
```

# Double Tap

```java
RemoteWebElement doubleTapMe = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("doubleTapMe"));

driver.executeScript("gesture: doubleTap", Map.of("elementId", doubleTapMe.getId()));
```

# Long Press

Pressure has to be between 0 and 1.

```java
RemoteWebElement longPress = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("longpress"));

driver.executeScript("gesture: longPress", Map.of("elementId", longPress.getId(), "pressure", 0.5, "duration", 800));

```

# WDIO

```js
await driver.execute('gesture: dragAndDrop', { sourceId, destinationId });
```

## Supported

- Swipe Left, right, up and down
- scrollElementIntoView
- Drag and Drop
- Double Tap
- Long Press

### TODO

- zoom
- multi finger swipe

## MCP Server Support

This plugin now includes Model Context Protocol (MCP) server support, which allows you to use the gesture tools through MCP clients. The MCP server can be started in two modes:

1. **SSE (Server-Sent Events)** - A web server that exposes the gesture tools via HTTP
2. **stdio** - A stdio-based server that communicates through standard input/output

### Starting MCP Servers

The MCP servers are automatically started when the plugin is initialized. You can also start them manually using the following commands:

**JAVA**

```java
// Start SSE server (default)
driver.executeScript("gesture: startMcpServer", Map.of());

// Start SSE server with custom port
driver.executeScript("gesture: startMcpServer", Map.of("mode", "sse", "port", 4724));

// Start stdio server
driver.executeScript("gesture: startMcpServer", Map.of("mode", "stdio"));
```

**PYTHON**

```python
# Start SSE server (default)
driver.execute_script('gesture: startMcpServer', {})

# Start SSE server with custom port
driver.execute_script('gesture: startMcpServer', {'mode': 'sse', 'port': 4724})

# Start stdio server
driver.execute_script('gesture: startMcpServer', {'mode': 'stdio'})
```

### Stopping MCP Servers

You can stop the MCP servers using the following commands:

**JAVA**

```java
// Stop all servers
driver.executeScript("gesture: stopMcpServer", Map.of());

// Stop only SSE server
driver.executeScript("gesture: stopMcpServer", Map.of("mode", "sse"));

// Stop only stdio server
driver.executeScript("gesture: stopMcpServer", Map.of("mode", "stdio"));
```

**PYTHON**

```python
# Stop all servers
driver.execute_script('gesture: stopMcpServer', {})

# Stop only SSE server
driver.execute_script('gesture: stopMcpServer', {'mode': 'sse'})

# Stop only stdio server
driver.execute_script('gesture: stopMcpServer', {'mode': 'stdio'})
```

### Available MCP Tools

The following gesture tools are available through the MCP server:

1. **dragAndDrop** - Drag and drop from source element to destination element
2. **swipe** - Swipe on an element in a specific direction
3. **scrollElementIntoView** - Scroll until an element is found
4. **doubleTap** - Double tap on an element
5. **longPress** - Long press on an element

### Example MCP Client Usage

Here's an example of how to use the MCP client to perform gestures:

```javascript
// Example using an MCP client library
const mcpClient = new McpClient('http://localhost:4723');

// Drag and drop
await mcpClient.executeTool('dragAndDrop', {
  sourceId: 'source-element-id',
  destinationId: 'destination-element-id',
});

// Swipe
await mcpClient.executeTool('swipe', {
  elementId: 'element-id',
  percentage: 50,
  direction: 'up',
});

// Double tap
await mcpClient.executeTool('doubleTap', {
  elementId: 'element-id',
});

// Long press
await mcpClient.executeTool('longPress', {
  elementId: 'element-id',
  pressure: 50,
  duration: 1000,
});

// Scroll element into view
await mcpClient.executeTool('scrollElementIntoView', {
  scrollableView: 'scrollable-view-id',
  strategy: 'accessibility id',
  selector: 'element-to-find',
  percentage: 50,
  direction: 'up',
  maxCount: 5,
});
```
