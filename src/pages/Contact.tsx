import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false, message: '' });
  const [isSending, setIsSending] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setFormStatus({ submitted: false, error: false, message: 'Sending...' });

    try {
      const response = await fetch('api/contact.php', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      const responseBodyText = await response.clone().text(); // Dùng clone() để có thể đọc body nhiều lần nếu cần
      console.log('Body phản hồi (dạng text thô):', responseBodyText);
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
         data = await response.json();
      } else {
          const textData = await response.text();
          console.error("Received non-JSON response:", textData);
          throw new Error("Server returned an unexpected response.");
      }

      if (response.ok && data.success) {
        setFormStatus({
          submitted: true,
          error: false,
          message: data.message || 'Message sent successfully!'
        });
        setFormData({ name: '', email: '', message: '' }); 
      } else {
        setFormStatus({
          submitted: true,
          error: true,
          message: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
        console.error("Form submission error:", error);
        let message = 'Something went wrong. Please try again.';
         if (error instanceof Error && error.message.includes("NetworkError")) {
            message = 'Network error. Please check your connection.';
        } else if (error instanceof Error && error.message.includes("unexpected response")) {
             message = 'Received an unexpected response from the server.';
        }
        setFormStatus({
            submitted: true,
            error: true,
            message: message
        });
    } finally {
        setIsSending(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Contact Us
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Have questions? Send us a message!
          </p>
        </div>

        {formStatus.message && (
            <div className={`p-4 rounded-md text-sm ${formStatus.error ? 'bg-red-100 text-red-700' : (formStatus.message === 'Sending...' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}`}>
                {formStatus.message}
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name" name="name" type="text" required autoComplete="name"
                value={formData.name} onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={formData.email} onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
             <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message" name="message" rows={4} required
                value={formData.message} onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Your Message"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;