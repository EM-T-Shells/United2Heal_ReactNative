//LogoutContesxt.js
import { createContext } from 'react';

const LogoutContext = createContext({
  handleLogout: () => {}
});

export default LogoutContext;
