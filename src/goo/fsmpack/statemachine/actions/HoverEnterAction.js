define([
	'goo/fsmpack/statemachine/actions/Action',
	'goo/renderer/bounds/BoundingPicker'
], function (
	Action,
	BoundingPicker
) {
	'use strict';

	function HoverEnterAction(/*id, settings*/) {
		Action.apply(this, arguments);

		this.everyFrame = true;
		this.updated = false;
		this.first = true;

		this.currentEntity = null;

		var that = this;
		this.moveListener = function (event) {
			if (that.first) {
				that.first = false;
				that.currentEntity = event.entity;
				return;
			}

			if (!event.entity) {
				that.currentEntity = null;
				return;
			}

			event.entity.traverseUp(function (entity) {
				if (entity === that.ownerEntity && that.currentEntity !== that.ownerEntity) {
					that.updated = true;
					return false;
				}
			});

			that.currentEntity = event.entity;
		};

		this.moveListenerBounds = function (event) {
			var x, y;
			var domTarget = that.goo.renderer.domElement;
			if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
				x = event.changedTouches[0].pageX - domTarget.getBoundingClientRect().left;
				y = event.changedTouches[0].pageY - domTarget.getBoundingClientRect().top;
			} else {
				var rect = domTarget.getBoundingClientRect();
				x = event.clientX - rect.left;
				y = event.clientY - rect.top;
			}

			var camera = that.goo.renderSystem.camera;
			var pickResult = { entity: null };

			if (this.type === HoverEnterAction.types.slow) {
				var pickingStore = this.pickSync(x, y);
				pickResult.entity = this.world.entityManager.getEntityByIndex(pickingStore.id);
			} else {
				var pickList = BoundingPicker.pick(that.goo.world, camera, x, y);
				if (pickList.length > 0) {
					pickResult.entity = pickList[0].entity;
				}
			}
			
			that.moveListener(pickResult);
		};
	}

	HoverEnterAction.prototype = Object.create(Action.prototype);
	HoverEnterAction.prototype.constructor = HoverEnterAction;

	HoverEnterAction.types = {
		fast: 'Bounding (Fast)',
		slow: 'Per pixel (Slow)',
	};

	HoverEnterAction.external = {
		name: 'Hover Enter',
		type: 'controls',
		description: 'Listens for a hover enter event on the entity and performs a transition',
		canTransition: true,
		parameters: [{
			name: 'Accuracy',
			key: 'type',
			type: 'string',
			control: 'dropdown',
			description: 'Hover accuracy/performance selection',
			'default': HoverEnterAction.types.fast,
			options: [HoverEnterAction.types.fast, HoverEnterAction.types.slow]
		}],
		transitions: [{
			key: 'enter',
			name: 'On Enter',
			description: 'State to transition to when entity is entered'
		}]
	};

	HoverEnterAction.prototype._setup = function (fsm) {
		this.ownerEntity = fsm.getOwnerEntity();
		this.goo = this.ownerEntity._world.gooRunner;

		// if (this.type === HoverEnterAction.types.slow) {
		// 	this.goo.addEventListener('mousemove', this.moveListener);
		// 	this.goo.addEventListener('touchmove', this.moveListener);
		// } else {
			document.addEventListener('mousemove', this.moveListenerBounds);
			document.addEventListener('touchmove', this.moveListenerBounds);
		// }
		
		this.updated = false;
		this.first = true;
		this.currentEntity = null;
	};

	HoverEnterAction.prototype._run = function (fsm) {
		if (this.updated) {
			this.updated = false;
			fsm.send(this.transitions.enter);
		}
	};

	HoverEnterAction.prototype.exit = function () {
		if (this.goo) {
			// if (this.type === HoverEnterAction.types.slow) {
			// 	this.goo.removeEventListener('mousemove', this.moveListener);
			// 	this.goo.removeEventListener('touchmove', this.moveListener);
			// } else {
				document.removeEventListener('mousemove', this.moveListenerBounds);
				document.removeEventListener('touchmove', this.moveListenerBounds);
			// }
		}
	};

	return HoverEnterAction;
});
