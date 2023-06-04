# appium-gestures-plugin

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

# Drag and Drop test without plugin

```java
WebElement dragMe = wait.until(elementToBeClickable(AppiumBy.accessibilityId("dragMe")));
Point source = dragMe.getCenter();
WebElement dropzone = wait.until(elementToBeClickable(AppiumBy.accessibilityId("dropzone")));
Point target = dropzone.getCenter();
PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
Sequence dragNDrop = new Sequence(finger, 1);
dragNDrop.addAction(finger.createPointerMove(ofMillis(0),
          PointerInput.Origin.viewport(), source.x, source.y));
dragNDrop.addAction(finger.createPointerDown(PointerInput.MouseButton.MIDDLE.asArg()));
dragNDrop.addAction(new Pause(finger, ofMillis(600)));
dragNDrop.addAction(finger.createPointerMove(ofMillis(600),
          PointerInput.Origin.viewport(),
          target.x, target.y));
dragNDrop.addAction(finger.createPointerUp(PointerInput.MouseButton.MIDDLE.asArg()));
driver.perform(singletonList(dragNDrop));
```

# Usage

# Drag and Drop

```java
RemoteWebElement source = (RemoteWebElement) wait
    .until(elementToBeClickable(AppiumBy.accessibilityId("dragMe")));
RemoteWebElement destination = (RemoteWebElement) wait
    .until(elementToBeClickable(AppiumBy.accessibilityId("dropzone")));

driver.executeScript("gesture: dragAndDrop", ImmutableMap.of("sourceId", source.getId(), "destinationId", destination.getId()));
```

# Horizontal Swipe

```java
RemoteWebElement slider = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("slider"));

driver.executeScript("gesture: swipe", ImmutableMap.of("elementId", slider.getId(), "percentage", 50, "direction", "right"));
```

# Vertical Swipe

```java
RemoteWebElement slider = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("listview"));

driver.executeScript("gesture: swipe", ImmutableMap.of("elementId", slider.getId(), "percentage", 50, "direction", "up"));
```

# Double Tap

```java
RemoteWebElement doubleTapMe = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("doubleTapMe"));

driver.executeScript("gesture: doubleTap", ImmutableMap.of("elementId", doubleTapMe.getId()));
```

# Long Press

Pressure has to be between 0 and 1.

```java
RemoteWebElement longPress = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("longpress"));

driver.executeScript("gesture: longPress", ImmutableMap.of("elementId", longPress.getId(), "pressure", 0.5, "duration", 800));

```

# ScrollIntoView

```java
ImmutableMap map = ImmutableMap.of("scrollableView", scrollView.getId(),
    "strategy", "accessibility id",
    "selector", "WebdriverIO logo",
    "percentage", 50,
    "direction", "up",
    "maxCount", 3);
driver.executeScript("gesture: scrollElementIntoView", map);

```

# WDIO

```js
await driver.execute('gesture: dragAndDrop', { sourceId, destinationId });
```

## Supported

- Swipe Left, right, up and down
- Drag and Drop
- Double Tap
- Long Press
- scrollElementIntoView

### TODO

- zoom
- multi finger swipe
