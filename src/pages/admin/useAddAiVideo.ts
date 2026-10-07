import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getQuestions, addAiVideo } from "../../service/apis/aiVideo.api";

export function useAddAiVideo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryParams = new URLSearchParams(window.location.search);
  const urlQuestionId = queryParams.get("questionId") || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchInitialQuestionText = async () => {
    try {
      setLoading(true);
      if (urlQuestionId) {
        const response = await getQuestions();
        if (response?.status === 200) {
          const list = response.questions || response.data?.questions || [];
          const found = list.find((q: any) => (q.id || q._id) === urlQuestionId);
          if (found) {
            formik.setFieldValue("question", found.question);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load initial question text", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialQuestionText();
  }, [urlQuestionId]);

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

        await addAiVideo(formData);
        toast.success("AI video added successfully!");
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
