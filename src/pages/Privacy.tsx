const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            How we collect, use, and protect your information
          </p>
        </div>
        
        <div className="prose prose-lg mx-auto space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@festifa.com" className="text-primary hover:underline ml-1">
                privacy@festifa.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Privacy
