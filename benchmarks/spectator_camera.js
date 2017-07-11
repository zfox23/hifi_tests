//
// Created by Zach Fox on 2017/07/11
// Copyright 2013-2017 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
/* global Render, Script */

'use strict';

Script.include("./BenchmarkLib.js");

var testScript = new TestScript();
testScript.addTest({
    name: "spectator_camera",
    loader: TestScript.locationLoader("dev-welcome/9.25756,0.444499,-55.1696/0,0.00844876,0,0.999964", true),
    duration: 20,
    traceActions: function() {
        Script.setTimeout(function () {
            Test.startTraceEvent("spectatorCameraOff");
            Script.setTimeout(function () { Test.endTraceEvent("spectatorCameraOff"); }, 1000);
        }, 10 * 1000);
        Script.setTimeout(function () {
            Test.startTraceEvent("spectatorCameraOn");
            var secondaryCameraRenderConfig = Render.getConfig("SecondaryCamera");
            secondaryCameraRenderConfig.enableSecondaryCameraRenderConfigs(true);
            secondaryCameraRenderConfig.resetSizeSpectatorCamera(1920, 1080);
            
            function inFrontOf(distance, position, orientation) {
                return Vec3.sum(position || MyAvatar.position,
                                Vec3.multiply(distance, Quat.getForward(orientation || MyAvatar.orientation)));
            }
    
            var cameraRotation = MyAvatar.orientation, cameraPosition = inFrontOf(1, Vec3.sum(MyAvatar.position, { x: 0, y: 0.3, z: 0 }));
            var camera = Entities.addEntity({
                "angularDamping": 1,
                "damping": 1,
                "collidesWith": "static,dynamic,kinematic,",
                "collisionMask": 7,
                "dynamic": false,
                "modelURL": "http://hifi-content.s3.amazonaws.com/alan/dev/spectator-camera.fbx?7",
                "registrationPoint": {
                    "x": 0.53,
                    "y": 0.545,
                    "z": 0.16
                },
                "rotation": cameraRotation,
                "position": cameraPosition,
                "shapeType": "simple-compound",
                "type": "Model",
                "userData": "{\"grabbableKey\":{\"grabbable\":true}}"
            }, true);
            secondaryCameraRenderConfig.attachedEntityId = camera;            
            
            var viewFinderOverlay = Overlays.addOverlay("image3d", {
                url: "resource://spectatorCameraFrame",
                emissive: true,
                parentID: camera,
                alpha: 1,
                localRotation: { w: 1, x: 0, y: 0, z: 0 },
                localPosition: { x: 0, y: 0.13, z: 0.126 },
                dimensions: { x: 0.16, y: -0.16, z: 0 }
            });
            
            Script.setTimeout(function () { Test.endTraceEvent("spectatorCameraOn"); }, 1000);
        }, 10 * 1000);
    },
});

testScript.runTests();