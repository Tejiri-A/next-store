import { User2Icon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

async function UserIcon() {
  // const { userId } = auth();

  const user = await currentUser();

  const profileImage = user?.imageUrl;

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt=""
        className="size-6 rounded-full object-cover"
      />
    );
  }

  return <User2Icon className="size-6 bg-primary rounded-full text-white" />;
}

export default UserIcon;
