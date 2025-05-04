import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormStatus({
          submitted: true,
          error: false,
          message: 'Message sent successfully!'
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
      setFormStatus({
        submitted: true,
        error: true,
        message: 'Network error. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="bg-[#0d2639] text-white py-24 px-4 md:px-8 flex flex-col justify-center" 
               style={{ minHeight: '500px' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact</h1>
          <a href="#contact" 
             className="inline-block px-6 py-3 border-2 border-white rounded-full font-medium hover:bg-white hover:text-[#0d2639] transition-colors">
            Get in touch
          </a>
        </div>
      </section>
      
      <section className="bg-[#0d2639] text-white py-24 px-4 md:px-8 flex flex-col justify-center relative" 
               style={{ minHeight: '500px' }}>
        <div className="absolute top-5 right-5 bg-white/80 px-4 py-2 rounded-lg flex items-center gap-2">
          <span>Restyle</span>
          <span>↑</span>
          <span>↓</span>
          <span>⏎0</span>
          <span>...</span>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Build Your Dream PC<br />Today
          </h2>
          <p className="text-xl max-w-2xl mb-8">
            Discover top-quality PC parts tailored for every need. From cutting-edge 
            graphics cards to reliable processors, we've got what you need to power up.
          </p>
          <a href="#shop" 
             className="inline-block px-6 py-3 border-2 border-white rounded-full font-medium hover:bg-white hover:text-[#0d2639] transition-colors">
            Shop Now
          </a>
        </div>
      </section>
      
      {/* Contact Section (Image 2) */}
      <section id="contact" className="bg-white py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0d2639] mb-4">Get in touch</h2>
            <p className="text-lg text-gray-700 mb-8">
              Send us a message and we'll get back to you as soon as we can.
            </p>
          </div>
          
          <div className="flex-1">
            {formStatus.submitted && (
              <div className={`p-4 mb-6 rounded-lg ${formStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-100 rounded-lg"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-100 rounded-lg"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-100 rounded-lg min-h-[150px]"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="bg-[#0d2639] text-white px-8 py-4 rounded-full font-medium hover:bg-[#0a1c2a] transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;