import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getAiVideoById, updateAiVideo } from "../../service/apis/aiVideo.api";

export function useEditAiVideo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchVideoDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getAiVideoById(id);
      if (response?.status === 200) {
        const video = response.video || response.data?.video;
        if (video) {
          formik.setValues({
            question: video.questionId?.question || "",
            title: video.title || "",
            videoUrl: video.videoUrl || "",
            description: video.description || "",
            targetAudience: video.targetAudience || "apprentice",
          });
          if (video.thumbnail) {
            setThumbnailPreview(video.thumbnail);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load video details", error);
      toast.error("Failed to load video details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      question: "",
      title: "",
      videoUrl: "",
      description: "",
      targetAudience: "apprentice",
    },
    validationSchema: yup.object().shape({
      question: yup.string().required("Question text is required"),
      title: yup.string().required("Video title is required"),
      videoUrl: yup.string().url("Must be a valid URL").required("Video URL is required"),
      description: yup.string().optional(),
      targetAudience: yup.string().required("Target audience is required"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("question", values.question);
        formData.append("title", values.title);
        formData.append("videoUrl", values.videoUrl);
        formData.append("description", values.description || "");
        formData.append("targetAudience", values.targetAudience);

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }

        await updateAiVideo(id!, formData);
        toast.success("AI video updated successfully!");
        navigate("/admin/ai-videos");
      } catch (error: any) {
        console.error("Failed to save AI video", error);
        toast.error(error?.response?.data?.message || "Failed to save AI video");
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
    loading,
    submitting,
    fileInputRef,
    thumbnailPreview,
    formik,
    handleThumbnailChange,
  };
}
