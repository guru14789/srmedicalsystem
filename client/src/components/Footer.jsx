import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin,
  Linkedin, Twitter, Instagram, X
} from 'lucide-react';

import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const HIDE_FOOTER_PAGES = ['/login', '/register', '/forgot-password'];
  if (HIDE_FOOTER_PAGES.includes(location.pathname)) {
    return null;
  }

  return (

    <footer className="relative bg-[#1a1a1a] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 medical-pattern opacity-[0.03]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#373086] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#373086]/20">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">SR Medical System</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8">
              Supporting healthcare with trusted medical technology since 2005. Your vision, our mission to deliver excellence in every device.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { Icon: Linkedin, href: "https://www.linkedin.com/company/srmedicalsystem" },
                { Icon: Twitter, href: "https://twitter.com/srmedicalsystem" },
                { Icon: Instagram, href: "https://www.instagram.com/srmedicalsystem" }
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#373086] hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'Store', path: '/store' },
                { label: 'Services', path: '/services' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#373086] opacity-0 group-hover:opacity-100 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-bold mb-8">Policies & Support</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setShowRefund(true)} className="text-gray-400 hover:text-white transition-all">Refund Policy</button>
              </li>
              <li>
                <button onClick={() => setShowPrivacy(true)} className="text-gray-400 hover:text-white transition-all">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setShowTerms(true)} className="text-gray-400 hover:text-white transition-all">Terms of Service</button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-8">Get In Touch</h4>
            <div className="space-y-5 text-gray-400">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#373086] flex-shrink-0 mt-1" size={20} />
                <span className="text-sm leading-relaxed">No:18, Bajanai Koil Street, Rajakilpakkam, Chennai – 600073, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-[#373086] flex-shrink-0" size={20} />
                <span className="text-sm">+91 7200025642</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-[#373086] flex-shrink-0" size={20} />
                <span className="text-sm break-all">info.srmedicalsystem@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <p>© 2025 SR Medical System. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>System Online</span>
            </div>
            <span>Design by SR Medical Team</span>
          </div>
        </div>
      </div>


      {/* Modal Overlay */}
      {(showPrivacy || showTerms || showRefund) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white text-gray-800 rounded-2xl w-[90%] max-w-2xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowPrivacy(false);
                setShowTerms(false);
                setShowRefund(false);
              }}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {showPrivacy && (
              <>
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <p className="text-sm text-gray-600 mb-6">SR Medical System | Last Updated: June 22, 2025</p>

                <p className="mb-6 text-gray-700">
                  SR Medical System is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you access or use our website (<a href="https://www.srmedicalsystem.in" target="_blank" rel="noopener noreferrer" className="text-[#373086] hover:underline">https://www.srmedicalsystem.in</a>) or services.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1. Information We Collect</h3>
                    <p className="text-gray-700 text-sm mb-2 ml-2">We collect the following types of information:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li><strong>Personal Details:</strong> Name, phone number, email address, and postal address (including state, province, ZIP/postal code, and city).</li>
                      <li><strong>Health-Related Information:</strong> Collected only with your explicit consent.</li>
                      <li><strong>Website Usage Data:</strong> IP address, browser type/version, device information, pages visited, visit duration, and other diagnostic data.</li>
                      <li><strong>Payment Information:</strong> Processed securely via our banking partner, Karur Vysya Bank (KVB). We do not store card or bank account details.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">2. How We Use Your Information</h3>
                    <p className="text-gray-700 text-sm mb-2 ml-2">We use your information to:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>Provide and maintain medical technology services and technical support</li>
                      <li>Enhance user experience and improve our website and services</li>
                      <li>Process transactions and fulfill contractual obligations</li>
                      <li>Communicate updates, security alerts, or promotional content (with opt-out options)</li>
                      <li>Comply with legal and regulatory requirements</li>
                      <li>Analyze usage trends to optimize our services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">3. Cookies and Tracking Technologies</h3>
                    <p className="text-gray-700 text-sm mb-2 ml-2">Our website uses cookies to improve functionality, remember preferences, and analyze usage. These include:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li><strong>Essential Cookies:</strong> Enable core website features and user authentication</li>
                      <li><strong>Preference Cookies:</strong> Store your settings (e.g., language or login details)</li>
                      <li><strong>Analytics Cookies:</strong> Track usage for service improvements</li>
                    </ul>
                    <p className="text-gray-700 text-sm mt-2 ml-2">Cookies do not collect sensitive data. You may disable cookies in your browser settings, though this may impact website functionality.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">4. Data Sharing</h3>
                    <p className="text-gray-700 text-sm mb-2 ml-2">We may share your information:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>With service providers to support service delivery, analytics, or communication</li>
                      <li>During business transactions (e.g., mergers or acquisitions)</li>
                      <li>With affiliates who adhere to this Privacy Policy</li>
                      <li>With business partners for promotional offers</li>
                      <li>In public areas of our website, if you share content</li>
                      <li>With your consent, for other purposes</li>
                      <li>To comply with legal obligations or protect our rights, property, or user safety</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">5. Data Retention</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      We retain personal data only as long as necessary for the purposes outlined or to meet legal obligations. Usage data is retained for shorter periods unless required for security or service improvement.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">6. Data Transfers</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      Your information may be processed or stored outside your jurisdiction, where data protection laws may differ. By using our services, you consent to such transfers. We implement safeguards to protect your data.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">7. Your Rights</h3>
                    <p className="text-gray-700 text-sm mb-2 ml-2">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>Access, update, or delete your personal information via your account or by contacting us</li>
                      <li>Withdraw consent for data processing at any time</li>
                    </ul>
                    <p className="text-gray-700 text-sm mt-2 ml-2"><strong>Note:</strong> Certain data may be retained to comply with legal requirements.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">8. Data Security</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      We use encryption, secure hosting, and access controls to protect your data. However, no internet or storage method is completely secure, and we cannot guarantee absolute security.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">9. Children's Privacy</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      Our services are not intended for individuals under 13. We do not knowingly collect data from minors without parental consent. If such data is collected, we will delete it upon notification.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">10. Third-Party Links</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      Our website may contain links to third-party sites. We are not responsible for their content or privacy practices. Review their policies before sharing any personal information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">11. Policy Updates</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      We may update this Privacy Policy periodically. Updates will be posted on our website, with notifications via email or prompts for significant changes. Please review this policy regularly.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">12. Contact Us</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">For any questions or concerns about this Privacy Policy, contact:</p>
                    <div className="text-gray-700 text-sm ml-2 space-y-1">
                      <p><strong>SR Medical System</strong></p>
                      <p>No: 18/2, Bajanai Koil Street</p>
                      <p>Rajakilpakkam, Chennai – 600073</p>
                      <p>Tamil Nadu, India</p>
                      <p><strong>Email:</strong> <a href="mailto:info.srmedicalsystem@gmail.com" className="text-[#373086] hover:underline">info.srmedicalsystem@gmail.com</a></p>
                      <p><strong>Website:</strong> <a href="https://www.srmedicalsystem.in" target="_blank" rel="noopener noreferrer" className="text-[#373086] hover:underline">https://www.srmedicalsystem.in</a></p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {showTerms && (
              <>
                <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
                <p className="text-sm text-gray-600 mb-6">Welcome to SR Medical Systemh!</p>

                <p className="mb-6 text-gray-700">
                  These terms and conditions outline the rules and regulations for the use of Sreemediec's Website, located at <a href="https://srmedicalsystem.in" target="_blank" rel="noopener noreferrer" className="text-[#373086] hover:underline">https://srmedicalsystem.in</a>
                </p>

                <p className="mb-6 text-gray-700">
                  By accessing this website, we assume you accept these terms and conditions. Do not continue to use SR Medical System if you do not agree to take all of the terms and conditions stated on this page.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cookies</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">
                      The website uses cookies to help personalize your online experience. By accessing SR Medical System, you agreed to use the required cookies.
                    </p>
                    <p className="text-gray-700 text-sm ml-2 mb-2">
                      A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you and can only be read by a web server in the domain that issued the cookie to you.
                    </p>
                    <p className="text-gray-700 text-sm ml-2">
                      We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the ability to accept or decline optional Cookies. There are some required Cookies that are necessary for the operation of our website. These cookies do not require your consent as they always work. Please keep in mind that by accepting required Cookies, you also accept third-party Cookies, which might be used via third-party provided services if you use such services on our website.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">License</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">
                      Unless otherwise stated, Sreemediec and/or its licensors own the intellectual property rights for all material on SR Medical System. All intellectual property rights are reserved. You may access this from SR Medical System for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>
                    <p className="text-gray-700 text-sm ml-2 mb-2">You must not:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>Copy or republish material from SR Medical System</li>
                      <li>Sell, rent, or sub-license material from SR Medical System</li>
                      <li>Reproduce, duplicate or copy material from SR Medical System</li>
                      <li>Redistribute content from SR Medical System</li>
                    </ul>
                    <p className="text-gray-700 text-sm ml-2 mt-2">This Agreement shall begin on the date hereof.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">User Comments</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">
                      Parts of this website offer users an opportunity to post and exchange opinions and information in certain areas of the website. Sreemediec does not filter, edit, publish or review Comments before their presence on the website. Comments do not reflect the views and opinions of Sreemediec, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
                    </p>
                    <p className="text-gray-700 text-sm ml-2 mb-2">
                      Sreemediec reserves the right to monitor all Comments and remove any Comments that can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.
                    </p>
                    <p className="text-gray-700 text-sm ml-2 mb-2">You warrant and represent that:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so</li>
                      <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent, or trademark of any third party</li>
                      <li>The Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy</li>
                      <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity</li>
                    </ul>
                    <p className="text-gray-700 text-sm ml-2 mt-2">
                      You hereby grant Sreemediec a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats, or media.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Hyperlinking to Our Content</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">The following organizations may link to our Website without prior written approval:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>Government agencies</li>
                      <li>Search engines</li>
                      <li>News organizations</li>
                      <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses</li>
                      <li>System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site</li>
                    </ul>
                    <p className="text-gray-700 text-sm ml-2 mt-2">
                      These organizations may link to our home page, to publications, or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Content Liability</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are raised on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Reservation of Rights</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Removal of Links from Our Website</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links, but we are not obligated to or so or to respond to you directly.
                    </p>
                    <p className="text-gray-700 text-sm ml-2 mt-2">
                      We do not ensure that the information on this website is correct. We do not warrant its completeness or accuracy, nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">
                      To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      <li>Limit or exclude our or your liability for death or personal injury</li>
                      <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</li>
                      <li>Limit any of our or your liabilities in any way that is not permitted under applicable law</li>
                      <li>Exclude any of our or your liabilities that may not be excluded under applicable law</li>
                    </ul>
                    <p className="text-gray-700 text-sm ml-2 mt-2">
                      The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
                    </p>
                    <p className="text-gray-700 text-sm ml-2 mt-2">
                      As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                    </p>
                  </div>
                </div>
              </>
            )}

            {showRefund && (
              <>
                <h2 className="text-2xl font-bold mb-4">Refund Policy</h2>
                <p className="text-sm text-gray-600 mb-6">SR Medical System | Last Updated: June 22, 2025</p>

                <p className="mb-6 text-gray-700">
                  SR Medical System is dedicated to ensuring customer satisfaction with our medical technology products and services. This Refund Policy outlines the conditions under which refunds may be requested.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1. Refund Eligibility</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-2">
                      <li>Refunds may be requested within <strong>7 days</strong> from the date of purchase.</li>
                      <li>Requests submitted after this period may not be considered.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">2. Refund Process</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-2">
                      <li>To initiate a refund, email <a href="mailto:info.srmedicalsystem@gmail.com" className="text-[#373086] hover:underline font-medium">info.srmedicalsystem@gmail.com</a> with your order details and the reason for your request.</li>
                      <li>Upon verification, approved refunds will be processed within <strong>4–8 business days</strong>.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">3. Refund Method</h3>
                    <p className="text-gray-700 text-sm ml-2">
                      Refunds will be issued to the original payment method used (e.g., bank account, UPI).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">4. Disputes and Governing Law</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-2">
                      <li><strong>Governing Law:</strong> This Refund Policy and all transactions related to the sale of SR Medical System products are governed by the laws of India.</li>
                      <li><strong>Dispute Resolution:</strong> In the event of any controversy, difference, or dispute arising out of or related to this Refund Policy, including its subject matter, existence, interpretation, validity, termination, or enforceability, the parties agree to meet and confer in good faith to attempt to resolve the dispute amicably within thirty (30) days from the date of written notification of the dispute by one party to the other.</li>
                      <li><strong>Arbitration:</strong> If the dispute cannot be resolved within the aforementioned period, it shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996 (as amended). The arbitration shall be conducted in English, with the seat of arbitration in Chennai, Tamil Nadu, India. The decision of the arbitral tribunal shall be final and binding on the parties.</li>
                      <li><strong>Legal Fees:</strong> If SR Medical System initiates an action for any relief or collection against the customer arising out of this Refund Policy or related transactions, the customer shall be responsible for SR Medical System's reasonable lawyer's fees and costs actually incurred.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">5. Contact Us</h3>
                    <p className="text-gray-700 text-sm ml-2 mb-2">For assistance with refunds, contact:</p>
                    <div className="text-gray-700 text-sm ml-2 space-y-1">
                      <p><strong>SR Medical System</strong></p>
                      <p>No:18, Bajanai Koil Street,</p>
                      <p>Rajakilpakkam, Chennai – 600073, Tamil Nadu, India</p>
                      <p><strong>Email:</strong> <a href="mailto:info.srmedicalsystem@gmail.com" className="text-[#373086] hover:underline">info.srmedicalsystem@gmail.com</a></p>
                      <p><strong>Website:</strong> <a href="https://www.srmedicalsystem.in" target="_blank" rel="noopener noreferrer" className="text-[#373086] hover:underline">https://www.srmedicalsystem.in</a></p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
