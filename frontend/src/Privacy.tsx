import React from 'react';

import './styles/main.less';

type PageProps = {};

const PrivacyPage: React.FC<PageProps> = (props) => {
  return <div style={{padding: '55px'}}>
    <h2><a href="#collect">What information do we collect?</a></h2>
    <p>We do not collect information from you when you register on our site and when you use our site. Your data are personal
    and private, and we guarantee nobody else has access to it.</p>
    <p>When registering on our site, you may be asked to enter your name and e-mail address. You may, however, visit our
      site without registering. Your e-mail address will be verified by an email containing a unique link. If that link
      is visited, we know that you control the e-mail address.</p>
    <h2><a href="#use">What do we use your information for?</a></h2>
    <p>Any of the information we collect from you may be used in one of the following ways:</p>
    <ul>
      <li>To personalize your experience — your information helps us to better respond to your individual needs.</li>
      <li>To improve our site — we continually strive to improve our site offerings based on the information and
        feedback we receive from you.
      </li>
      <li>To improve customer service — your information helps us to more effectively respond to your customer service
        requests and support needs.
      </li>
      <li>To send periodic emails — The email address you provide may be used to send you information, notifications
        that you request about changes to topics or in response to your user name, respond to inquiries, and/or other
        requests or questions.
      </li>
    </ul>
    <h2><a href="#protect">How do we protect your information?</a></h2>
    <p>We implement a variety of security measures to maintain the safety of your personal information when you enter,
      submit, or access your personal information.</p>
    <h2><a href="#data-retention">What is your data retention policy?</a></h2>
    <p>We will make a good faith effort to:</p>
    <ul>
      <li>Retain server logs containing the IP address of all requests to this server no more than 90 days.</li>
      <li>Retain the IP addresses associated with registered users and their posts no more than 5 years.</li>
    </ul>
    <h2><a href="#cookies">Do we use cookies?</a></h2>
    <p>Yes. Cookies are small files that a site or its service provider transfers to your computer’s hard drive through
      your Web browser (if you allow). These cookies enable the site to recognize your browser and, if you have a
      registered account, associate it with your registered account.</p>
    <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site
      traffic and site interaction so that we can offer better site experiences and tools in the future. We may contract
      with third-party service providers to assist us in better understanding our site visitors. These service providers
      are not permitted to use the information collected on our behalf except to help us conduct and improve our
      business.</p>
    <h2><a href="#disclose">Do we disclose any information to outside parties?</a></h2>
    <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This
      does not include trusted third parties who assist us in operating our site, conducting our business, or servicing
      you, so long as those parties agree to keep this information confidential. We may also release your information
      when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or
      others rights, property, or safety. However, non-personally identifiable visitor information may be provided to
      other parties for marketing, advertising, or other uses.</p>
    <h2><a href="#third-party">Third party links</a></h2>
    <p>Occasionally, at our discretion, we may include or offer third party products or services on our site. These
      third party sites have separate and independent privacy policies. We therefore have no responsibility or liability
      for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site
      and welcome any feedback about these sites.</p>
    <h2><a href="#coppa">Children’s Online Privacy Protection Act Compliance</a></h2>
    <p>Our site, products and services are all directed to people of any age.</p>
    <h2><a href="#online">Online Privacy Policy Only</a></h2>
    <p>This online privacy policy applies only to information collected through our site and not to information
      collected offline.</p>
    <h2><a href="#consent">Your Consent</a></h2>
    <p>By using our site, you consent to our web site privacy policy.</p>
    <h2><a href="#changes">Changes to our Privacy Policy</a></h2>
    <p>If we decide to change our privacy policy, we will post those changes on this page.</p>
    <p>This document is CC-BY-SA. It was last updated May 5, 2020.</p>
  </div>
};

export default PrivacyPage;
