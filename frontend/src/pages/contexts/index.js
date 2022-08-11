import { createContext } from "react";

const RepositoryContext = createContext(
    {
      selectedHolo: null,
      setSelectedHolo: () => {},
      selectedRef: null,
      setSelectedRef: () => {},
    }
);

export { RepositoryContext };