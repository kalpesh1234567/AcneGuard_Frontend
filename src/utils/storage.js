export const STORAGE_KEY = 'skinLogic_history';

export const saveResult = (data) => {
    try {
        const history = getHistory();
        const newEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...data
        };
        const updatedHistory = [newEntry, ...history];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        return newEntry;
    } catch (error) {
        console.error('Failed to save result:', error);
        return null;
    }
};

export const getHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to retrieve history:', error);
        return [];
    }
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
