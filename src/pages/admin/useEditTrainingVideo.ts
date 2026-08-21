import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getTrainingVideo, updateTrainingVideo } from "../../service/apis/trainingVideo.api";

export function useEditTrainingVideo() {
  const navigate = useNavigate();
  const { id, audience } = useParams<{ id: string; audience: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const response = await getTrainingVideo(id!);
        if (response?.status === 200) {
          const video = response.video || response.data?.video;
          if (video) {
            formik.resetForm({
              values: {
                title: video.title || "",
                videoUrl: video.videoUrl || "",
                description: video.description || "",
              }
            });
            setThumbnailPreview(video.thumbnail || null);
          }
        }
      } catch (error) {
        console.error("Failed to load training video details", error);
        toast.error("Failed to load training video details");
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id]);

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

        await updateTrainingVideo(id!, formData);
        toast.success("Training video updated successfully!");
        navigate(`/admin/training-videos/${audience}`);
      } catch (error: any) {
        console.error("Failed to update training video", error);
        toast.error(error?.response?.data?.message || "Failed to update training video");
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
    loading,
    submitting,
    thumbnailPreview,
    formik,
    handleThumbnailChange,
    audience,
  };
}
