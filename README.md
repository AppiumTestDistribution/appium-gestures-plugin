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

```java
RemoteWebElement scrollView = (RemoteWebElement) wait.until(presenceOfElementLocated(AppiumBy.accessibilityId("Swipe-screen")));

driver.executeScript("gesture: scrollElementIntoView", Map.of("scrollableView", scrollView.getId(),
    "strategy", "accessibility id",
    "selector", "WebdriverIO logo",
    "percentage", 50,
    "direction", "up",
    "maxCount", 3));

```

Sample app used to demonstrate below gesture is available [here](https://github.com/AppiumTestDistribution/appium-demo/blob/main/VodQA.apk)

# Drag and Drop

```java
RemoteWebElement source = (RemoteWebElement) wait.until(elementToBeClickable(AppiumBy.accessibilityId("dragMe")));
RemoteWebElement destination = (RemoteWebElement) wait.until(elementToBeClickable(AppiumBy.accessibilityId("dropzone")));

driver.executeScript("gesture: dragAndDrop", Map.of("sourceId", source.getId(), "destinationId", destination.getId()));
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
