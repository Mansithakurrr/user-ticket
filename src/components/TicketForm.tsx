'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

type TicketConfirmation = {
  serialNumber: string;
  createdAt: string;
  status: string;
};

export default function TicketForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<TicketConfirmation | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const searchParams = useSearchParams();
  const platform = searchParams.get('platform') || 'Lighthouse';
  const organization = searchParams.get('organization') || 'Msil';
  const category = searchParams.get('category') || 'others';
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';


  const onDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length + files.length > 5) {
      setError("You can upload up to 5 files only.");
      return;
    }
    setFiles(prev => [...prev, ...validFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt'],
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setConfirmation(null);

    const formData = new FormData(e.currentTarget);
    files.forEach(file => formData.append("attachments", file));

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to submit ticket');

      setConfirmation({
        serialNumber: result.ticket.serialNumber,
        createdAt: result.ticket.createdAt,
        status: result.ticket.status,
      });
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  const StatusBadge = ({ status }: { status: string }) => {
    const statusClasses = {
      New: "bg-blue-100 text-blue-800",
      Open: "bg-orange-100 text-orange-800",
      InProgress: "bg-purple-100 text-purple-800",
      Hold: "bg-red-100 text-red-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-200 text-black", // Matched your existing color
    };
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {status}
      </span>
    );
  };

  if (confirmation) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl mx-auto mt-12 border border-green-200 transition-all duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            ✅ Request Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your ticket has been submitted successfully.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 font-poppins">
              Ticket Number: {confirmation.serialNumber}
            </h4>
            <div className="space-y-2 text-gray-700 text-sm text-center">
              <p>
                <span className="font-medium">Time Created:</span>{' '}
                {formatDate(confirmation.createdAt)}
              </p>
              <p className="flex items-center font-bold justify-center gap-2">
                <span className="font-medium">Status:</span>
                {<StatusBadge status={confirmation.status} />}
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfirmation(null)}
            className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition duration-200"
          >
            Done
          </button>
        </div>
      </div>
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg space-y-4 border border-gray-200 bg-fixed"
    >
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Submit a Support Ticket
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          required
          value={name}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          value={email}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mobile Number (Optional)</label>
        <input
          name="contactNumber"
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="Enter phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          defaultValue={category}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bugs">Bugs</option>
          <option value="Tech support">Tech Support</option>
          <option value="new feature">New Feature</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input
          name="subject"
          required
          minLength={1}
          maxLength={20}
          placeholder="Issue Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          required
          minLength={1}
          maxLength={20}
          placeholder="Describe your issue"
          rows={1}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Attachments</label>
        <div
          {...getRootProps()}
          className={`w-full p-4 border-2 border-dashed rounded-md cursor-pointer text-center ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-sm text-blue-700">Drop files here...</p>
          ) : (
            <p className="text-sm text-gray-600">Drag & drop files here, or click to select</p>
          )}
          <p className="text-xs text-gray-400 mt-1">Max 5 files, 10MB each</p>
        </div>

        {files.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                <button
                  type="button"
                  onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <input
              type="file"
              name="attachments"
              multiple
              className="w-full text-sm text-gray-600"
            /> */}
      {/* <p className="text-xs text-gray-500 mt-1">Max 5 files, up to 10MB each</p> */}
    {/* </div> */}







          
      
          {/* Hidden Fields */ }
          <input type="hidden" name="platform" value={platform} />
          <input type="hidden" name="organization" value={organization} />
          <input type="hidden" name="type" value="Support" />
      
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>

  { error && <p className="text-center text-sm text-red-600 mt-2">⚠️ {error}</p> }
        </form >
      );

}
