/**
 * The external dependencies.
 */
import immutable from 'object-path-immutable';
import { handleActions, combineActions } from 'redux-actions';
import { omit, findIndex } from 'lodash';

/**
 * The internal dependencies.
 */
import { decorateFieldReducer } from 'lib/registry';
import { resetStore } from 'store/actions';
import {
	setupField,
	updateField,
	addFields,
	removeFields,
	setUI,
	markFieldAsValid,
	markFieldAsInvalid,
	receiveComplexGroup,
	expandComplexGroup,
	collapseComplexGroup,
	switchComplexTab,
	redrawMap
} from 'fields/actions';

/**
 * The reducer that handles the `fields` branch.
 */
export default decorateFieldReducer(handleActions({
	[combineActions(setupField, setUI)]:  (state, { payload: { fieldId, ui }}) => immutable.assign(state, `${fieldId}.ui`, ui),
	[addFields]: (state, { payload }) => ({ ...state, ...payload }),
	[removeFields]: (state, { payload }) => omit(state, payload),
	[updateField]: (state, { payload: { fieldId, data }}) => immutable.assign(state, fieldId, data),
	[resetStore]: (state, { payload: { fields }}) => fields,

	[markFieldAsValid]: (state, { payload: { fieldId } }) => immutable.assign(state, `${fieldId}.ui`, {
		valid: true,
		error: null,
	}),

	[markFieldAsInvalid]: (state, { payload: { fieldId, error } }) => immutable.assign(state, `${fieldId}.ui`, {
		valid: false,
		error: error,
	}),

	[receiveComplexGroup]: (state, { payload: { fieldId, group } }) => immutable.push(state, `${fieldId}.value`, group),

	[combineActions(expandComplexGroup, collapseComplexGroup)]: (state, { payload: { fieldId, groupId, collapsed } }) => {
		const index = findIndex(state[fieldId].value, { id: groupId });

		return immutable.set(state, `${fieldId}.value.${index}.collapsed`, collapsed);
	},

	[switchComplexTab]: (state, { payload: { fieldId, groupId } }) => immutable.set(state, `${fieldId}.ui.current_tab`, groupId),
	[redrawMap]: (state, { payload: { fieldId }}) => immutable.set(state, `${fieldId}.ui.redraw_map`, true),
}, {}));