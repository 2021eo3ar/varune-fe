import React, { useState } from "react";
import { X, Sparkles, Info } from "lucide-react";
import { NarrativeParameters } from "../../types";

interface NarrativeFormProps {
  type: "short" | "long";
  onSubmit: (parameters: NarrativeParameters) => void;
  onClose: () => void;
}

const NarrativeForm: React.FC<NarrativeFormProps> = ({
  type,
  onSubmit,
  onClose,
}) => {
  const [parameters, setParameters] = useState<NarrativeParameters>({
    industry: "",
    brandValues: "",
    targetAudience: "",
    brandMission: "",
    uniqueSellingProposition: "",
    // Long narrative fields
    toneOfVoice: "",
    brandPersonality: "",
    brandVision: "",
    keyProducts: "",
    brandStory: "",
  });

  const [errors, setErrors] = useState<Partial<NarrativeParameters>>({});

  const validateForm = () => {
    const newErrors: Partial<NarrativeParameters> = {};

    // Required fields for both short and long narratives
    if (!parameters.industry.trim())
      newErrors.industry = "Industry is required";
    if (!parameters.brandValues.trim())
      newErrors.brandValues = "Brand values are required";
    if (!parameters.targetAudience.trim())
      newErrors.targetAudience = "Target audience is required";
    if (!parameters.brandMission.trim())
      newErrors.brandMission = "Brand mission is required";
    if (!parameters.uniqueSellingProposition.trim())
      newErrors.uniqueSellingProposition = "USP is required";

    // Additional validations for long narrative
    if (type === "long") {
      if (!parameters.toneOfVoice?.trim())
        newErrors.toneOfVoice = "Tone of voice is required";
      if (!parameters.brandPersonality?.trim())
        newErrors.brandPersonality = "Brand personality is required";
      if (!parameters.brandVision?.trim())
        newErrors.brandVision = "Brand vision is required";
      if (!parameters.keyProducts?.trim())
        newErrors.keyProducts = "Key products are required";
      if (!parameters.brandStory?.trim())
        newErrors.brandStory = "Brand story is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(parameters);
      onClose();
    }
  };

  const handleInputChange = (
    field: keyof NarrativeParameters,
    value: string
  ) => {
    setParameters((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {type === "short" ? "Short" : "Long"} Brand Narrative
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type === "short"
                  ? "Quick brand story generation"
                  : "Comprehensive brand narrative with detailed positioning"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry *
              </label>
              <input
                type="text"
                value={parameters.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                placeholder="e.g., Technology, Healthcare, Fashion"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  errors.industry
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                value={parameters.targetAudience}
                onChange={(e) =>
                  handleInputChange("targetAudience", e.target.value)
                }
                placeholder="e.g., Tech-savvy millennials, Small business owners"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  errors.targetAudience
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.targetAudience && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetAudience}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand Values *
            </label>
            <textarea
              value={parameters.brandValues}
              onChange={(e) => handleInputChange("brandValues", e.target.value)}
              placeholder="e.g., Innovation, Sustainability, Customer-centricity"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.brandValues
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.brandValues && (
              <p className="text-red-500 text-xs mt-1">{errors.brandValues}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand Mission *
            </label>
            <textarea
              value={parameters.brandMission}
              onChange={(e) =>
                handleInputChange("brandMission", e.target.value)
              }
              placeholder="e.g., To democratize access to cutting-edge technology"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.brandMission
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.brandMission && (
              <p className="text-red-500 text-xs mt-1">{errors.brandMission}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unique Selling Proposition *
            </label>
            <textarea
              value={parameters.uniqueSellingProposition}
              onChange={(e) =>
                handleInputChange("uniqueSellingProposition", e.target.value)
              }
              placeholder="e.g., The only platform that combines AI with human creativity"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                errors.uniqueSellingProposition
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.uniqueSellingProposition && (
              <p className="text-red-500 text-xs mt-1">
                {errors.uniqueSellingProposition}
              </p>
            )}
          </div>

          {/* Long Narrative Additional Fields */}
          {type === "long" && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Additional Details for Comprehensive Narrative
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tone of Voice *
                    </label>
                    <input
                      type="text"
                      value={parameters.toneOfVoice || ""}
                      onChange={(e) =>
                        handleInputChange("toneOfVoice", e.target.value)
                      }
                      placeholder="e.g., Professional yet approachable"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.toneOfVoice
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.toneOfVoice && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.toneOfVoice}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand Personality *
                    </label>
                    <input
                      type="text"
                      value={parameters.brandPersonality || ""}
                      onChange={(e) =>
                        handleInputChange("brandPersonality", e.target.value)
                      }
                      placeholder="e.g., Innovative, reliable, empathetic"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.brandPersonality
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.brandPersonality && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.brandPersonality}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand Vision *
                  </label>
                  <textarea
                    value={parameters.brandVision || ""}
                    onChange={(e) =>
                      handleInputChange("brandVision", e.target.value)
                    }
                    placeholder="e.g., To be the global leader in sustainable fashion"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.brandVision
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.brandVision && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.brandVision}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Products *
                  </label>
                  <textarea
                    value={parameters.keyProducts || ""}
                    onChange={(e) =>
                      handleInputChange("keyProducts", e.target.value)
                    }
                    placeholder="e.g., Eco-friendly sneakers, recycled material backpacks"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.keyProducts
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.keyProducts && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.keyProducts}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand Story *
                  </label>
                  <textarea
                    value={parameters.brandStory || ""}
                    onChange={(e) =>
                      handleInputChange("brandStory", e.target.value)
                    }
                    placeholder="e.g., Founded by visionaries who wanted to change the world through design..."
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.brandStory
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.brandStory && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.brandStory}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Generate Narrative</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NarrativeForm;
