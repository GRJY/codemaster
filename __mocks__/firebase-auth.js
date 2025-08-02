export const getAuth = jest.fn(() => ({}));
export const signInWithCustomToken = jest.fn(() => Promise.resolve({ user: { uid: 'mock-user-id' } }));
export const signInAnonymously = jest.fn(() => Promise.resolve({ user: { uid: 'mock-user-id' } }));
export const onAuthStateChanged = jest.fn(() => {});
