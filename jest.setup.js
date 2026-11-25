global.fetch = jest.fn(() => Promise.reject(new Error('offline')));
