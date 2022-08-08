# appium-gestures-plugin

This is an Appium plugin designed to perform gestures using W3C Actions.

## Prerequisite

Appium version 2.0

## Installation - Server

Install the plugin using Appium's plugin CLI, either as a named plugin or via NPM:

```
appium plugin install --source=npm appium-gestures-plugin
```

## Activation

The plugin will not be active unless turned on when invoking the Appium server:

```
appium --use-plugins=gestures
```

# Drag and Drop test without plugin

```
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

```
RemoteWebElement source = (RemoteWebElement) wait
                .until(elementToBeClickable(AppiumBy.accessibilityId("dragMe")));
RemoteWebElement destination = (RemoteWebElement) wait
                .until(elementToBeClickable(AppiumBy.accessibilityId("dropzone")));

driver.addCommand(HttpMethod.POST, String.format("/session/%s/plugin/actions/dragAndDrop",
                driver.getSessionId()), "dragAndDrop");
driver.execute("dragAndDrop", ImmutableMap.of("sourceId", source.getId(), "destinationId", destination.getId()));
```

# Horizontal Swipe

```
RemoteWebElement slider = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("slider"));

driver.addCommand(HttpMethod.POST, String.format("/session/%s/plugin/actions/swipe", driver.getSessionId()), "swipe");

driver.execute("swipe", Map.of("elementId", slider.getId(), "percentage", 50, "direction", "right"));
```

# Vertical Swipe

```
RemoteWebElement slider = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("listview"));

driver.addCommand(HttpMethod.POST, String.format("/session/%s/plugin/actions/swipe", driver.getSessionId()), "swipe");

driver.execute("swipe", Map.of("elementId", slider.getId(), "percentage", 50, "direction", "up"));
```

# Double Tap

```
RemoteWebElement doubleTapMe = (RemoteWebElement) driver.findElement(AppiumBy.accessibilityId("doubleTapMe"));

driver.addCommand(HttpMethod.POST, String.format("/session/%s/plugin/actions/doubleTap", driver.getSessionId()), "doubleTap");

driver.execute("doubleTap", Map.of("elementId", doubleTapMe.getId()));
```

# WDIO

```
driver.addCommand(
      'dragAndDrop',
      command('POST', '/session/:sessionId/plugin/actions/dragAndDrop', {
        command: 'dragAndDrop',
        parameters: [
          {
            name: 'sourceId',
            type: 'string',
            description: 'a valid parameter',
            required: true,
          },
          {
            name: 'destinationId',
            type: 'string',
            description: 'a valid parameter',
            required: true,
          },
        ],
      })
    );
    await driver.dragAndDrop(sourceId, destinationId);

```

## Supported

- Swipe Left, right, up and down
- Drag and Drop
- Double Tap

### TODO

- longpress
- zoom
- multi finger swipe
