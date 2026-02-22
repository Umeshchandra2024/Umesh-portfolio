import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      console.log('Sending to:', `${API_BASE}/api/v1/message`);
      const { data } = await axios.post(
        `${API_BASE}/api/v1/message`,
        { name, email, subject, message },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      console.log('Response:', data);
      toast.success(data.info || data.message || 'Message sent successfully.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Contact form error:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to send message. Please check your connection.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="title-line" />
          <h2
            className="flex gap-4 items-center text-[1.85rem] sm:text-[2.4rem] md:text-[2.7rem] 
            lg:text-[2.9rem] leading-[56px] md:leading-[67px] lg:leading-[80px] 
            tracking-[10px] mx-auto w-fit font-extrabold about-h1"
          >
            CONTACT
            <span className="text-tubeLight-effect font-extrabold">ME</span>
          </h2>
          <div className="title-line" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          <div className="contact-field">
            <label className="contact-label" htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              className="form-input form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
            />
          </div>
          <div className="flex justify-end">
            {!loading ? (
              <button type="submit" className="btn btn-primary w-full sm:w-52">
                SEND MESSAGE
              </button>
            ) : (
              <button
                disabled
                type="button"
                className="w-full sm:w-52 text-slate-900 bg-white hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-slate-950 animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Sending...
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
