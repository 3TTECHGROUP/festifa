const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Terms and conditions for using our services
          </p>
        </div>
        
        <div className="prose prose-lg mx-auto space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using our services, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on our website 
              for personal, non-commercial transitory viewing only.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              The materials on our website are provided on an 'as is' basis. We make no warranties, 
              expressed or implied, and hereby disclaim and negate all other warranties.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p>
              In no event shall our company or its suppliers be liable for any damages arising 
              out of the use or inability to use the materials on our website.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@festifa.com" className="text-primary hover:underline ml-1">
                legal@festifa.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Terms
