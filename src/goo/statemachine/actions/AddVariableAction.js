define([
	'goo/statemachine/actions/Action',
	'goo/statemachine/StateUtils'
],
/** @lends */
function(
	Action,
	StateUtils
) {
	"use strict";

	function AddVariableAction(settings) {
		settings = settings || {};

		this.variable = settings.variable || null;
		this.amount = settings.amount || 1;
		this.everyFrame = true;
	}

	AddVariableAction.prototype = Object.create(Action.prototype);

	AddVariableAction.external = [
		{
			name: 'Entity',
			key: 'entity',
			type: 'entity'
		},
		{
			name: 'Position',
			key: 'position',
			type: 'vec3'
		},
		{
			name: 'Speed',
			key: 'speed',
			type: 'float',
			control: 'slider',
			min: 0,
			max: 10
		}];

	AddVariableAction.prototype._run = function(fsm) {
		console.log('add var');
		fsm.applyToVariable(this.variable, function(v) {
			return v + StateUtils.getValue(this.amount, fsm);
		}.bind(this));
	};

	return AddVariableAction;
});