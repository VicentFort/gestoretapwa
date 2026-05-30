const isManager = (accessType) => {
  if (accessType == "Gestor" || accessType == "Superusuari") return true;
  return false;
};

const isSuperUser = (accessType) => {
  if (accessType == "Superusuari") return true;
  return false;
};

export { isManager, isSuperUser };
