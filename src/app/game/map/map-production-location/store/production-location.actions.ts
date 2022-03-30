import { Action } from '@ngrx/store';
import { Item } from 'src/app/game/shared/item.model';

export const ADD_PRODUCTION_LINE='ADD_PRODUCTION_LINE';
export const ADD_ITEM='ADD_ITEM';
export const UPDATE_ITEM_OWNED_QTY='UPDATE_ITEM_OWNED_QTY';

export class AddItem implements Action{
  readonly type = ADD_ITEM;

  constructor(public payload: Item){}
}

export class UpdateItemOwnedQty implements Action{
  readonly type = UPDATE_ITEM_OWNED_QTY;

  constructor(public payload: {id: number, quantity: number}){}
}

export type ProductionLocationActions = AddItem | UpdateItemOwnedQty;
