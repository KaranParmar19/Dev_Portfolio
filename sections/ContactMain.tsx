'use client'
import ContactSection from '@/app/components/contact/ContactSection';
import ContactPage from '@/app/components/contact/test';
import React from 'react';

const ContactMain = () => {
    return (
        <div className="text-black overflow-hidden">
            <div id="ContactSection">
                <ContactSection />
            </div>
            <ContactPage />
        </div>
    );
};

export default ContactMain;