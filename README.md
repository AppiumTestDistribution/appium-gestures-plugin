# appium-gestures-plugin

This is an Appium plugin designed to perform complex gestures using W3C Actions.

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
appium --plugins=gestures
```

# Drag and Drop test without plugin
```
MobileElement dragMe = (MobileElement) new WebDriverWait(driver, 30)
          .until(elementToBeClickable(MobileBy.AccessibilityId("dragMe")));
Point source = dragMe.getCenter();
MobileElement dropzone = (MobileElement) new WebDriverWait(driver, 30)
          .until(elementToBeClickable(MobileBy.AccessibilityId("dropzone")));
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


# Drag and Drop test with plugin
```
MobileElement source = (MobileElement) new WebDriverWait(driver, 30)
           .until(elementToBeClickable(MobileBy.AccessibilityId("dragMe")));
MobileElement destination = (MobileElement) new WebDriverWait(driver, 30)
           .until(elementToBeClickable(MobileBy.AccessibilityId("dropzone")));

driver.addCommand(HttpMethod.POST, String.format("/session/%s/plugin/actions/dragAndDrop", 
           driver.getSessionId()), "dragAndDrop");
driver.execute("dragAndDrop", ImmutableMap.of("sourceId", source.getId(), "destinationId", destination.getId()));
```
