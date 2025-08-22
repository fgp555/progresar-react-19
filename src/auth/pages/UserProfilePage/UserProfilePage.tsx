import { useAuth } from "../../hooks/useAuth";
import UserDetailsComp from "../UserDetailsComp/UserDetailsComp";

const UserProfilePage = () => {
  const { userId } = useAuth();

  return <UserDetailsComp userId={userId} />;
};

export default UserProfilePage;
