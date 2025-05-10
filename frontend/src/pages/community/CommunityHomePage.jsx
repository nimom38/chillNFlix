import { useChatStore } from "../../store/community/useChatStore";
import { useGroupStore } from "../../store/community/useGroupStore"; // ✅ NEW

import Sidebar from "../../components/community/Sidebar";
import NoChatSelected from "../../components/community/NoChatSelected";
import ChatContainer from "../../components/community/ChatContainer";

const CommunityHomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore(); // ✅ NEW

  console.log("selectedUser", selectedUser);
  console.log("selectedGroup", selectedGroup); // ✅ Debug log

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-10 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser && !selectedGroup ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommunityHomePage;
