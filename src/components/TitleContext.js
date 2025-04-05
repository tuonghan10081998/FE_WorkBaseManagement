import { createContext, useState } from "react";

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState();
  const [iconAdd, setIconAdd] = useState();
  return (
    <TitleContext.Provider
      value={{ title, setTitle, icon, setIcon, iconAdd, setIconAdd }}
    >
      {children}
    </TitleContext.Provider>
  );
};
