import { useState } from 'react';
import { SelectField, TextField } from '../../common/Fields';
import { SlimLayout } from '../../common/SlimLayout';
import logo from '../../../assets/images/logo.jpeg';
import OnboardingService from '../../../services/OnboardingService';
import SuccessAlert from '../../common/SuccessAlert';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

export const metadata = {
  title: 'Audit-AI Registration',
};

export default function Register() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [referrer, setReferrer] = useState('');
  const [email, setEmail] = useState('');
  const [regStatus, setRegStatus] = useState(false);
  const [registrationData, setRegistrationData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...registrationData,
        FIRST_NAME: first_name,
        LAST_NAME: last_name,
        COMPANY: company,
        REFERRER: referrer,
        EMAIL: email,
      };

      const register = await OnboardingService.createRegistration(updatedData);
      if (register) {
        setRegStatus(true);
        
        const emailconfirmation = await OnboardingService.sendRegistrationConfirmation(updatedData)

        setTimeout(() => {
          navigate('/login');  // Navigate to login page
        }, 5000);  // Optionally, wait for a couple of seconds before redirecting
      }
    } catch (error) {
      setErrorMessage('There was a problem with the registration. Please try again.');
    }
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    switch (field) {
      case 'first_name':
        setFirstName(value);
        break;
      case 'last_name':
        setLastName(value);
        break;
      case 'company':
        setCompany(value);
        break;
      case 'referrer':
        setReferrer(value);
        break;
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  };

  return (
    <SlimLayout>
      <div className="flex justify-center w-full">
        <a href="/" aria-label="Home">
          <img alt="Audit-AI" src={logo} className="mx-auto h-10 w-auto" />
        </a>
      </div>
      <h2 className="mt-10 text-lg font-semibold text-gray-900 text-center">
        Get started for free
      </h2>
      <p className="mt-2 text-sm text-gray-700 text-center">
        Already registered?{' '}
        <a
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </a>{' '}
        to your account.
      </p>
      <form
        onSubmit={registerUser}
        className="mt-10 w-full max-w-lg mx-auto grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
      >
        <TextField
          label="First name"
          name="first_name"
          type="text"
          autoComplete="off"
          required
          value={first_name}
          onChange={(e) => handleChange(e, 'first_name')}
        />
        <TextField
          label="Last name"
          name="last_name"
          type="text"
          autoComplete="off"
          required
          value={last_name}
          onChange={(e) => handleChange(e, 'last_name')}
        />
        <TextField
          className="col-span-full"
          label="Email address"
          name="email"
          type="email"
          autoComplete="off"
          required
          value={email}
          onChange={(e) => handleChange(e, 'email')}
        />
        <TextField
          className="col-span-full"
          label="Company Name"
          name="company_name"
          type="text"
          autoComplete="off"
          required
          value={company}
          onChange={(e) => handleChange(e, 'company')}
        />
        <SelectField
          className="col-span-full"
          label="How did you hear about us?"
          name="referral_source"
          required
          value={referrer}
          onChange={(e) => handleChange(e, 'referrer')}
        >
          <option value=""></option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="youtube">YouTube</option>
          <option value="reddit">Reddit</option>
          <option value="github">GitHub</option>
          <option value="quora">Quora</option>
          <option value="medium">Medium</option>
          <option value="stack_overflow">Stack Overflow</option>
          <option value="other">Other</option>
        </SelectField>

        {/* Conditionally render SuccessAlert based on regStatus */}
        {regStatus && (
          <div className="col-span-full">
            <SuccessAlert
              title="Registration Complete"
              message="We’re excited to have you on board. Our team will reach out to you within the next few days to discuss the next steps and explore how we can support you. In the meantime, feel free to reach out if you have any questions or need assistance at support@auditai.com."
            />
          </div>
        )}

        <div className="col-span-full">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-[#0D6EFD] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0a58ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D6EFD]"
          >
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
          </button>
        </div>
      </form>
    </SlimLayout>
  );
}
