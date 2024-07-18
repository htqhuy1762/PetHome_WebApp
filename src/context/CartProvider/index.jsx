import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [isUpdate, setIsUpdate] = useState(false);

    return <CartContext.Provider value={{ isUpdate, setIsUpdate }}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};