import React, { useState, useRef, useCallback, useEffect } from "react";
import { useService } from "../ServiceContext";
import {
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
  X,
  Upload,
  FileText,
  Type,
  AlertCircle,
} from "lucide-react";
import Cropper from "react-easy-crop";

export default function ServiceInfo() {
  const {
    basicInfo,
    setBasicInfo,
    categories,
    filteredSubcategories,
    fetchCategories,
    fetchSubcategories,
    API_BASE,
    setError,
    stepErrors,
    setStepErrors,
    goToNextStep,
    goToPreviousStep,
    currentStep,
    uploadImage,
    requiredDocuments,
    setRequiredDocuments,
  } = useService();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(null);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [sizeError, setSizeError] = useState("");

  const fileInputRef = useRef(null);

  // Target dimensions for crop
  const TARGET_WIDTH = 1024;
  const TARGET_HEIGHT = 512;
  const ASPECT_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 1024/512 = 2

  const serviceTypeOptions = [
    { value: "ONE_TIME", label: "One Time" },
    { value: "RECURRING", label: "Recurring" },
  ];

  const frequencyOptions = [
    { value: "MONTHLY", label: "Monthly" },
    { value: "QUARTERLY", label: "Quarterly" },
    { value: "YEARLY", label: "Yearly" },
  ];

  const durationUnitOptions = [
    { value: "MONTH", label: "Months" },
    { value: "YEAR", label: "Years" },
  ];

  // Clear recurring field errors when service type changes
  const clearRecurringFieldErrors = useCallback(() => {
    if (setStepErrors) {
      setStepErrors((prev) => ({
        ...prev,
        frequency: "",
        durationUnit: "",
        duration: "",
      }));
    }
  }, [setStepErrors]);

  // Clear recurring fields when switching to ONE_TIME service type
  const handleServiceTypeChange = useCallback(
    (newServiceType) => {
      setBasicInfo((prev) => {
        const updatedInfo = {
          ...prev,
          serviceType: newServiceType,
        };
        // Clear recurring + documents fields if switching to ONE_TIME
        if (newServiceType === "ONE_TIME") {
          updatedInfo.frequency = "";
          updatedInfo.durationUnit = "";
          updatedInfo.duration = "";
          updatedInfo.documentsRequired = false;
          clearRecurringFieldErrors();
          setRequiredDocuments([]);
        }
        return updatedInfo;
      });
    },
    [setBasicInfo, clearRecurringFieldErrors, setRequiredDocuments]
  );

  // Handle service type change in the component
  useEffect(() => {
    // Initialize recurring fields if they don't exist
    if (basicInfo.serviceType === "RECURRING") {
      if (!basicInfo.frequency)
        setBasicInfo((prev) => ({ ...prev, frequency: "" }));
      if (!basicInfo.durationUnit)
        setBasicInfo((prev) => ({ ...prev, durationUnit: "" }));
      if (!basicInfo.duration)
        setBasicInfo((prev) => ({ ...prev, duration: "" }));
    }
  }, [
    basicInfo.serviceType,
    basicInfo.frequency,
    basicInfo.durationUnit,
    basicInfo.duration,
    setBasicInfo,
  ]);

  // Crop completion handler
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to create cropped image with 1024x512 dimensions
  const createCroppedImage = useCallback(async () => {
    if (!originalImage || !croppedAreaPixels) {
      return null;
    }
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = new Image();
      
      return new Promise((resolve, reject) => {
        image.onload = () => {
          // Set canvas to target dimensions
          canvas.width = TARGET_WIDTH;
          canvas.height = TARGET_HEIGHT;
          
          // Calculate scale to fit cropped area into target dimensions
          const scaleX = TARGET_WIDTH / croppedAreaPixels.width;
          const scaleY = TARGET_HEIGHT / croppedAreaPixels.height;
          const scale = Math.max(scaleX, scaleY); // Use max to fill the target area
          
          // Calculate centered position
          const scaledWidth = croppedAreaPixels.width * scale;
          const scaledHeight = croppedAreaPixels.height * scale;
          const offsetX = (TARGET_WIDTH - scaledWidth) / 2;
          const offsetY = (TARGET_HEIGHT - scaledHeight) / 2;
          
          // Fill background with white (optional)
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
          
          // Draw the cropped and scaled image
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
          );
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              const file = new File([blob], `cropped-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              resolve(file);
            },
            "image/jpeg",
            0.95 // Quality
          );
        };
        
        image.onerror = reject;
        image.src = URL.createObjectURL(originalImage);
      });
    } catch (err) {
      console.error("Error creating cropped image:", err);
      return null;
    }
  }, [originalImage, croppedAreaPixels]);

  // Handle crop confirmation
  const handleCropComplete = async () => {
    try {
      setUploadingImage(true);
      const croppedFile = await createCroppedImage();
      if (!croppedFile) {
        throw new Error("Failed to create cropped image");
      }
      // Process the cropped image
      const imageData = await uploadImage(croppedFile);
      setBasicInfo((prev) => ({
        ...prev,
        photoUrl: imageData.blobUrl,
        photoFile: imageData.file,
      }));
      setShowCropModal(false);
      setOriginalImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setImageDimensions({ width: 0, height: 0 });
    } catch (err) {
      setError("Failed to crop image. Please try again.");
      console.error("Crop error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setNewCategoryName("");
        setShowCategoryModal(false);
      }
    } catch (err) {
      setError("Failed to add category");
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowEditModal(null);
        setEditId(null);
        setNewCategoryName("");
        setShowCategoryDropdown(null);
      }
    } catch (err) {
      setError("Failed to edit category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await fetch(`${API_BASE}/category/${categoryId}`, {
        method: "DELETE",
      });
      fetchCategories();
      fetchSubcategories();
      setShowCategoryDropdown(null);
      if (basicInfo.categoryId === categoryId) {
        setBasicInfo((prev) => ({
          ...prev,
          categoryId: "",
          subCategoryId: "",
        }));
      }
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !basicInfo.categoryId) return;
    try {
      const response = await fetch(`${API_BASE}/subcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: basicInfo.categoryId,
          subCategoryName: newSubcategoryName,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchSubcategories();
        setNewSubcategoryName("");
        setShowSubcategoryModal(false);
      }
    } catch (err) {
      setError("Failed to add subcategory");
    }
  };

  const handleEditSubcategory = async (subCategoryId) => {
    if (!newSubcategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/subcategory/${subCategoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subCategoryName: newSubcategoryName,
          categoryId: basicInfo.categoryId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchSubcategories();
        setShowEditModal(null);
        setEditId(null);
        setNewSubcategoryName("");
        setShowSubcategoryDropdown(null);
      }
    } catch (err) {
      setError("Failed to edit subcategory");
    }
  };

  const handleDeleteSubcategory = async (subCategoryId) => {
    if (
      !window.confirm("Are you sure you want to delete this subcategory?")
    )
      return;
    try {
      await fetch(`${API_BASE}/subcategory/${subCategoryId}`, {
        method: "DELETE",
      });
      fetchSubcategories();
      setShowSubcategoryDropdown(null);
      if (basicInfo.subCategoryId === subCategoryId) {
        setBasicInfo((prev) => ({
          ...prev,
          subCategoryId: "",
        }));
      }
    } catch (err) {
      setError("Failed to delete subcategory");
    }
  };

  const openEditModal = (type, id, name) => {
    setShowEditModal(type);
    setEditId(id);
    if (type === "category") {
      setNewCategoryName(name);
      setShowCategoryDropdown(null);
    } else {
      setNewSubcategoryName(name);
      setShowSubcategoryDropdown(null);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Clear any previous errors
      setError("");
      setSizeError("");
      setImageDimensions({ width: 0, height: 0 });

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, WebP)");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (10MB limit)
      const maxSizeInMB = 10;
      const maxSizeInBytes = maxSizeInMB * 1024 * 512;
      const fileSizeInMB = file.size / (1024 * 512);
      
      if (file.size > maxSizeInBytes) {
        setSizeError(`File size should be less than ${maxSizeInMB}MB. Your file is ${fileSizeInMB.toFixed(2)}MB`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Check image dimensions
      const image = new Image();
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        setImageDimensions({ width, height });

        // Recommend minimum dimensions
        const minWidth = TARGET_WIDTH;
        const minHeight = TARGET_HEIGHT;
        
        if (width < minWidth || height < minHeight) {
          console.warn(`Image is smaller than recommended ${minWidth}x${minHeight}px`);
        }
        
        // Proceed with crop since file is under 10MB
        setOriginalImage(file);
        setShowCropModal(true);
        
        // Create preview URL for cropper
        const previewUrl = URL.createObjectURL(file);
        setBasicInfo((prev) => ({
          ...prev,
          photoUrl: previewUrl,
          photoFile: null,
        }));
      };

      image.onerror = () => {
        setError("Failed to load image. Please try another file.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      
      image.src = URL.createObjectURL(file);

    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Image processing error:", err);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    // Revoke the blob URL to prevent memory leaks
    if (basicInfo.photoUrl && basicInfo.photoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(basicInfo.photoUrl);
    }
    setBasicInfo((prev) => ({
      ...prev,
      photoUrl: "",
      photoFile: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clean up crop modal state
    if (originalImage) {
      URL.revokeObjectURL(URL.createObjectURL(originalImage));
      setOriginalImage(null);
    }
    if (showCropModal) {
      setShowCropModal(false);
    }
    // Reset image dimensions
    setImageDimensions({ width: 0, height: 0 });
    // Clear size error
    setSizeError("");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    handleRemoveImage();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Service Information
        </h2>
        <p className="text-sm text-gray-600">
          Fill in the basic details about your service.
        </p>
      </div>

      <div className="space-y-4">
        {/* Service Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Service Image <span className="text-red-500">*</span>
          </label>
          
          {/* Show 10MB size error prominently */}
          {sizeError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">{sizeError}</p>
            </div>
          )}
          
          {/* Image Dimension Info - only show if we have dimensions and no crop modal */}
          {imageDimensions.width > 0 && imageDimensions.height > 0 && !showCropModal && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Image Dimensions: {imageDimensions.width} × {imageDimensions.height}px
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Recommended size: {TARGET_WIDTH} × {TARGET_HEIGHT}px (2:1 ratio)
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-center justify-center">
            {basicInfo.photoUrl && !showCropModal ? (
              <div className="relative w-full max-w-2xl">
                <img
                  src={basicInfo.photoUrl}
                  alt="Service preview"
                  className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-300"
                  onError={(e) => {
                    console.error("Failed to load image:", e);
                    setError("Failed to display image. Please try uploading again.");
                    handleRemoveImage();
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={triggerFileInput}
                className={`w-full max-w-md h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                  stepErrors.photoUrl 
                    ? "border-red-300 bg-red-50" 
                    : "border-gray-300 hover:border-red"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage || showCropModal}
                />
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
                    <p className="mt-2 text-sm text-gray-600">Processing image...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload service image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP up to 10MB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Recommended: {TARGET_WIDTH} × {TARGET_HEIGHT}px
                    </p>
                  </>
                )}
              </div>
            )}
            
            {/* STEP ERRORS - Use stepErrors.photoUrl for validation errors */}
            {stepErrors.photoUrl && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.photoUrl}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Service Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={basicInfo.serviceType || "ONE_TIME"}
                onChange={(e) => handleServiceTypeChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.serviceType
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-red focus:ring-red"
                }`}
              >
                {serviceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {stepErrors.serviceType && (
              <p className="mt-1 text-sm text-red-600">
                {stepErrors.serviceType}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Select Category <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={basicInfo.categoryId || ""}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                    stepErrors.categoryId
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red focus:ring-red"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-3 py-2 rounded-lg text-white hover:opacity-90 bg-red"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {stepErrors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {stepErrors.categoryId}
              </p>
            )}
            {basicInfo.categoryId && (
              <div className="mt-2 relative">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm border border-gray-200">
                  <span className="truncate">
                    {
                      categories.find(
                        (c) => c.categoryId === basicInfo.categoryId
                      )?.categoryName
                    }
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowCategoryDropdown(
                          showCategoryDropdown === basicInfo.categoryId
                            ? null
                            : basicInfo.categoryId
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showCategoryDropdown === basicInfo.categoryId && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                        <button
                          onClick={() => {
                            const cat = categories.find(
                              (c) => c.categoryId === basicInfo.categoryId
                            );
                            if (cat)
                              openEditModal(
                                "category",
                                cat.categoryId,
                                cat.categoryName
                              );
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCategory(basicInfo.categoryId)
                          }
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subcategory Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Select Sub Category <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={basicInfo.subCategoryId || ""}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      subCategoryId: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                    stepErrors.subCategoryId
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red focus:ring-red"
                  }`}
                  disabled={!basicInfo.categoryId}
                >
                  <option value="">Select subcategory</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.subCategoryId} value={sub.subCategoryId}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                onClick={() => setShowSubcategoryModal(true)}
                disabled={!basicInfo.categoryId}
                className="px-3 py-2 rounded-lg text-white hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed bg-red"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {stepErrors.subCategoryId && (
              <p className="mt-1 text-sm text-red-600">
                {stepErrors.subCategoryId}
              </p>
            )}
            {basicInfo.subCategoryId && (
              <div className="mt-2 relative">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm border border-gray-200">
                  <span className="truncate">
                    {
                      filteredSubcategories.find(
                        (s) => s.subCategoryId === basicInfo.subCategoryId
                      )?.subCategoryName
                    }
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowSubcategoryDropdown(
                          showSubcategoryDropdown === basicInfo.subCategoryId
                            ? null
                            : basicInfo.subCategoryId
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showSubcategoryDropdown === basicInfo.subCategoryId && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                        <button
                          onClick={() => {
                            const sub = filteredSubcategories.find(
                              (s) => s.subCategoryId === basicInfo.subCategoryId
                            );
                            if (sub)
                              openEditModal(
                                "subcategory",
                                sub.subCategoryId,
                                sub.subCategoryName
                              );
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSubcategory(basicInfo.subCategoryId)
                          }
                          className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents Required - Only for RECURRING services */}
          {basicInfo.serviceType === "RECURRING" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Documents Required
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border-gray-200 group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={basicInfo.documentsRequired || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setBasicInfo((prev) => ({
                        ...prev,
                        documentsRequired: checked,
                      }));
                      if (!checked) {
                        setRequiredDocuments([]);
                      } else if (requiredDocuments.length === 0) {
                        setRequiredDocuments([{ id: Date.now(), documentName: "", inputType: "file" }]);
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 accent-red cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Service requires document upload</span>
                  <p className="text-xs text-gray-500 mt-0.5">Clients must submit documents to proceed</p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Required Documents List — shown only for RECURRING + documentsRequired */}
        {basicInfo.serviceType === "RECURRING" && basicInfo.documentsRequired && (
          <div className="border border-dashed border-red/40 rounded-xl bg-red/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Required Documents</h3>
                  <p className="text-xs text-gray-500">Define what clients must upload or fill</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setRequiredDocuments((prev) => [
                    ...prev,
                    { id: Date.now(), documentName: "", inputType: "file" },
                  ])
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red text-white hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Document
              </button>
            </div>

            {stepErrors.requiredDocuments && (
              <div className="mb-3 flex items-center gap-2 bg-red/10 border border-red/30 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-red flex-shrink-0" />
                <p className="text-xs text-red font-medium">{stepErrors.requiredDocuments}</p>
              </div>
            )}

            {requiredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <AlertCircle className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No documents added yet. Click "Add Document" to start.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requiredDocuments.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
                  >
                    {/* Index badge */}
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow text-gray-900 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>

                    {/* Document name */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Document Name <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        value={doc.documentName}
                        onChange={(e) => {
                          setRequiredDocuments((prev) =>
                            prev.map((d) =>
                              d.id === doc.id ? { ...d, documentName: e.target.value } : d
                            )
                          );
                          // Clear per-doc error on type
                          if (stepErrors[`doc_${idx}_name`]) {
                            setStepErrors(prev => { const n = {...prev}; delete n[`doc_${idx}_name`]; return n; });
                          }
                        }}
                        placeholder="e.g. sales_report, aadhar_card"
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 placeholder-gray-400 ${
                          stepErrors[`doc_${idx}_name`]
                            ? "border-red focus:ring-red focus:border-red"
                            : "border-gray-300 focus:ring-red focus:border-red"
                        }`}
                      />
                      {stepErrors[`doc_${idx}_name`] && (
                        <p className="mt-1 text-xs text-red">{stepErrors[`doc_${idx}_name`]}</p>
                      )}
                    </div>

                    {/* Input type */}
                    <div className="w-full sm:w-40 flex-shrink-0">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Input Type
                      </label>
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden text-xs font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setRequiredDocuments((prev) =>
                              prev.map((d) =>
                                d.id === doc.id ? { ...d, inputType: "file" } : d
                              )
                            )
                          }
                          className={`flex-1 flex items-center justify-center gap-1 py-2 transition-colors ${
                            doc.inputType === "file"
                              ? "bg-red text-white"
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Upload className="w-3 h-3" />
                          File
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRequiredDocuments((prev) =>
                              prev.map((d) =>
                                d.id === doc.id ? { ...d, inputType: "text" } : d
                              )
                            )
                          }
                          className={`flex-1 flex items-center justify-center gap-1 py-2 border-l border-gray-300 transition-colors ${
                            doc.inputType === "text"
                              ? "bg-red text-white"
                              : "bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Type className="w-3 h-3" />
                          Text
                        </button>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() =>
                        setRequiredDocuments((prev) => prev.filter((d) => d.id !== doc.id))
                      }
                      className="flex-shrink-0 p-2 rounded-lg text-red hover:bg-red/10 transition-colors mt-4 sm:mt-0"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preview summary */}
            {requiredDocuments.some((d) => d.documentName.trim()) && (
              <div className="mt-4 pt-3 border-t border-red/20">
                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                <div className="flex flex-wrap gap-2">
                  {requiredDocuments
                    .filter((d) => d.documentName.trim())
                    .map((d) => (
                      <span
                        key={d.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700"
                      >
                        {d.inputType === "file" ? (
                          <Upload className="w-3 h-3 text-red" />
                        ) : (
                          <Type className="w-3 h-3 text-yellow" />
                        )}
                        {d.documentName}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recurring Service Fields - Conditionally shown */}
        {basicInfo.serviceType === "RECURRING" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
            {/* Frequency Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Frequency <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={basicInfo.frequency || ""}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                    stepErrors.frequency
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red focus:ring-red"
                  }`}
                >
                  <option value="">Select frequency</option>
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {stepErrors.frequency && (
                <p className="mt-1 text-sm text-red-600">
                  {stepErrors.frequency}
                </p>
              )}
            </div>

            {/* Duration Unit Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Duration Unit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={basicInfo.durationUnit || ""}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      durationUnit: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                    stepErrors.durationUnit
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red focus:ring-red"
                  }`}
                >
                  <option value="">Select unit</option>
                  {durationUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {stepErrors.durationUnit && (
                <p className="mt-1 text-sm text-red-600">
                  {stepErrors.durationUnit}
                </p>
              )}
            </div>

            {/* Duration Value Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Duration Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={basicInfo.duration || ""}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                placeholder="e.g., 12"
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.duration
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-red focus:ring-red"
                }`}
              />
              {stepErrors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  {stepErrors.duration}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={basicInfo.name || ""}
            onChange={(e) =>
              setBasicInfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="New GST Registration – Your Business"
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
              stepErrors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-red focus:ring-red"
            }`}
          />
          {stepErrors.name && (
            <p className="mt-1 text-sm text-red-600">{stepErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={basicInfo.description || ""}
            onChange={(e) =>
              setBasicInfo((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Register your business with GST and get your GSTIN issued to legally sell goods or services in India."
            className={`w-full px-4 py-2 border rounded-lg h-32 resize-none text-sm focus:outline-none focus:ring-1 ${
              stepErrors.description
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-red focus:ring-red"
            }`}
          />
          {stepErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {stepErrors.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-6 py-2 rounded-lg font-medium bg-red text-white hover:opacity-90"
        >
          Next
        </button>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Crop Image to 1024×512</h3>
              <button
                onClick={handleCancelCrop}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Show image dimensions in crop modal */}
            {imageDimensions.width > 0 && imageDimensions.height > 0 && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Original: {imageDimensions.width} × {imageDimensions.height}px
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Target: {TARGET_WIDTH} × {TARGET_HEIGHT}px (2:1 ratio)
                    </p>
                  </div>
                  {imageDimensions.width < TARGET_WIDTH || imageDimensions.height < TARGET_HEIGHT ? (
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Small Image
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Good Size
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="relative w-full h-96 mb-4">
              <Cropper
                image={basicInfo.photoUrl}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT_RATIO} // 2:1 aspect ratio
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    backgroundColor: "#f3f4f6",
                  },
                }}
              />
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1x</span>
                  <span>2x</span>
                  <span>3x</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCropComplete}
                disabled={uploadingImage}
                className="flex-1 py-3 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-red"
              >
                {uploadingImage ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Crop to ${TARGET_WIDTH}×${TARGET_HEIGHT}`
                )}
              </button>
              <button
                onClick={handleCancelCrop}
                className="px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Category
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 bg-red"
              >
                Add Category
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Subcategory
              </h3>
              <button
                onClick={() => setShowSubcategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-700">
                Selected Category
              </label>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800">
                {categories.find((c) => c.categoryId === basicInfo.categoryId)
                  ?.categoryName || "No category selected"}
              </div>
            </div>
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="Subcategory name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddSubcategory}
                disabled={!basicInfo.categoryId}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-red"
              >
                Add Subcategory
              </button>
              <button
                onClick={() => setShowSubcategoryModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit {showEditModal === "category" ? "Category" : "Subcategory"}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(null);
                  setEditId(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {showEditModal === "subcategory" && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={basicInfo.categoryId || ""}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
            <input
              type="text"
              value={
                showEditModal === "category"
                  ? newCategoryName
                  : newSubcategoryName
              }
              onChange={(e) =>
                showEditModal === "category"
                  ? setNewCategoryName(e.target.value)
                  : setNewSubcategoryName(e.target.value)
              }
              placeholder={
                showEditModal === "category"
                  ? "Category name"
                  : "Subcategory name"
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red"
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  showEditModal === "category"
                    ? handleEditCategory(editId)
                    : handleEditSubcategory(editId)
                }
                disabled={
                  showEditModal === "subcategory" && !basicInfo.categoryId
                }
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-red"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(null);
                  setEditId(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}