import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userApi, deleteUser } from "../../service/apis/user.api";
import toast from "react-hot-toast";

export type UserType = {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: string;
  profileimageurl?: string;
  createdAt?: string;
};

export function useUsers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResult, setTotalResult] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedRole, setSelectedRole] = useState("");
  const [addClass, setAddClass] = useState("");

  // Delete Dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const rowsPerPage = 10;

  useEffect(() => {
    setSearchTerm(urlSearch);
    setCurrentPage(1);
  }, [urlSearch]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setAddClass("add_blur");
      const payload = {
        currentPage,
        limit: rowsPerPage,
        search: searchTerm,
        role: selectedRole,
      };
      const response = await userApi(payload);
      if (response?.status === 200) {
        const rawUsers =
          response.users?.users || response.data?.users || response.users || [];
        setUsers(rawUsers);
        setTotalResult(response.users?.totalResults || response.totalResults || rawUsers.length);
        setTotalPages(response.users?.totalPages || response.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
      setAddClass("");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, selectedRole, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (val) {
        newParams.set("search", val);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      return newParams;
    });
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast.success("User deleted successfully");
      handleCloseDelete();
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

  return {
    navigate,
    users,
    loading,
    totalResult,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    selectedRole,
    addClass,
    openDeleteDialog,
    handleSearchChange,
    handleRoleChange,
    clearSearch,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  };
}
