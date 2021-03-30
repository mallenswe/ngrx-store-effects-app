import * as fromPizzas from '../actions/pizzas.action';

import { Pizza } from '../../models/pizza.model';

export interface PizzaState {
    // data: Pizza[];
    entities: {[id: number]: Pizza}
    loaded: boolean;
    loading: boolean;
}

export const initialState: PizzaState = {
    // data: [],
    entities: {},
    loaded: false,
    loading: false
};

export function reducer(
    state = initialState,
    action: fromPizzas.PizzasAction
): PizzaState {

    switch (action.type) {
        case fromPizzas.LOAD_PIZZAS: {
            return {
                ...state,
                loading: true
            };
        }
        
        case fromPizzas.LOAD_PIZZAS_SUCCESS: {
            console.log('LOAD_PIZZAS_SUCCESS action.payload: ', action.payload);
            const pizzas = action.payload;

            const entities = pizzas.reduce((entites: {[id: number]: Pizza}, pizza: Pizza) => {
                return {
                    ...entites,
                    [pizza.id]: pizza
                }
            }, {
                ...state.entities,
            });

            return {
                ...state,
                loading: false,
                loaded: true,
                // data
                entities
            };
        }

        case fromPizzas.LOAD_PIZZAS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: false
            };
        }

        case fromPizzas.CREATE_PIZZA_SUCCESS:
        case fromPizzas.UPDATE_PIZZA_SUCCESS: {
            const pizza = action.payload;
            const entities = {
                ...state.entities,
                [pizza.id]: pizza
            }

            return {
                ...state,
                entities
            }
        }

        case fromPizzas.REMOVE_PIZZA_SUCCESS: {
            const pizza = action.payload;
            const { [pizza.id]: removed, ...entities } = state.entities;

            console.log('fromPizzas.REMOVE_PIZZA_SUCCESS removed: ', removed);

            return {
                ...state,
                entities
            }
        }
    }

    return state;
}

export const getPizzasEntities = (state: PizzaState) => state.entities;
export const getPizzasLoading = (state: PizzaState) => state.loading;
export const getPizzasLoaded = (state: PizzaState) => state.loaded;
