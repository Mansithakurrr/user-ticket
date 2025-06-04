// 'use client';

// import React, { useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// type TicketConfirmation = {
//   serialNumber: string;
//   createdAt: string;
//   status: string;
// };

// export default function TicketForm() {
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [confirmation, setConfirmation] = useState<TicketConfirmation | null>(null);

//   // Extract URL parameters
//   const searchParams = useSearchParams();
//   const platform = searchParams.get('platform') || 'Lighthouse';
//   const organization = searchParams.get('organization') || 'Msil';
//   const category = searchParams.get('category') || 'others';

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);
//     setConfirmation(null);

//     const formData = new FormData(e.currentTarget);

//     try {
//       const res = await fetch('/api/tickets', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || 'Failed to submit ticket');

//       setConfirmation({
//         serialNumber: result.ticket.serialNumber,
//         createdAt: result.ticket.createdAt,
//         status: result.ticket.status,
//       });
//       e.currentTarget.reset();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleString('en-GB', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   if (confirmation) {
//     return (
//       <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg mx-auto mt-10 border border-green-100">
//         <h2 className="text-2xl font-bold text-green-600 mb-3">✅ Request Submitted!</h2>
//         <p className="text-gray-700 mb-4">Your ticket has been submitted successfully.</p>
//         <div className="space-y-2 text-gray-800 text-sm">
//           <p><span className="font-semibold">Ticket Number:</span> {confirmation.serialNumber}</p>
//           <p><span className="font-semibold">Time Created:</span> {formatDate(confirmation.createdAt)}</p>
//           <p><span className="font-semibold">Status:</span> {confirmation.status.toUpperCase()}</p>
//         </div>
//         <div className="mt-6 text-right">
//           <button
//             onClick={() => setConfirmation(null)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-6 border border-gray-200"
//     >
//       <h2 className="text-2xl font-bold text-gray-800">Submit a Support Ticket</h2>

//       <div>
//         <label className="block text-sm font-medium mb-1">Name</label>
//         <input
//           name="name"
//           required
//           defaultValue="aashi User"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Email</label>
//         <input
//           type="email"
//           name="email"
//           required
//           defaultValue="test.user@mycompany.com"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Mobile Number</label>
//         <input
//           name="contactNumber"
//           placeholder="Enter your phone number"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Subject</label>
//         <input
//           name="subject"
//           required
//           placeholder="Issue Title"
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Description</label>
//         <textarea
//           name="description"
//           required
//           placeholder="Please describe your issue"
//           rows={4}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Attachments</label>
//         <input
//           type="file"
//           name="attachments"
//           multiple
//           className="w-full text-gray-600"
//         />
//         <p className="text-xs text-gray-500 mt-1">Max 5 files, up to 10MB each</p>
//       </div>

//       {/* Hidden fields with dynamic values from URL */}
//       <input type="hidden" name="platform" value={platform} />
//       <input type="hidden" name="organization" value={organization} />
//       <input type="hidden" name="category" value={category} />
//       <input type="hidden" name="type" value="Support" />

//       <div>
//         <button
//           type="submit"
//           disabled={submitting}
//           className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {submitting ? 'Submitting...' : 'Submit Ticket'}
//         </button>
//       </div>

//       {error && <p className="text-red-600 text-sm">⚠️ {error}</p>}
//     </form>
//   );
// }
