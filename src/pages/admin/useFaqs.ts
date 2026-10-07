import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getFaqsApi, deleteFaqApi } from "../../service/apis/faq.api";

export interface IFaq {
  _id: string;
  id?: string;
  question: string;
  answer: string;
  category?: string;
  createdAt?: string;
}

export function useFaqs() {
  const [faqsList, setFaqsList] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await getFaqsApi(page, limit, search);
      const items = res?.faqs || res?.results || [];
      setFaqsList(items);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load FAQs", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [page, search]);

  const handleDeleteClick = (id: string) => {
    setFaqToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setFaqToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;
    try {
      setLoading(true);
      await deleteFaqApi(faqToDelete);
      toast.success("FAQ deleted successfully");
      handleCloseDelete();
      fetchFaqs();
    } catch (error) {
      console.error("Failed to delete FAQ", error);
      toast.error("Failed to delete FAQ");
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return {
    faqsList,
    loading,
    page,
    setPage,
    totalPages,
    search,
    handleSearchChange,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  };
}
