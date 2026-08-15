import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getSupportRequests, replyToSupportRequest } from "../../service/apis/support.api";

export interface ISupportRequest {
  _id: string;
  id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  adminReply?: string;
  status: "open" | "resolved";
  createdAt?: string;
}

export function useSupportRequests() {
  const [requestsList, setRequestsList] = useState<ISupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);

  // Modals / Dialogs states
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ISupportRequest | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getSupportRequests();
      const items = res?.requests || res?.data?.requests || [];
      setRequestsList(items);
    } catch (error) {
      console.error("Failed to load support requests", error);
      toast.error("Failed to load support requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenReply = (req: ISupportRequest) => {
    setSelectedRequest(req);
    setReplyText("");
    setIsReplyModalOpen(true);
  };

  const handleCloseReply = () => {
    setSelectedRequest(null);
    setReplyText("");
    setIsReplyModalOpen(false);
  };

  const handleReplySubmit = async () => {
    if (!selectedRequest || !replyText.trim()) return;
    try {
      setReplying(true);
      await replyToSupportRequest(selectedRequest._id || selectedRequest.id!, replyText);
      toast.success("Reply email sent successfully!");
      handleCloseReply();
      fetchRequests();
    } catch (error) {
      console.error("Failed to send reply", error);
      toast.error("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  return {
    requestsList,
    loading,
    replying,
    isReplyModalOpen,
    selectedRequest,
    replyText,
    setReplyText,
    handleOpenReply,
    handleCloseReply,
    handleReplySubmit,
  };
}
