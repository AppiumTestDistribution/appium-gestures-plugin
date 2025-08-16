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
The code on the main branch does not work on Appium 2.13, Windows 11, Android 13.
However, the below does:
```java
RemoteWebElement carousel = (RemoteWebElement)
driver.findElement(AppiumBy.xpath("//...")));

driver.executeScript("gesture: swipe", Map.of("elementId", carousel.getId(), "percentage", 50, "direction", "left"));




