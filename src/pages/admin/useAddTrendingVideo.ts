import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { addTrendingVideo } from "../../service/apis/trendingVideo.api";

export function useAddTrendingVideo() {
  const navigate = useNavigate();
  const { audience } = useParams<{ audience: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    videoUrl: yup.string().url("Must be a valid URL").required("Video URL is required"),
    description: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      videoUrl: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("videoUrl", values.videoUrl);
        formData.append("description", values.description || "");
        formData.append("targetAudience", audience || "apprentice");

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }

        await addTrendingVideo(formData);
        toast.success("Trending video added successfully!");
        navigate(`/admin/trending-videos/${audience}`);
      } catch (error: any) {
        console.error("Failed to save trending video", error);
        toast.error(error?.response?.data?.message || "Failed to save trending video");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return {
    navigate,
    fileInputRef,
    submitting,
    thumbnailPreview,
    formik,
    handleThumbnailChange,
    audience,
  };
}
