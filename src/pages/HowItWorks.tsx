import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Newsletter } from '@/components/containers/Home/Newsletter';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How our product works
          </h1>
          <p className="text-lg text-gray-600">
            Discover over 1,000 customizable events template available to you!
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Registration Flow Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Registration flow</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="login-registration" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Login & Registration:</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Create your account or log in to access our platform. Simply provide your email address and create a secure password to get started with event planning.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="forgot-password" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Forgot password</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  If you forget your password, use our secure password reset feature. Enter your email address and we'll send you a link to create a new password safely.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="change-password" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Change password</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Update your password anytime from your account settings. We recommend using a strong password with a combination of letters, numbers, and special characters.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="google-auth" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Google Authentication</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Sign in quickly and securely using your Google account. This provides a seamless login experience while maintaining the highest security standards.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* User Dashboard Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="dashboard-overview" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Dashboard Overview:</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Get a comprehensive view of all your events, templates, and activities. The dashboard provides quick access to your most important features and recent activity.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="event-management" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Event Management:</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Create, edit, and manage your events with ease. Use our intuitive interface to set up event details, manage attendees, and track event progress all in one place.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="template-library" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Template Library:</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Browse through our extensive collection of over 1,000 customizable event templates. Find the perfect template for your event type and customize it to match your needs.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="analytics-reports" className="bg-white rounded-lg border border-gray-200">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-medium">Analytics & Reports:</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-600">
                  Track your event performance with detailed analytics and reports. Monitor attendance, engagement, and other key metrics to improve your future events.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default HowItWorks;
