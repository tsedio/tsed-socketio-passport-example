import { useSocket } from "socket.io-react-hook";

export const useUsersSocket = () => {
  return useSocket("/users");
};
