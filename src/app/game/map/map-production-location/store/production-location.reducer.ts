/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Item } from 'src/app/game/shared/item.model';
import * as ProductionLocationActions from './production-location.actions';

const initialState={
  items: [new Item(1,'test')],
};

export function productionLocationReducer(
  state = initialState,
  action: ProductionLocationActions.ProductionLocationActions
){
  switch (action.type){
    case ProductionLocationActions.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case ProductionLocationActions.UPDATE_ITEM_OWNED_QTY:
      const item = state.items[action.payload.id];
      const updatedItem = {
        ...item,
        quantity: action.payload.quantity
      };

      const updatedItems = [...state.items];
      //updatedItems[action.payload.id] = updatedItems;

      return {
        ...state,
        items: [...state.items, action.payload]
      };
    default:
      return state;
  }
}
