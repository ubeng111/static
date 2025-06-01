'use client'

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const TermsContent = () => {
  return (
    <Tabs>
      <div className="row y-gap-30">
        <div className="col-lg-3">
          <div className="px-30 py-30 rounded-4 border-light">
            <TabList className="tabs__controls row y-gap-10 js-tabs-controls">
              <Tab className="col-12 tabs__button js-tabs-button">
                General Terms of Use
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                Privacy Policy
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                Cookie Policy
              </Tab>
              <Tab className="col-12 tabs__button js-tabs-button">
                Best Price Guarantee
              </Tab>
            </TabList>
          </div>
        </div>
        {/* End .col-lg-3 */}

        <div className="col-lg-9">
          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">General Terms of Use</h1>
              <h2 className="text-16 fw-500">1. Introduction</h2>
              <p className="text-15 text-dark-1 mt-5">
                These Terms of Use (the "Terms") govern your use of our website and services. By accessing or using our site, you agree to comply with these terms. If you disagree with any of the terms, please do not use the site. We reserve the right to update these terms at any time, and we encourage you to review them periodically.
              </p>
              <h2 className="text-16 fw-500 mt-35">2. Acceptable Use</h2>
              <p className="text-15 text-dark-1 mt-5">
                You agree to use our services only for lawful purposes. You must not use the website in a manner that violates applicable laws or regulations or causes harm to the site, users, or third parties. This includes but is not limited to:
                <ul>
                  <li>Uploading malicious software or code</li>
                  <li>Interfering with the website’s normal operation</li>
                  <li>Distributing misleading or fraudulent content</li>
                </ul>
              </p>
              <h2 className="text-16 fw-500 mt-35">3. User Accounts</h2>
              <p className="text-15 text-dark-1 mt-5">
                To access certain features, you may need to create a user account. You are responsible for maintaining the confidentiality of your account and password, and for all activities that occur under your account. If you suspect any unauthorized use of your account, please contact us immediately.
              </p>
              <h2 className="text-16 fw-500 mt-35">4. Limitation of Liability</h2>
              <p className="text-15 text-dark-1 mt-5">
                Our liability to you for any damages arising out of or related to these terms is limited to the amount you have paid for the services within the last 12 months. We are not responsible for indirect, incidental, or consequential damages.
              </p>
            </div>
          </TabPanel>
          {/* End General Terms of Use */}

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">Privacy Policy</h1>
              <h2 className="text-16 fw-500">1. Information Collection</h2>
              <p className="text-15 text-dark-1 mt-5">
                We collect personal information when you use our services. This may include your name, email address, contact details, and payment information. We collect this information to provide you with better service, process transactions, and communicate with you.
              </p>
              <h2 className="text-16 fw-500 mt-35">2. Use of Information</h2>
              <p className="text-15 text-dark-1 mt-5">
                The information we collect is used to improve your experience on our website, including personalizing content, offering targeted ads, and enhancing security. We do not sell your personal data to third parties without your consent, except as required by law or to fulfill contractual obligations.
              </p>
              <h2 className="text-16 fw-500 mt-35">3. Data Security</h2>
              <p className="text-15 text-dark-1 mt-5">
                We implement reasonable security measures to protect your personal data. However, please be aware that no method of transmission over the internet is 100% secure. We cannot guarantee the absolute security of your data.
              </p>
              <h2 className="text-16 fw-500 mt-35">4. Your Rights</h2>
              <p className="text-15 text-dark-1 mt-5">
                You have the right to access, update, and delete your personal data at any time. You can also object to the processing of your data or request that we restrict its use. To exercise these rights, please contact us.
              </p>
            </div>
          </TabPanel>
          {/* End Privacy Policy */}

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">Cookie Policy</h1>
              <h2 className="text-16 fw-500">1. What are Cookies?</h2>
              <p className="text-15 text-dark-1 mt-5">
                Cookies are small text files stored on your device when you visit our website. They allow us to remember your preferences and actions, and provide a more personalized user experience.
              </p>
              <h2 className="text-16 fw-500 mt-35">2. Types of Cookies We Use</h2>
              <p className="text-15 text-dark-1 mt-5">
                We use the following types of cookies:
                <ul>
                  <li><strong>Essential Cookies</strong>: Necessary for the operation of the website.</li>
                  <li><strong>Performance Cookies</strong>: Used to analyze site traffic and improve performance.</li>
                  <li><strong>Functional Cookies</strong>: Allow us to remember your preferences and enhance functionality.</li>
                  <li><strong>Targeting Cookies</strong>: Used to provide personalized advertisements and content.</li>
                </ul>
              </p>
              <h2 className="text-16 fw-500 mt-35">3. How to Manage Cookies</h2>
              <p className="text-15 text-dark-1 mt-5">
                You can control the use of cookies through your browser settings. Most browsers allow you to block cookies or notify you when a cookie is being sent. Please note that disabling cookies may affect your ability to use some features of our site.
              </p>
              <h2 className="text-16 fw-500 mt-35">4. Changes to Cookie Policy</h2>
              <p className="text-15 text-dark-1 mt-5">
                We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. Please review this page regularly for the latest updates.
              </p>
            </div>
          </TabPanel>
          {/* End Cookie Policy */}

          <TabPanel>
            <div className="tabs__content js-tabs-content" data-aos="fade">
              <h1 className="text-30 fw-600 mb-15">Best Price Guarantee</h1>
              <h2 className="text-16 fw-500">1. Overview</h2>
              <p className="text-15 text-dark-1 mt-5">
                Our Best Price Guarantee ensures that you always get the best available price when booking with us. If you find a lower price elsewhere, we will match it or refund the difference.
              </p>
              <h2 className="text-16 fw-500 mt-35">2. Terms of the Guarantee</h2>
              <p className="text-15 text-dark-1 mt-5">
                To qualify for the Best Price Guarantee, the lower price must be for the same room type, dates, and conditions. The lower price must also be publicly available and verifiable.
              </p>
              <h2 className="text-16 fw-500 mt-35">3. Claim Process</h2>
              <p className="text-15 text-dark-1 mt-5">
                To claim the Best Price Guarantee, you must contact us within 24 hours of making your booking and provide proof of the lower price. Once we verify the claim, we will either match the price or refund the difference, depending on your preference.
              </p>
              <h2 className="text-16 fw-500 mt-35">4. Exclusions</h2>
              <p className="text-15 text-dark-1 mt-5">
                The Best Price Guarantee does not apply to offers that are part of limited-time promotions, special membership discounts, or non-refundable rates. We also do not match prices from auction sites or membership clubs.
              </p>
            </div>
          </TabPanel>
          {/* End Best Price Guarantee */}
        </div>
        {/* End col-lg-9 */}
      </div>
    </Tabs>
  );
};

export default TermsContent;
