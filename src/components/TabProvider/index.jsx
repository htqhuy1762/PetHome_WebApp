import { useState, createContext } from 'react'

const TabContext = createContext()

function TabProvider({ children }) {
    const [currentTab, setCurrentTab] = useState('pets');

    const value = {
        currentTab, setCurrentTab
    }

    return (
        <TabContext.Provider value={value}>
            {children}
        </TabContext.Provider>
    )
}

export { TabContext, TabProvider }