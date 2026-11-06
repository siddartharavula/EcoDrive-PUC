
import React from "react";

const CertificateUpload = ({ file, setFile }) => {

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    const types = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (!types.includes(selected.type)) {
      alert("Only PDF, JPG and PNG files are allowed");
      e.target.value = "";
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5MB");
      e.target.value = "";
      return;
    }

    setFile(selected);
  };

  return (
    <div>
      <label className="block text-white font-semibold mb-3">
        PUC Certificate
      </label>

      <label
        htmlFor="pucFile"
        className="block cursor-pointer border-2 border-dashed
          border-gray-600 hover:border-green-500 rounded-xl p-8
          text-center transition bg-gray-900/40"
      >
        <div className="text-4xl text-green-500 mb-3">↑</div>

        <p className="text-white font-medium">
          Click to choose your certificate
        </p>

        <p className="text-gray-400 text-sm mt-2">
          PDF, JPG or PNG · Maximum 5MB
        </p>

        <input
          id="pucFile"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-4 flex items-center justify-between
          gap-3 bg-gray-700 p-4 rounded-lg">

          <div className="min-w-0">
            <p className="text-green-400 font-medium truncate">
              {file.name}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFile(null);
              document.getElementById("pucFile").value = "";
            }}
            className="text-red-400 hover:text-red-300"
          >
            Remove
          </button>

        </div>
      )}
    </div>
  );
};

export default CertificateUpload;
