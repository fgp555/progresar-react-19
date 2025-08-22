export type SubMenuType = {
  orders: boolean;
  users: boolean;
  operator: boolean;
  setting: boolean;
  application: boolean;
};

export type MenuKeyType = keyof SubMenuType;

