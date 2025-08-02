export const getFirestore = jest.fn(() => ({}));
export const doc = jest.fn();
export const setDoc = jest.fn(() => Promise.resolve());
export const onSnapshot = jest.fn(() => () => {}); // onSnapshot için unsubscribe fonksiyonu döndürüyoruz
export const collection = jest.fn();
export const serverTimestamp = jest.fn(() => ({ seconds: Date.now() / 1000 }));
export const getDoc = jest.fn(() => Promise.resolve({ exists: () => false, data: () => null }));
export const deleteDoc = jest.fn(() => Promise.resolve());
export const updateDoc = jest.fn(() => Promise.resolve());
