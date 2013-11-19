define(
	[
		'goo/logic/LogicLayer',
		'goo/logic/LogicNode',
		'goo/logic/LogicNodes',
		'goo/logic/LogicInterface',
		'goo/math/Vector3'
	],
	/** @lends */
	function(LogicLayer, LogicNode, LogicNodes, LogicInterface, Vector3) {
		"use strict";

		/**
		 * @class Logic node that calculates sine
		 */
		function LogicNodeWASD() {
			LogicNode.call(this);
			this.logicInterface = LogicNodeWASD.logicInterface;
			this.type = "LogicNodeWASD";

			this.eventListenerDown = function(event) {
				var keyEvent = LogicNodeWASD.downKeys[String.fromCharCode(event.which).toLowerCase()];
				if (keyEvent) {
					LogicLayer.fireEvent(this.logicInstance, keyEvent);
				}
			}.bind(this);
			this.eventListenerUp = function(event) {
				var keyEvent = LogicNodeWASD.upKeys[String.fromCharCode(event.which).toLowerCase()];
				if (keyEvent) {
					LogicLayer.fireEvent(this.logicInstance, keyEvent);
				}
			}.bind(this);
		}

		LogicNodeWASD.prototype = Object.create(LogicNode.prototype);
		LogicNodeWASD.editorName = "WASD";

		LogicNodeWASD.prototype.onSystemStarted = function() {
			console.log("WASD: Adding event listeners");
			document.addEventListener('keydown', this.eventListenerDown);
			document.addEventListener('keyup', this.eventListenerUp);
		};

		LogicNodeWASD.prototype.onSystemStopped = function(stopForPause) {
			console.log("WASD: Removing event listeners");
			document.removeEventListener('keydown', this.eventListenerDown);
			document.removeEventListener('keyup', this.eventListenerUp);
		};

		LogicNodeWASD.logicInterface = new LogicInterface();
		LogicNodeWASD.downKeys = {
			'w': LogicNodeWASD.logicInterface.addOutputEvent("W-down"),
			'a': LogicNodeWASD.logicInterface.addOutputEvent("A-down"),
			's': LogicNodeWASD.logicInterface.addOutputEvent("S-down"),
			'd': LogicNodeWASD.logicInterface.addOutputEvent("D-down")
		};
		LogicNodeWASD.upKeys = {
			'w': LogicNodeWASD.logicInterface.addOutputEvent("W-up"),
			'a': LogicNodeWASD.logicInterface.addOutputEvent("A-up"),
			's': LogicNodeWASD.logicInterface.addOutputEvent("S-up"),
			'd': LogicNodeWASD.logicInterface.addOutputEvent("D-up")
		};

		LogicNodes.registerType("LogicNodeWASD", LogicNodeWASD);

		return LogicNodeWASD;
	});