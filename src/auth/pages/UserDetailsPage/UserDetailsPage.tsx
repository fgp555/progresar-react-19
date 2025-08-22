import { useParams } from "react-router-dom";
import UserDetailsComp from "../UserDetailsComp/UserDetailsComp";

const UserDetailsPage = () => {
  const { id } = useParams();
  return <UserDetailsComp userId={id} />;
};

export default UserDetailsPage;
