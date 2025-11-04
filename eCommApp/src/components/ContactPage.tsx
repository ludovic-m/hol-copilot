import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface ContactFormData {
    name: string;
    email: string;
    request: string;
}

const ContactPage = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        request: ''
    });
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleContinue = () => {
        setShowModal(false);
        setFormData({
            name: '',
            email: '',
            request: ''
        });
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="request">Request</label>
                            <textarea
                                id="request"
                                name="request"
                                value={formData.request}
                                onChange={handleInputChange}
                                rows={5}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <p>Thank you for your message.</p>
                        <button onClick={handleContinue} className="continue-btn">Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
